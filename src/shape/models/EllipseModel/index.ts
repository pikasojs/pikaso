import Konva from 'konva'

import { ShapeModel } from '../../ShapeModel'
import type { Shapes } from '../../../types'

export class EllipseModel extends ShapeModel<
  Konva.Ellipse,
  Konva.EllipseConfig
> {
  /**
   * @inheritdoc
   */
  public get type(): keyof Shapes {
    return 'ellipse'
  }
}
