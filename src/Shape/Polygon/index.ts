import Konva from 'konva'

import { Board } from '../../Board'
import { Events } from '../../Events'
import { History } from '../../History'

import { ShapeDrawer } from '../../ShapeDrawer'
import { DrawType } from '../../types'

export class Polygon extends ShapeDrawer {
  /**
   *
   */
  public shape: Konva.RegularPolygon

  constructor(board: Board, events: Events, history: History) {
    super(board, events, history, DrawType.Polygon)
  }

  /**
   *
   * @param config
   */
  public insert(config: Konva.RegularPolygonConfig) {
    return super.insert(config)
  }

  /**
   *
   * @param config
   */
  public draw(config: Partial<Konva.RegularPolygonConfig> = {}) {
    super.draw(config)
  }

  /**
   *
   * @param config
   */
  protected createShape(config: Konva.RegularPolygonConfig) {
    this.shape = new Konva.RegularPolygon(config)

    return this.board.addShape(this.shape)
  }
}
