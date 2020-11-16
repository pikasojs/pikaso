import type { Context } from 'konva/types/Context'

import { FlexibleCropper } from '../FlexibleCropper'
import { Board } from '../../Board'

import type { RectangleCropperOptions } from '../../types'

export class FlexibleRectangleCropper extends FlexibleCropper {
  constructor(board: Board, options: Partial<RectangleCropperOptions>) {
    super(board, options)

    this.setupOverlay()
    this.layer.batchDraw()
  }

  /**
   *
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

        ctx.fillStyle = this.options.overlayColor
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
