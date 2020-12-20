import type { Context } from 'konva/types/Context'

import { Board } from '../../Board'
import { FlexibleCropper } from '../FlexibleCropper'

import type { RectangleCropperOptions } from '../../types'

/**
 * @internal
 */
export class FlexibleRectangleCropper extends FlexibleCropper {
  /**
   * Creates a flexible rectanglular instance
   *
   * @param board The [[Board]]
   * @param options The [[RectangleCropperOptions]]
   */
  constructor(board: Board, options: Partial<RectangleCropperOptions>) {
    super(board, options)

    this.setupOverlay()
    this.layer.batchDraw()
  }

  /**
   * Setups the overlay
   */
  protected setupOverlay() {
    this.overlay.sceneFunc(
      (
        ctx: Context & {
          fillStyle?: string
        },
        shape
      ) => {
        ctx.beginPath()

        ctx.fillStyle = this.options.overlay.color
        ctx.fillRect(0, 0, shape.width(), shape.height())

        ctx.clearRect(
          this.cropzone.x(),
          this.cropzone.y(),
          this.transformer.width(),
          this.transformer.height()
        )

        ctx.closePath()
        ctx.fillStrokeShape(shape)
      }
    )
  }
}
