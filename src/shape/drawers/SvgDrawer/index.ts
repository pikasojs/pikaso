import Konva from 'konva'

import { getPointsDistance } from '../../../utils/get-points-distance'

import { Board } from '../../../Board'

import { ShapeDrawer } from '../../ShapeDrawer'
import { SvgModel } from '../../models/SvgModel'

import { DrawType, Point, Dimensions } from '../../../types'

export class SvgDrawer extends ShapeDrawer<Konva.Path, Konva.PathConfig> {
  /**
   * Demonstrates the svg node that is being created
   */
  public node: Konva.Path

  /**
   * The initial dimensions of the SVG path
   */
  private initialDimensions: Dimensions | undefined

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
      scaleX: 0.001,
      scaleY: 0.001,
      ...this.config
    })

    /**
     * Keep track of the initial size based on 0.001 scale to be able
     * to calculate the current scale based on the mouse distance
     */
    this.initialDimensions = this.node.getClientRect()
  }

  /**
   * Continues drawing the svg by changing its scales
   */
  protected onDrawing(e: Konva.KonvaEventObject<MouseEvent>) {
    super.onDrawing(e)

    if (!this.node) {
      return
    }

    const initialDimensions = this.initialDimensions as Dimensions
    const point = this.board.stage.getPointerPosition() as Point
    const distance = getPointsDistance(point, this.getShapePosition())

    if (!distance) {
      return
    }

    this.node.setAttrs({
      x: point.x,
      scaleX: (distance / initialDimensions.width) * 0.001,
      scaleY: (distance / initialDimensions.height) * 0.001
    })
  }

  /**
   * @override
   * @inheritdoc
   */
  protected onFinishDrawing(): void {
    super.onFinishDrawing()

    this.initialDimensions = undefined
  }
}
