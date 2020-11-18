import Konva from 'konva'

import { Board } from '../../Board'
import { Events } from '../../Events'
import { History } from '../../History'

import { ShapeDrawer } from '../../ShapeDrawer'
import { DrawType } from '../../types'

export class Ellipse extends ShapeDrawer {
  /**
   *
   */
  public shape: Konva.Ellipse

  constructor(board: Board, events: Events, history: History) {
    super(board, events, history, DrawType.Ellipse)
  }

  /**
   *
   * @param config
   */
  public insert(config: Konva.EllipseConfig) {
    return super.insert(config)
  }

  /**
   *
   * @param config
   */
  public draw(config: Partial<Konva.EllipseConfig> = {}) {
    super.draw(config)
  }

  /**
   *
   * @param config
   */
  protected createShape(config: Konva.EllipseConfig) {
    this.shape = new Konva.Ellipse(config)

    return this.board.addShape(this.shape)
  }
}
