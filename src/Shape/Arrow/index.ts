import Konva from 'konva'

import { Board } from '../../Board'
import { Events } from '../../Events'
import { History } from '../../History'
import { ShapeDrawer } from '../../ShapeDrawer'

import { DrawType } from '../../types'

export class Arrow extends ShapeDrawer {
  /**
   *
   */
  public shape: Konva.Arrow

  constructor(board: Board, events: Events, history: History) {
    super(board, events, history, DrawType.Arrow)
  }

  /**
   *
   * @param config
   */
  public insert(config: Konva.ArrowConfig) {
    return super.insert(config)
  }

  /**
   *
   * @param config
   */
  public draw(config: Partial<Konva.ArrowConfig> = {}) {
    super.draw(config)
  }

  /**
   *
   * @param config
   */
  protected createShape(config: Konva.ArrowConfig) {
    this.shape = new Konva.Arrow(config)

    return this.board.addShape(this.shape)
  }
}
