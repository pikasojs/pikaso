import Konva from 'konva'

import { rotateAroundCenter } from '../../../utils/rotate-around-center'

import { ShapeModel } from '../../ShapeModel'
import type { Shapes } from '../../../types'

export class ImageModel extends ShapeModel<Konva.Image, Konva.ImageConfig> {
  /**
   * @inheritdoc
   */
  public get type(): keyof Shapes {
    return 'image'
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
