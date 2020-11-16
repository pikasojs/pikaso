import Konva from 'konva'

import { Board } from '../../Board'
import { Events } from '../../Events'
import { History } from '../../History'
import { ShapeDrawer } from '../../ShapeDrawer'

import { DrawType } from '../../types'

interface TriangleConfig extends Omit<Konva.RegularPolygonConfig, 'sides'> {
  sides?: 3
}

export class Triangle extends ShapeDrawer {
  /**
   *
   */
  public shape: Konva.RegularPolygon

  constructor(board: Board, events: Events, history: History) {
    super(board, events, history, DrawType.Triangle)
  }

  /**
   *
   * @param config
   */
  public insert(config: TriangleConfig) {
    super.insert(config)
  }

  /**
   *
   * @param config
   */
  public draw(config: Partial<TriangleConfig> = {}) {
    super.draw({
      ...config,
      sides: 3
    })
  }

  /**
   *
   * @param config
   */
  protected createShape(config: TriangleConfig) {
    this.shape = new Konva.RegularPolygon({
      radius: 10,
      sides: 3,
      ...config
    })

    this.board.addShape(this.shape)
  }
}
