import Konva from 'konva'

import { History } from '../History'
import { Events } from '../Events'
import { Selection } from '../Selection'

import { Shape } from '../Shape'
import { Background } from '../Shape/Background'

import type { Settings, DrawType } from '../types'

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
  public readonly background: Background

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

    // disable context menu
    this.settings.container.addEventListener('contextmenu', (e: MouseEvent) =>
      e.preventDefault()
    )

    this.layer = new Konva.Layer()
    this.stage.add(this.layer)

    this.selection = new Selection(this, events, history)
    this.background = new Background(this, events, history)

    this.container = this.settings.container
  }

  /**
   * returns the stage dimensions
   */
  public getDimensions() {
    return {
      width:
        this.background.image.node.width() ||
        this.background.overlay.node.width() ||
        this.stage.width() ||
        this.settings.width!,
      height:
        this.background.image.node.height() ||
        this.background.overlay.node.height() ||
        this.stage.height() ||
        this.settings.height!
    }
  }

  /**
   * returns the background position
   */
  public getPosition() {
    return {
      x: this.background.image.node.x() || this.background.overlay.node.x(),
      y: this.background.image.node.y() || this.background.overlay.node.y()
    }
  }

  /**
   *
   */
  public getNodes() {
    return [
      ...this.background.nodes,
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

    this.events.emit('board:rescale', {
      data: {
        transform
      }
    })
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

    const shape = new Shape(this, this.events, this.history, node, {
      transformer: transformerConfig
    })
    this.shapes = [...this.shapes, shape]

    this.layer.add(node)
    this.layer.draw()

    this.history.create(this.layer, [], {
      undo: () => shape.delete(),
      redo: () => shape.undelete()
    })

    this.events.emit('shape:create', {
      shapes: [shape]
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

    if (mode !== this.activeDrawing) {
      this.events.emit('board:change-active-drawing', {
        data: {
          type: mode
        }
      })
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
    this.events.emit('board:gc')
  }
}
