import Konva from 'konva'

import { ShapeModel } from '../../ShapeModel'
export class CircleModel extends ShapeModel<Konva.Circle, Konva.CircleConfig> {
  /**
   * @inheritdoc
   */
  public get type(): string {
    return 'circle'
  }
}
