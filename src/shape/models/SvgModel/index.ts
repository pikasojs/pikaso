import Konva from 'konva'

import { rotateAroundCenter } from '../../../utils/rotate-around-center'

import { ShapeModel } from '../../ShapeModel'

export class SvgModel extends ShapeModel<Konva.Path, Konva.PathConfig> {
  /**
   * @inheritdoc
   */
  public get type(): string {
    return 'svg'
  }

  /**
   * @inheritdoc
   * @override
   */
  public width() {
    return this.node.getClientRect().width
  }

  /**
   * @inheritdoc
   * @override
   */
  public height() {
    return this.node.getClientRect().height
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
