import Konva from 'konva'

import { rotateAroundCenter } from '../../../utils/rotate-around-center'
import { ShapeModel } from '../../ShapeModel'

export class TextModel extends ShapeModel<Konva.Text, Konva.TextConfig> {
  /**
   * @inheritdoc
   */
  public get type(): string {
    return 'text'
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
