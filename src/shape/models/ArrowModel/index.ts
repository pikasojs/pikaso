import Konva from 'konva'

import { rotateAroundCenter } from '../../../utils/rotate-around-center'

import { ShapeModel } from '../../ShapeModel'

export class ArrowModel extends ShapeModel<Konva.Arrow, Konva.ArrowConfig> {
  /**
   * @inheritdoc
   */
  public get type(): string {
    return 'arrow'
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
