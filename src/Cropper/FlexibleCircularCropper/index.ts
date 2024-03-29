import type { Context } from 'konva/lib/Context'

import { Board } from '../../Board'
import { FlexibleCropper } from '../FlexibleCropper'

import type { CircularCropperOptions } from '../../types'

/**
 * @internal
 */
export class FlexibleCircularCropper extends FlexibleCropper {
  /**
   * Creates a flexible circular instance
   *
   * @param board The [[Board]]
   * @param options The [[RectangleCropperOptions]]
   */
  constructor(board: Board, options: Partial<CircularCropperOptions>) {
    super(board, {
      ...options,
      circular: true,
      keepRatio: true
    })

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

        const radius = this.transformer.width() / 2

        ctx.arc(
          this.cropzone.x(),
          this.cropzone.y(),
          radius,
          0,
          2 * Math.PI,
          false
        )
        ctx.clip()
        ctx.clearRect(
          this.cropzone.x() - radius,
          this.cropzone.y() - radius,
          radius * 2,
          radius * 2
        )

        ctx.closePath()
        ctx.fillStrokeShape(shape)
      }
    )
  }
}
