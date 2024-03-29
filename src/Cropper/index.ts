import merge from 'deepmerge'

import { Board } from '../Board'

import { createImageFromUrl } from '../utils/create-image-from-url'
import { getRotatedPoint } from '../utils/get-rotated-point'
import { convertDegreeToRadian } from '../utils/degree-to-radian'

import { FixedCircularCropper } from './FixedCircularCropper'
import { FixedRectangleCropper } from './FixedRectangleCropper'
import { FlexibleCircularCropper } from './FlexibleCircularCropper'
import { FlexibleRectangleCropper } from './FlexibleRectangleCropper'

import { defaultSettings } from '../defaultSettings'
import { isBrowser } from '../utils/detect-environment'

import type { CropOptions, CropperOptions, Dimensions, Point } from '../types'

type FixedCropper = FixedCircularCropper | FixedRectangleCropper
type FlexibleCropper = FlexibleCircularCropper | FlexibleRectangleCropper

export class Cropper {
  /**
   * Represents the [[Board]]
   */
  private readonly board: Board

  /**
   * Represents the current cropper instance
   */
  private instance:
    | FixedCircularCropper
    | FixedRectangleCropper
    | FlexibleCircularCropper
    | FlexibleRectangleCropper

  /**
   * Represents the cropper is active or not
   */
  private active: boolean

  /**
   * Creates a new cropper instance
   *
   * @param board The [[Board]]
   */
  constructor(board: Board) {
    this.board = board
  }

  /**
   * Returns whether the cropper is active or not
   */
  public get isActive() {
    return this.active
  }

  /**
   * Returns the active cropper instance
   */
  public getInstance() {
    return this.instance
  }

  /**
   * Starts the cropper
   *
   * @param cropperOptions [[CropperOptions]]
   */
  public start(cropperOptions: Partial<CropperOptions>) {
    if (this.active) {
      return
    }

    const options = merge(defaultSettings.cropper!, cropperOptions)

    this.active = true

    // deselect all shapes
    this.board.selection.deselectAll()

    const isCircular = options.circular
    const isFixed = options.fixed && this.board.stage.rotation() === 0

    if (!isFixed && isCircular) {
      this.instance = new FlexibleCircularCropper(this.board, {
        ...options,
        fixed: false,
        circular: true
      })
    }

    if (!isFixed && !isCircular) {
      this.instance = new FlexibleRectangleCropper(this.board, {
        ...options,
        fixed: false,
        circular: false
      })
    }

    if (isFixed && isCircular) {
      this.instance = new FixedCircularCropper(this.board, {
        ...options,
        fixed: true,
        circular: true
      })
    }

    if (isFixed && !isCircular) {
      this.instance = new FixedRectangleCropper(this.board, {
        ...options,
        fixed: true,
        circular: false
      })
    }
  }

  /**
   * Stops the active cropper
   */
  public stop() {
    if (!this.active) {
      return
    }

    this.active = false

    this.instance.layer.remove()

    this.board.layer.setAttrs({
      x: 0,
      y: 0,
      scale: {
        x: 1,
        y: 1
      }
    })

    if (isBrowser()) {
      this.board.stage.container().style.cursor = 'default'
    }
  }

  /**
   * Zooms on the board. It only works in `fixed` mode
   *
   * @param value The zooming value
   */
  public zoom(value: number) {
    if (!this.instance.options.fixed) {
      return false
    }

    const instance = <FixedCropper>this.instance
    instance.zoom(value)
  }

  /**
   * Changes position of cropper zone
   *
   * @param point The [[Point]]
   */
  public setPosition(point: Point) {
    let instance: FixedCropper | FlexibleCropper

    if (this.instance.options.fixed) {
      instance = <FixedCropper>this.instance
      instance.setDraggableOverlayPosition(point)

      return
    }

    instance = <FlexibleCropper>this.instance
    instance.setPosition(point)
  }

  /**
   * Returns current rect of the cropper
   *
   * @returns left, top, width and height of the cropzone rect
   */
  public getRect(): (Point & Dimensions) | null {
    if (!this.isActive) {
      return null
    }

    return this.instance.getRect()
  }

  /**
   * Crops the selected area
   *
   * @param options The [[CropOptions | options]]
   */
  public async crop(options: Partial<CropOptions> = {}) {
    const rect = options.rect || this.getRect()

    if (!rect) {
      return null
    }

    this.board.history.create(this.board.stage, [
      this.board.stage,
      ...(this.board.layer.children || [])
    ])

    const isTransformerVisible = this.board.selection.isVisible

    this.stop()

    const stage = this.board.stage

    const ratio = Math.min(
      stage.width() / rect.width,
      stage.height() / rect.height
    )

    stage.setAttrs({
      scale: {
        x: ratio * stage.scaleX(),
        y: ratio * stage.scaleY()
      },
      width: rect.width * ratio,
      height: rect.height * ratio,
      x: -rect.x * ratio + stage.x() * ratio,
      y: -rect.y * ratio + stage.y() * ratio,
      rotation: stage.rotation()
    })

    this.board.background.overlay.hide()

    isTransformerVisible && this.board.selection.transformer.hide()

    this.board.activeShapes.forEach(shape => {
      if (shape.hasGroup()) {
        return
      }

      shape.node.hide()
    })

    // create a snapshot from background image
    const snapshot = await createImageFromUrl(
      this.board.stage.toDataURL({
        pixelRatio: 1
      })
    )

    this.board.background.nodes.forEach(node => {
      node.setAttrs({
        width: snapshot.width(),
        height: snapshot.height(),
        rotation: 0,
        x: 0,
        y: 0,
        scale: {
          x: 1,
          y: 1
        }
      })
    })

    this.board.background.image.node.setAttrs({
      image: snapshot.image()
    })

    this.board.shapes.forEach(shape => {
      if (shape.isDeleted || shape.hasGroup()) {
        return
      }

      const node = shape.node

      const center = getRotatedPoint(
        {
          x: node.x(),
          y: node.y()
        },
        convertDegreeToRadian(stage.rotation())
      )

      node
        .setAttrs({
          rotation: node.rotation(),
          x: center.x * stage.scaleX() + stage.x(),
          y: center.y * stage.scaleY() + stage.y(),
          scaleX: node.scaleX() * stage.scaleX(),
          scaleY: node.scaleY() * stage.scaleY()
        })
        .show()
    })

    this.board.background.overlay.show()
    isTransformerVisible && this.board.selection.transformer.show()

    stage.setAttrs({
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      x: 0,
      y: 0
    })

    stage.batchDraw()

    this.board.events.emit('crop', {
      data: {
        options,
        rect
      }
    })

    return rect
  }
}
