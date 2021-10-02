import Konva from 'konva'

import { ShapeModel } from '../../ShapeModel'
import type { Shapes } from '../../../types'
import { rotateAroundCenter } from '../../../utils/rotate-around-center'

export class RectModel extends ShapeModel<Konva.Rect, Konva.RectConfig> {
  /**
   * @inheritdoc
   */
  public get type(): keyof Shapes {
    return 'rect'
  }

  /**
   * @inheritdoc
   * @override
   */
  public rotate(theta: number) {
    rotateAroundCenter(this.node, theta)

    this.board.events.emit('shape:rotate', {
      shapes: [this]
    })
  }
}
