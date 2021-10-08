import Konva from 'konva'

import { rotateAroundCenter } from '../../../utils/rotate-around-center'
import { ShapeModel } from '../../ShapeModel'

export class RectModel extends ShapeModel<Konva.Rect, Konva.RectConfig> {
  /**
   * @inheritdoc
   */
  public get type(): string {
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
