import Konva from 'konva'

import { BaseCropper } from '../BaseCropper'
import { Board } from '../../Board'

import type { CropperOptions, Point, Dimensions } from '../../types'

export abstract class FlexibleCropper extends BaseCropper {
  /**
   *
   */
  protected readonly transformer: Konva.Transformer

  constructor(board: Board, options: Partial<CropperOptions>) {
    super(board, options)

    this.transformer = this.createTransformer()
    this.layer.add(this.transformer)

    this.setupCropzone()

    this.board.stage.add(this.layer)
    this.layer.batchDraw()
  }

  /**
   *
   */
  public setPosition(
    { x, y }: Point = { x: this.options.x, y: this.options.y }
  ) {
    const { x: left, y: top } = this.getCropzoneBoundRect({ x, y })

    this.cropzone.x(left)
    this.cropzone.y(top)

    this.layer.batchDraw()
  }

  /**
   *
   */
  public getRect(): (Point & Dimensions) | null {
    return {
      x: this.transformer.x(),
      y: this.transformer.y(),
      width: this.transformer.width(),
      height: this.transformer.height()
    }
  }

  /**
   *
   */
  protected setupCropzone() {
    this.cropzone.draggable(true)
    this.cropzone.dragBoundFunc(pos => this.getCropzoneBoundRect(pos))
  }

  /**
   *
   * @param pos
   */
  private getCropzoneBoundRect(pos: Point): Point {
    const minX =
      (this.options.circular ? this.transformer.width() / 2 : 0) +
      this.options.borderWidth

    const minY =
      (this.options.circular ? this.transformer.height() / 2 : 0) +
      this.options.borderWidth

    const maxX =
      (this.options.circular
        ? this.board.stage.width() - this.transformer.width() / 2
        : this.board.stage.width() - this.transformer.width()) -
      this.options.borderWidth

    const maxY =
      (this.options.circular
        ? this.board.stage.height() - this.transformer.height() / 2
        : this.board.stage.height() - this.transformer.height()) -
      this.options.borderWidth

    const x = pos.x <= minX ? Math.max(pos.x, minX) : Math.min(pos.x, maxX)
    const y = pos.y <= minY ? Math.max(pos.y, minY) : Math.min(pos.y, maxY)

    return { x, y }
  }

  /**
   *
   */
  private createTransformer() {
    return new Konva.Transformer({
      nodes: [this.cropzone],
      keepRatio: this.options.keepRatio,
      rotateEnabled: false,
      anchorSize: this.options.anchorSize,
      anchorFill: this.options.anchorColor,
      anchorStroke: this.options.anchorBorderColor,
      borderDash: this.options.borderDash,
      borderStroke: this.options.borderColor,
      borderStrokeWidth: this.options.borderWidth,
      enabledAnchors: [
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
        ...(!this.options.keepRatio ? ['top-center', 'bottom-center'] : [])
      ],
      boundBoxFunc: (oldBox, newBox) => {
        if (Math.ceil(newBox.x) < -1 || Math.ceil(newBox.y) < -1) {
          return oldBox
        }

        if (
          newBox.width < this.options.minWidth ||
          newBox.height < this.options.minHeight ||
          newBox.width >= this.board.stage.width() ||
          newBox.height >= this.board.stage.height() ||
          newBox.x + newBox.width >= this.board.stage.width() ||
          newBox.y + newBox.height >= this.board.stage.height()
        ) {
          return oldBox
        }

        return newBox
      }
    })
  }
}
