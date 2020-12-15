import Konva from 'konva'

import { Board } from '../../../Board'

import { ShapeDrawer } from '../../ShapeDrawer'
import { LineModel } from '../../models/LineModel'

import { DrawType } from '../../../types'

export class LineDrawer extends ShapeDrawer<Konva.Line, Konva.LineConfig> {
  /**
   * Demonstrates the line node that is being created
   */
  public node: Konva.Line

  /**
   * Creates a new line builder component
   *
   * @param board The [[Board]]
   */
  constructor(board: Board) {
    super(board, DrawType.Line)
  }

  /**
   *
   * @param config
   */
  public insert(config: Konva.LineConfig): LineModel {
    return super.insert(config)
  }

  /**
   *
   * @param config
   */
  public draw(config: Partial<Konva.LineConfig> = {}) {
    super.draw(config)
  }

  /**
   *
   * @param config
   */
  protected createShape(config: Konva.LineConfig): LineModel {
    this.node = new Konva.Line({
      hitStrokeWidth: 15,
      ...config
    })

    return new LineModel(this.board, this.node)
  }

  /**
   * Starts drawing a line
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
   * Continues line drawing by concating the first point and
   * current point together
   */
  protected onDrawing(e: Konva.KonvaEventObject<MouseEvent>) {
    super.onDrawing(e)

    if (!this.node) {
      return
    }

    const point = this.board.stage.getPointerPosition()!
    this.node.points([...this.node.points().slice(0, 2), point.x, point.y])

    this.board.draw()
  }
}
