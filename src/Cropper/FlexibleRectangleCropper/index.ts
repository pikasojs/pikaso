import type { Context } from 'konva/lib/Context'

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
