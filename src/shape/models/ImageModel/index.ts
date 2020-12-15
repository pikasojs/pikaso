import Konva from 'konva'

import { ShapeModel } from '../../ShapeModel'
import type { Shapes } from '../../../types'

export class ImageModel extends ShapeModel<Konva.Image, Konva.ImageConfig> {
  /**
   * @inheritdoc
   */
  public get type(): keyof Shapes {
    return 'image'
  }
}
