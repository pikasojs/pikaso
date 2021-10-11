import Konva from 'konva'

import { rotateAroundCenter } from '../../../utils/rotate-around-center'

import { ShapeModel } from '../../ShapeModel'
export class LineModel extends ShapeModel<Konva.Line, Konva.LineConfig> {
  /**
   * @inheritdoc
   */
  public get type(): string {
    return 'line'
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
