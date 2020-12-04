import Konva from 'konva'

import { getPointsDistance } from '../../utils/get-points-distance'

import { Board } from '../../Board'
import { Events } from '../../Events'

import { ShapeDrawer } from '../../ShapeDrawer'
import { DrawType } from '../../types'

export class Circle extends ShapeDrawer {
  /**
   * Demonstrates the circle shape that is being created
   */
  public shape: Konva.Circle

  /**
   * Creates a new circle builder component
   *
   * @param board The [[Board]]
   * @param events The [[Events]]
   */
  constructor(board: Board, events: Events) {
    super(board, events, DrawType.Circle)
  }

  /**
   * @inheritdoc
   * @override
   */
  public insert(config: Konva.CircleConfig) {
    return super.insert(config)
  }

  /**
   * @inheritdoc
   * @override
   */
  public draw(config: Partial<Konva.CircleConfig> = {}) {
    super.draw(config)
  }

  /**
   * @inheritdoc
   * @override
   */
  protected createShape(config: Konva.CircleConfig) {
    this.shape = new Konva.Circle(config)
    return this.board.addShape(this.shape)
  }

  /**
   * Starts drawing a circle shape
   */
  protected onStartDrawing() {
    super.onStartDrawing()

    this.createShape({
      x: this.startPoint.x,
      y: this.startPoint.y,
      radius: 0,
      ...this.config
    })
  }

  /**
   * Continues drawing the circle by changing its radius
   */
  protected onDrawing(e: Konva.KonvaEventObject<MouseEvent>) {
    super.onDrawing(e)

    if (!this.shape) {
      return
    }

    const point = this.board.stage.getPointerPosition()!

    this.shape.setAttrs({
      radius: getPointsDistance(point, this.getShapePosition())
    })

    this.board.draw()
  }
}
