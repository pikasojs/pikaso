import Konva from 'konva'

import { ShapeModel } from '../../ShapeModel'
import type { Shapes } from '../../../types'

export class CircleModel extends ShapeModel<Konva.Circle, Konva.CircleConfig> {
  /**
   * @inheritdoc
   */
  public get type(): keyof Shapes {
    return 'circle'
  }
}
