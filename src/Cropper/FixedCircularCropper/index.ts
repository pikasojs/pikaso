import { Context } from 'konva/types/Context'

import { FixedCropper } from '../FixedCropper'
import { Board } from '../../Board'

import type { CircularCropperOptions, Point, Dimensions } from '../../types'

/**
 * @internal
 */
export class FixedCircularCropper extends FixedCropper {
  constructor(board: Board, options: Partial<CircularCropperOptions>) {
    super(board, {
      ...options,
      keepRatio: true
    })

    this.setupOverlay()
    this.layer.batchDraw()
  }

  /**
   * Returns the rect bound of the cropping area
   */
  public getRect(): (Point & Dimensions) | null {
    const options = <CircularCropperOptions>this.options

    const scaleX = this.draggable.width() / this.layer.width()
    const scaleY = this.draggable.height() / this.layer.height()

    return {
      x: (options.x - options.radius - this.draggable.x()) / scaleX,
      y: (options.y - options.radius - this.draggable.y()) / scaleY,
      width: (options.radius * 2) / scaleX,
      height: (options.radius * 2) / scaleY
    }
  }

  /**
   * Setups the overlay
   */
  protected setupOverlay() {
    const options = <CircularCropperOptions>this.options

    this.overlay.sceneFunc(
      (
        ctx: Context & {
          fillStyle?: string
        },
        shape
      ) => {
        ctx.beginPath()

        ctx.fillStyle = options.overlay.color
        ctx.fillRect(0, 0, shape.width(), shape.height())

        ctx.arc(options.x, options.y, options.radius, 0, 2 * Math.PI, false)
        ctx.clip()
        ctx.clearRect(
          options.x - options.radius,
          options.y - options.radius,
          options.radius * 2,
          options.radius * 2
        )

        ctx.closePath()
        ctx.fillStrokeShape(shape)
      }
    )
  }
}
