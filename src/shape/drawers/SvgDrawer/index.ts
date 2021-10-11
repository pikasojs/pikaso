import Konva from 'konva'

import { getPointsDistance } from '../../../utils/get-points-distance'

import { Board } from '../../../Board'

import { ShapeDrawer } from '../../ShapeDrawer'
import { SvgModel } from '../../models/SvgModel'

import { DrawType } from '../../../types'

export class SvgDrawer extends ShapeDrawer<Konva.Path, Konva.PathConfig> {
  /**
   * Demonstrates the svg node that is being created
   */
  public node: Konva.Path

  /**
   * Creates a new svg builder component
   *
   * @param board The [[Board]]
   */
  constructor(board: Board) {
    super(board, DrawType.Svg)
  }

  /**
   * @inheritdoc
   * @override
   */
  public insert(config: Konva.PathConfig): SvgModel {
    return super.insert(config)
  }

  /**
   * @inheritdoc
   * @override
   */
  public draw(config: Partial<Konva.PathConfig> = {}) {
    super.draw(config)
  }

  /**
   * @inheritdoc
   * @override
   */
  protected createShape(config: Konva.PathConfig): SvgModel {
    this.node = new Konva.Path(config)

    return new SvgModel(this.board, this.node)
  }

  /**
   * Starts drawing a svg shape
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
      scaleX: 0,
      scaleY: 0,
      ...this.config
    })
  }

  /**
   * Continues drawing the svg by changing its scales
   */
  protected onDrawing(e: Konva.KonvaEventObject<MouseEvent>) {
    super.onDrawing(e)

    if (!this.node) {
      return
    }

    const point = this.board.stage.getPointerPosition()!
    const distance = getPointsDistance(point, this.getShapePosition())

    this.node.setAttrs({
      x: point.x - this.node.width(),
      scaleX: distance / 10,
      scaleY: distance / 10
    })
  }
}
