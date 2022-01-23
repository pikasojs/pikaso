import Konva from 'konva'

import { getPointsDistance } from '../../../utils/get-points-distance'

import { Board } from '../../../Board'

import { ShapeDrawer } from '../../ShapeDrawer'
import { PolygonModel } from '../../models/PolygonModel'

import { DrawType } from '../../../types'

export class PolygonDrawer extends ShapeDrawer<
  Konva.RegularPolygon,
  Konva.RegularPolygonConfig
> {
  /**
   * Demonstrates the polygon node that is being created
   */
  public node: Konva.RegularPolygon

  /**
   * Creates a new polygon builder component
   *
   * @param board The [[Board]]
   */
  constructor(board: Board) {
    super(board, DrawType.Polygon)
  }

  /**
   * @inheritdoc
   * @override
   */
  public insert(config: Konva.RegularPolygonConfig): PolygonModel {
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
  protected createShape(config: Konva.RegularPolygonConfig): PolygonModel {
    this.node = new Konva.RegularPolygon(config)

    return new PolygonModel(this.board, this.node)
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

    if (!this.node) {
      return
    }

    const point = this.board.stage.getPointerPosition()!

    this.node.setAttrs({
      radius: getPointsDistance(point, this.getShapePosition())
    })
  }
}
