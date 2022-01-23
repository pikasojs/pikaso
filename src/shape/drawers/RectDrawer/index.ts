import Konva from 'konva'

import { Board } from '../../../Board'

import { ShapeDrawer } from '../../ShapeDrawer'
import { RectModel } from '../../models/RectModel'

import { DrawType } from '../../../types'

export class RectDrawer extends ShapeDrawer<Konva.Rect, Konva.RectConfig> {
  /**
   * Demonstrates the rect node that is being created
   */
  public node: Konva.Rect

  /**
   * Creates a new rect builder component
   *
   * @param board The [[Board]]
   */
  constructor(board: Board) {
    super(board, DrawType.Rect)
  }

  /**
   * @inheritdoc
   * @override
   */
  public insert(config: Konva.RectConfig): RectModel {
    return super.insert(config)
  }

  /**
   * @inheritdoc
   * @override
   */
  public draw(config: Partial<Konva.RectConfig> = {}) {
    super.draw(config)
  }

  /**
   * @inheritdoc
   * @override
   */
  protected createShape(config: Konva.RectConfig): RectModel {
    this.node = new Konva.Rect(config)

    return new RectModel(this.board, this.node)
  }

  /**
   * Starts drawing a rectangle shape
   */
  protected onStartDrawing() {
    super.onStartDrawing()

    if (!this.isDrawing) {
      return
    }

    this.createShape({
      x: this.startPoint.x,
      y: this.startPoint.y,
      ...this.config
    })
  }

  /**
   * Continues drawing the ellipse by changing its radius values
   */
  protected onDrawing(e: Konva.KonvaEventObject<MouseEvent>) {
    super.onDrawing(e)

    if (!this.node) {
      return
    }

    const point = this.board.stage.getPointerPosition()!

    const width = Math.abs(point.x - this.startPoint.x)
    const height = Math.abs(point.y - this.startPoint.y)

    this.node.setAttrs({
      x: Math.min(this.startPoint.x, point.x),
      y: Math.min(this.startPoint.y, point.y),
      width,
      height: e.evt.shiftKey ? width : height
    })
  }
}
