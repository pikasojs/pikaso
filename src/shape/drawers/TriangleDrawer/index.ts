import Konva from 'konva'

import { getPointsDistance } from '../../../utils/get-points-distance'

import { Board } from '../../../Board'

import { ShapeDrawer } from '../../ShapeDrawer'

import { DrawType, TriangleConfig } from '../../../types'
import { TriangleModel } from '../../models/TriangleModel'

export class TriangleDrawer extends ShapeDrawer<
  Konva.RegularPolygon,
  TriangleConfig
> {
  /**
   * Demonstrates the triangle (polygon) shape that is being created
   */
  public node: Konva.RegularPolygon

  /**
   * Creates a new triangle (polygon) builder component
   *
   * @param board The [[Board]]
   */
  constructor(board: Board) {
    super(board, DrawType.Triangle)
  }

  /**
   * @inheritdoc
   * @override
   */
  public insert(config: TriangleConfig): TriangleModel {
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
  protected createShape(config: TriangleConfig): TriangleModel {
    this.node = new Konva.RegularPolygon({
      radius: 10,
      sides: 3,
      ...config
    })

    return new TriangleModel(this.board, this.node)
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

    if (!this.node) {
      return
    }

    const point = this.board.stage.getPointerPosition()!

    this.node.setAttrs({
      radius: getPointsDistance(point, this.getShapePosition())
    })

    this.board.draw()
  }
}
