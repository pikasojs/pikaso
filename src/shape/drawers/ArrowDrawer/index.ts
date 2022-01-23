import Konva from 'konva'

import { Board } from '../../../Board'

import { ShapeDrawer } from '../../ShapeDrawer'
import { ArrowModel } from '../../models/ArrowModel'

import { DrawType } from '../../../types'

export class ArrowDrawer extends ShapeDrawer<Konva.Arrow, Konva.ArrowConfig> {
  /**
   * Demonstrates the arrow node that is being created
   */
  public node: Konva.Arrow

  /**
   * Creates a new arrow builder component
   *
   * @param board The [[Board]]
   */
  constructor(board: Board) {
    super(board, DrawType.Arrow)
  }

  /**
   * @inheritdoc
   * @override
   */
  public insert(config: Konva.ArrowConfig): ArrowModel {
    return super.insert(config)
  }

  /**
   * @inheritdoc
   * @override
   */
  public draw(config: Partial<Konva.ArrowConfig> = {}) {
    super.draw(config)
  }

  /**
   * @inheritdoc
   * @override
   */
  protected createShape(config: Konva.ArrowConfig): ArrowModel {
    this.node = new Konva.Arrow(config)

    return new ArrowModel(this.board, this.node)
  }

  /**
   * Starts drawing an arrow shape
   */
  protected onStartDrawing() {
    super.onStartDrawing()

    if (!this.isDrawing) {
      return
    }

    this.createShape({
      globalCompositeOperation: 'source-over',
      points: [this.startPoint.x, this.startPoint.y],
      ...this.config
    })
  }

  /**
   * Continues arrow drawing by concating the first point and
   * current point together
   */
  protected onDrawing(e: Konva.KonvaEventObject<MouseEvent>) {
    super.onDrawing(e)

    if (!this.node) {
      return
    }

    const point = this.board.stage.getPointerPosition()!
    this.node.points([...this.node.points().slice(0, 2), point.x, point.y])
  }
}
