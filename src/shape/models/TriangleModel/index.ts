import Konva from 'konva'

import { ShapeModel } from '../../ShapeModel'
import type { TriangleConfig } from '../../../types'

export class TriangleModel extends ShapeModel<
  Konva.RegularPolygon,
  TriangleConfig
> {
  /**
   * @inheritdoc
   */
  public get type(): string {
    return 'triangle'
  }
}
