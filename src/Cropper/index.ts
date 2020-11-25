import { Board } from '../Board'
import { Events } from '../Events'
import { History } from '../History'

import { createImageFromUrl } from '../utils/create-image-from-url'
import { getRotatedPoint } from '../utils/get-rotated-point'
import { convertDegreeToRadian } from '../utils/degree-to-radian'

import { FixedCircularCropper } from './FixedCircularCropper'
import { FixedRectangleCropper } from './FixedRectangleCropper'
import { FlexibleCircularCropper } from './FlexibleCircularCropper'
import { FlexibleRectangleCropper } from './FlexibleRectangleCropper'

import type { CropOptions, CropperOptions, Point } from '../types'

type FixedCropper = FixedCircularCropper | FixedRectangleCropper
type FlexibleCropper = FlexibleCircularCropper | FlexibleRectangleCropper

export class Cropper {
  /**
   *
   */
  private readonly board: Board

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
  private instance:
    | FixedCircularCropper
    | FixedRectangleCropper
    | FlexibleCircularCropper
    | FlexibleRectangleCropper

  /**
   *
   */
  private active: boolean

  constructor(canvas: Board, events: Events, history: History) {
    this.board = canvas
    this.events = events
    this.history = history
  }

  /**
   *
   */
  public isActive() {
    return this.active
  }

  /**
   *
   */
  public getInstance() {
    return this.instance
  }

  /**
   *
   */
  public start(options: Partial<CropperOptions>) {
    if (this.active) {
      return
    }

    this.active = true

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
   *
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

    this.board.layer.batchDraw()
    this.board.stage.container().style.cursor = 'default'
  }

  /**
   *
   * @param value
   */
  public zoom(value: number) {
    if (!this.instance.options.fixed) {
      return false
    }

    const instance = <FixedCropper>this.instance
    instance.zoom(value)
  }

  /**
   *
   * @param param
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
   *
   */
  public async crop(options: Partial<CropOptions> = {}) {
    const rect = options.rect || this.instance.getRect()

    if (!rect) {
      return null
    }

    this.history.create(this.board.stage, [
      this.board.stage,
      ...this.board.layer.children.toArray().map(node => node)
    ])

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

    this.board.backgroundOverlay.hide()
    this.board.getShapes().forEach(shape => {
      shape.node.hide()
    })

    // create a snapshot from background image
    const snapshot = await createImageFromUrl(
      this.board.stage.toDataURL({
        pixelRatio: 1
      })
    )

    this.board.getBackgroundNodes().forEach(node => {
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

    this.board.backgroundImage.setAttrs({
      image: snapshot.image()
    })

    this.board.getShapes().forEach(shape => {
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
          scale: {
            x: node.scaleX() * stage.scaleX(),
            y: node.scaleY() * stage.scaleY()
          }
        })
        .show()
    })

    this.board.backgroundOverlay.show()

    stage.setAttrs({
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      x: 0,
      y: 0
    })

    stage.batchDraw()

    // emit crop event
    // this.events.emit('crop', { rect })
  }
}
