import Konva from 'konva'

import { imageToDataUrl } from '../utils/image-to-url'
import { createImageFromUrl } from '../utils/create-image-from-url'

import { History } from '../History'
import { Events } from '../Events'
import { Selection } from '../Selection'

import { Shape } from '../Shape'

import type { Settings, DrawType } from '../types'
import { Flip } from '../Flip'

export class Board {
  /**
   *
   */
  public readonly stage: Konva.Stage

  /**
   *
   */
  public readonly layer: Konva.Layer

  /**
   *
   */
  public readonly container: HTMLDivElement

  /**
   *
   */
  public readonly settings: Settings

  /**
   *
   */
  public readonly backgroundImage: Konva.Image

  /**
   *
   */
  public readonly backgroundOverlay: Konva.Rect

  /**
   *
   */
  public readonly selection: Selection

  /**
   *
   */
  public activeDrawing: DrawType | null = null

  /**
   *
   */
  private shapes: Array<Shape> = []

  /**
   *
   */
  private readonly history: History

  /**
   *
   */
  private readonly events: Events

  /**
   *
   */
  private readonly flip: Flip

  constructor(settings: Settings, events: Events, history: History) {
    this.settings = settings
    this.history = history
    this.events = events

    const width = this.settings.width || this.settings.container.clientWidth
    const height = this.settings.height || this.settings.container.clientHeight

    // store settings
    this.settings = {
      ...this.settings,
      width,
      height
    }

    this.stage = new Konva.Stage({
      container: this.settings.container,
      width,
      height
    })

    // rename class name
    this.stage.content.className = 'pikaso'

    // set container position to center-center
    Object.assign(this.stage.content.style, {
      position: 'relative',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)'
    })

    this.stage.on('widthChange', this.rescale.bind(this))
    this.stage.on('heightChange', this.rescale.bind(this))

    this.layer = new Konva.Layer()
    this.stage.add(this.layer)

    this.backgroundImage = new Konva.Image()
    this.backgroundOverlay = new Konva.Rect()

    this.layer.add(this.backgroundImage, this.backgroundOverlay)

    this.selection = new Selection(this)
    this.flip = new Flip(this, events, history)

    this.container = this.settings.container
  }

  /**
   * returns the stage dimensions
   */
  public getDimensions() {
    return {
      width:
        this.backgroundImage.width() ||
        this.backgroundOverlay.width() ||
        this.stage.width() ||
        this.settings.width!,
      height:
        this.backgroundImage.height() ||
        this.backgroundOverlay.height() ||
        this.stage.height() ||
        this.settings.height!
    }
  }

  /**
   * returns the background position
   */
  public getPosition() {
    return {
      x: this.backgroundImage.x() || this.backgroundOverlay.x(),
      y: this.backgroundImage.y() || this.backgroundOverlay.y()
    }
  }

  /**
   *
   */
  public getBackgroundNodes() {
    return [this.backgroundImage, this.backgroundOverlay]
  }

  /**
   *
   */
  public getNodes() {
    return [
      ...this.getBackgroundNodes(),
      ...this.getShapes().map(shape => shape.node)
    ]
  }

  /**
   *
   */
  public getShapes() {
    return this.shapes.filter(shape => !shape.isDeleted)
  }

  /**
   *
   */
  public setShapes(shapes: Shape[]) {
    this.shapes = shapes
  }

  /**
   *
   */
  public rescale() {
    const transform = this.getContainerTransform()

    if (this.stage.content.style.transform === transform) {
      return
    }

    this.stage.content.style.transform = transform
  }

  /**
   *
   * @param file
   */
  public async setBackgroundImageFromFile(file: File) {
    const url = await imageToDataUrl(file)

    this.setBackgroundImageFromUrl(url)
  }

  /**
   *
   * @param url
   */
  public async setBackgroundImageFromUrl(url: string) {
    this.history.create(
      this.layer,
      [
        this.history.getNodeState(this.stage),
        this.history.getNodeState(this.backgroundImage),
        this.history.getNodeState(this.backgroundOverlay)
      ],
      this.rescale.bind(this)
    )

    const background = await createImageFromUrl(url)

    this.stage.setAttrs({
      width: background.width(),
      height: background.height()
    })

    this.backgroundImage.setAttrs({
      width: background.width(),
      height: background.height(),
      image: background.image()
    })

    this.backgroundOverlay.setAttrs({
      width: background.width(),
      height: background.height()
    })

    this.layer.batchDraw()
  }

  /**
   *
   * @param color
   */
  public fill(color: string) {
    this.history.create(
      this.layer,
      this.history.getNodeState(this.backgroundOverlay)
    )

    this.backgroundOverlay.setAttrs({
      width: this.stage.width(),
      height: this.stage.height(),
      fill: color
    })

    this.layer.draw()
  }

  /**
   * flips the image horizontally
   */
  public flipX() {
    if (!this.backgroundImage.getAttr('image')) {
      return
    }

    this.flip.horizontal([this.backgroundImage])
  }

  /**
   * flips the main image vertically
   */
  public flipY() {
    if (!this.backgroundImage.getAttr('image')) {
      return
    }

    this.flip.vertical([this.backgroundImage])
  }

  /**
   *
   * @param shape
   */
  public addShape(
    node: Konva.Group | Konva.Shape,
    transformerConfig: Konva.TransformerConfig = {}
  ) {
    node.setAttrs({
      draggable: true
    })

    const shape = new Shape(
      this,
      this.events,
      this.history,
      node,
      transformerConfig
    )
    this.shapes = [...this.shapes, shape]

    this.layer.add(node)
    this.layer.draw()

    this.history.create(this.layer, [], {
      undo: () => shape.delete(),
      redo: () => shape.undelete()
    })

    return shape
  }

  /**
   *
   */
  public setActiveDrawing(mode: DrawType | null) {
    if (mode) {
      this.selection.transformer.hide()
      this.layer.draw()
    }

    this.activeDrawing = mode
  }

  /**
   *
   * @param container
   * @param stage
   * @param size
   */
  public getContainerTransform() {
    const size = this.getDimensions()

    let scale =
      this.container.clientWidth < this.container.clientHeight
        ? this.stage.width() / size.width
        : this.stage.height() / size.height

    if (scale * this.stage.width() > this.container.clientWidth) {
      scale = this.container.clientWidth / this.stage.width()
    }

    if (scale * this.stage.height() > this.container.clientHeight) {
      scale = this.container.clientHeight / this.stage.height()
    }

    return `translate(-50%, -50%) scale(${scale.toFixed(6)})`
  }

  /**
   *
   */
  public gc() {
    this.shapes.forEach(shape => shape.gc())
  }
}
