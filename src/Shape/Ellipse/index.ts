import Konva from 'konva'

import { Board } from '../../Board'
import { Events } from '../../Events'

import { ShapeDrawer } from '../../ShapeDrawer'
import { DrawType } from '../../types'

export class Ellipse extends ShapeDrawer {
  /**
   * Demonstrates the ellipse shape that is being created
   */
  public shape: Konva.Ellipse

  /**
   * Creates a new ellipse builder component
   *
   * @param board The [[Board]]
   * @param events The [[Events]]
   */
  constructor(board: Board, events: Events) {
    super(board, events, DrawType.Ellipse)
  }

  /**
   * @inheritdoc
   * @override
   */
  public insert(config: Konva.EllipseConfig) {
    return super.insert(config)
  }

  /**
   * @inheritdoc
   * @override
   */
  public draw(config: Partial<Konva.EllipseConfig> = {}) {
    super.draw(config)
  }

  /**
   * @inheritdoc
   * @override
   */
  protected createShape(config: Konva.EllipseConfig) {
    this.shape = new Konva.Ellipse(config)

    return this.board.addShape(this.shape)
  }

  /**
   * Starts drawing an ellipse shape
   */
  protected onStartDrawing() {
    super.onStartDrawing()

    if (!this.isDrawing) {
      return
    }

    this.createShape({
      x: this.startPoint.x,
      y: this.startPoint.y,
      radiusX: 0,
      radiusY: 0,
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

    const radiusX = Math.abs(point.x - this.shape.x())
    const radiusY = Math.abs(point.y - this.shape.y())

    this.shape.setAttrs({
      radiusX,
      radiusY: e.evt.shiftKey ? radiusX : radiusY
    })

    this.board.draw()
  }
}
