import Konva from 'konva'

import { Board } from '../../Board'
import { Events } from '../../Events'
import { History } from '../../History'

import { ShapeDrawer } from '../../ShapeDrawer'
import { DrawType } from '../../types'

export class Rect extends ShapeDrawer {
  /**
   *
   */
  public shape: Konva.Rect

  constructor(board: Board, events: Events, history: History) {
    super(board, events, history, DrawType.Rect)
  }

  /**
   *
   * @param config
   */
  public append(config: Konva.RectConfig) {
    super.insert(config)
  }

  /**
   *
   * @param config
   */
  public draw(config: Partial<Konva.RectConfig> = {}) {
    super.draw(config)
  }

  /**
   *
   * @param config
   */
  protected createShape(config: Konva.RectConfig) {
    this.shape = new Konva.Rect(config)
    this.board.addShape(this.shape)
  }
}
