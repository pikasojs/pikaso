import Konva from 'konva'

import { getPointsDistance } from '../../utils/get-points-distance'

import { Board } from '../../Board'
import { Events } from '../../Events'

import { ShapeDrawer } from '../../ShapeDrawer'
import { DrawType } from '../../types'

export class Polygon extends ShapeDrawer {
  /**
   * Demonstrates the polygon shape that is being created
   */
  public shape: Konva.RegularPolygon

  /**
   * Creates a new polygon builder component
   *
   * @param board The [[Board]]
   * @param events The [[Events]]
   */
  constructor(board: Board, events: Events) {
    super(board, events, DrawType.Polygon)
  }

  /**
   * @inheritdoc
   * @override
   */
  public insert(config: Konva.RegularPolygonConfig) {
    return super.insert(config)
  }

  /**
   * @inheritdoc
   * @override
   */
  public draw(config: Partial<Konva.RegularPolygonConfig> = {}) {
    super.draw(config)
  }

  /**
   * @inheritdoc
   * @override
   */
  protected createShape(config: Konva.RegularPolygonConfig) {
    this.shape = new Konva.RegularPolygon(config)

    return this.board.addShape(this.shape)
  }

  /**
   * Starts drawing a polygon shape
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
      sides: 4,
      ...this.config
    })
  }

  /**
   * Continues drawing the polygon by changing its radius
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
