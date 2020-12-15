import Konva from 'konva'

import { ShapeModel } from '../../ShapeModel'
import type { Shapes } from '../../../types'

export class PolygonModel extends ShapeModel<
  Konva.RegularPolygon,
  Konva.RegularPolygonConfig
> {
  /**
   * @inheritdoc
   */
  public get type(): keyof Shapes {
    return 'polygon'
  }
}
