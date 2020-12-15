import Konva from 'konva'

import { Board } from '../../../Board'

import { ShapeDrawer } from '../../ShapeDrawer'
import { LineModel } from '../../models/LineModel'

import { DrawType } from '../../../types'

export class PencilDrawer extends ShapeDrawer<Konva.Line, Konva.LineConfig> {
  /**
   * Demonstrates the point (line) node that is being created
   */
  public node: Konva.Line

  /**
   * Creates a new free drawing component
   *
   * @param board The [[Board]]
   */
  constructor(board: Board) {
    super(board, DrawType.Pencil)
  }

  /**
   * @inheritdoc
   * @override
   */
  public draw(config: Partial<Konva.LineConfig> = {}) {
    super.draw(config)
  }

  /**
   * @inheritdoc
   * @override
   */
  protected createShape(config: Konva.LineConfig): LineModel {
    this.node = new Konva.Line(config)

    return new LineModel(this.board, this.node)
  }

  /**
   * Starts free drawing
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
   * Continues free drawing by concating the points together
   */
  protected onDrawing(e: Konva.KonvaEventObject<MouseEvent>) {
    super.onDrawing(e)

    if (!this.node) {
      return
    }

    const point = this.board.stage.getPointerPosition()!
    this.node.points(this.node.points().concat([point.x, point.y]))

    this.board.draw()
  }
}
