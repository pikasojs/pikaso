import Konva from 'konva'

import { getPointsDistance } from '../../../utils/get-points-distance'

import { Board } from '../../../Board'

import { ShapeDrawer } from '../../ShapeDrawer'
import { CircleModel } from '../../models/CircleModel'

import { DrawType } from '../../../types'

export class CircleDrawer extends ShapeDrawer<
  Konva.Circle,
  Konva.CircleConfig
> {
  /**
   * Demonstrates the circle node that is being created
   */
  public node: Konva.Circle

  /**
   * Creates a new circle builder component
   *
   * @param board The [[Board]]
   */
  constructor(board: Board) {
    super(board, DrawType.Circle)
  }

  /**
   * @inheritdoc
   * @override
   */
  public insert(config: Konva.CircleConfig): CircleModel {
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
  protected createShape(config: Konva.CircleConfig): CircleModel {
    this.node = new Konva.Circle(config)

    return new CircleModel(this.board, this.node)
  }

  /**
   * Starts drawing a circle shape
   */
  protected onStartDrawing() {
    super.onStartDrawing()

    if (!this.isDrawing) {
      return
    }

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

    if (!this.node) {
      return
    }

    const point = this.board.stage.getPointerPosition()!

    this.node.setAttrs({
      radius: getPointsDistance(point, this.getShapePosition())
    })
  }
}
