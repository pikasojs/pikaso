import Konva from 'konva'

import { ShapeModel } from '../../ShapeModel'
import type { Shapes } from '../../../types'

export class ArrowModel extends ShapeModel<Konva.Arrow, Konva.ArrowConfig> {
  /**
   * @inheritdoc
   */
  public get type(): keyof Shapes {
    return 'arrow'
  }
}
