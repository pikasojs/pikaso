import Konva from 'konva'

import { getPointsDistance } from '../../utils/get-points-distance'

import { Board } from '../../Board'
import { Events } from '../../Events'
import { ShapeDrawer } from '../../ShapeDrawer'

import { DrawType } from '../../types'

interface TriangleConfig extends Omit<Konva.RegularPolygonConfig, 'sides'> {
  sides?: 3
}

export class Triangle extends ShapeDrawer {
  /**
   * Demonstrates the triangle (polygon) shape that is being created
   */
  public shape: Konva.RegularPolygon

  /**
   * Creates a new triangle (polygon) builder component
   *
   * @param board The [[Board]]
   * @param events The [[Events]]
   */
  constructor(board: Board, events: Events) {
    super(board, events, DrawType.Triangle)
  }

  /**
   * @inheritdoc
   * @override
   */
  public insert(config: TriangleConfig) {
    return super.insert(config)
  }

  /**
   * @inheritdoc
   * @override
   */
  public draw(config: Partial<TriangleConfig> = {}) {
    super.draw({
      ...config,
      sides: 3
    })
  }

  /**
   * @inheritdoc
   * @override
   */
  protected createShape(config: TriangleConfig) {
    this.shape = new Konva.RegularPolygon({
      radius: 10,
      sides: 3,
      ...config
    })

    return this.board.addShape(this.shape)
  }

  /**
   * Starts drawing a triangle (polygon) shape
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
   * Continues drawing the triangle (polygon) by changing its radius
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
