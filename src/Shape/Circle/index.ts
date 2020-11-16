import Konva from 'konva'

import { Board } from '../../Board'
import { Events } from '../../Events'
import { History } from '../../History'

import { ShapeDrawer } from '../../ShapeDrawer'
import { DrawType } from '../../types'

export class Circle extends ShapeDrawer {
  /**
   *
   */
  public shape: Konva.Circle

  constructor(board: Board, events: Events, history: History) {
    super(board, events, history, DrawType.Circle)
  }

  /**
   *
   * @param config
   */
  public insert(config: Konva.CircleConfig) {
    super.insert(config)
  }

  /**
   *
   * @param config
   */
  public draw(config: Partial<Konva.CircleConfig> = {}) {
    super.draw(config)
  }

  /**
   *
   * @param config
   */
  protected createShape(config: Konva.CircleConfig) {
    this.shape = new Konva.Circle(config)
    this.board.addShape(this.shape)
  }
}
