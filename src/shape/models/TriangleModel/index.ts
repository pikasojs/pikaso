import Konva from 'konva'

import { ShapeModel } from '../../ShapeModel'
import type { Shapes, TriangleConfig } from '../../../types'

export class TriangleModel extends ShapeModel<
  Konva.RegularPolygon,
  TriangleConfig
> {
  /**
   * @inheritdoc
   */
  public get type(): keyof Shapes {
    return 'triangle'
  }
}
