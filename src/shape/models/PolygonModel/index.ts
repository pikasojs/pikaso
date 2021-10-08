import Konva from 'konva'

import { ShapeModel } from '../../ShapeModel'

export class PolygonModel extends ShapeModel<
  Konva.RegularPolygon,
  Konva.RegularPolygonConfig
> {
  /**
   * @inheritdoc
   */
  public get type(): string {
    return 'polygon'
  }
}
