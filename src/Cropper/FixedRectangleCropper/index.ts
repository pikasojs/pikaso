import type { Context } from 'konva/lib/Context'

import { FixedCropper } from '../FixedCropper'
import { Board } from '../../Board'

import type { Point, Dimensions, RectangleCropperOptions } from '../../types'

/**
 * @internal
 */
export class FixedRectangleCropper extends FixedCropper {
  constructor(board: Board, options: Partial<RectangleCropperOptions>) {
    super(board, options)

    this.setupOverlay()
  }

  /**
   * Returns the rect bound of the cropping area
   */
  public getRect(): (Point & Dimensions) | null {
    const options = <RectangleCropperOptions>this.options

    const scaleX = this.draggable.width() / this.layer.width()
    const scaleY = this.draggable.height() / this.layer.height()

    return {
      x: (options.x - this.draggable.x()) / scaleX,
      y: (options.y - this.draggable.y()) / scaleY,
      width: options.width / scaleX,
      height: options.height / scaleY
    }
  }

  /**
   * Setups the overlay
   */
  protected setupOverlay() {
    const options = <RectangleCropperOptions>this.options

    this.overlay.sceneFunc(
      (
        ctx: Context & {
          fillStyle?: string
        },
        shape
      ) => {
        ctx.beginPath()

        ctx.clearRect(options.x, options.y, options.width, options.height)

        ctx.closePath()
        ctx.fillStrokeShape(shape)
      }
    )
  }
}
