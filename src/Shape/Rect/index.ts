import Konva from 'konva'

import { Board } from '../../Board'
import { Events } from '../../Events'

import { ShapeDrawer } from '../../ShapeDrawer'
import { DrawType } from '../../types'

export class Rect extends ShapeDrawer {
  /**
   * Demonstrates the rect shape that is being created
   */
  public shape: Konva.Rect

  /**
   * Creates a new rect builder component
   *
   * @param board The [[Board]]
   * @param events The [[Events]]
   */
  constructor(board: Board, events: Events) {
    super(board, events, DrawType.Rect)
  }

  /**
   * @inheritdoc
   * @override
   */
  public insert(config: Konva.RectConfig) {
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
  protected createShape(config: Konva.RectConfig) {
    this.shape = new Konva.Rect(config)

    return this.board.addShape(this.shape)
  }

  /**
   * Starts drawing a rectangle shape
   */
  protected onStartDrawing() {
    super.onStartDrawing()

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

    if (!this.shape) {
      return
    }

    const point = this.board.stage.getPointerPosition()!

    const width = Math.abs(point.x - this.startPoint.x)
    const height = Math.abs(point.y - this.startPoint.y)

    this.shape.setAttrs({
      x: Math.min(this.startPoint.x, point.x),
      y: Math.min(this.startPoint.y, point.y),
      width,
      height: e.evt.shiftKey ? width : height
    })

    this.board.draw()
  }
}
