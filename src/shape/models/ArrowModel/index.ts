import Konva from 'konva'

import { ShapeModel } from '../../ShapeModel'

export class ArrowModel extends ShapeModel<Konva.Arrow, Konva.ArrowConfig> {
  /**
   * @inheritdoc
   */
  public get type(): string {
    return 'arrow'
  }
}
