import Konva from 'konva'

import { ShapeModel } from '../../ShapeModel'

export class EllipseModel extends ShapeModel<
  Konva.Ellipse,
  Konva.EllipseConfig
> {
  /**
   * @inheritdoc
   */
  public get type(): string {
    return 'ellipse'
  }
}
