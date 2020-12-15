import Konva from 'konva'

import { ShapeModel } from '../../ShapeModel'
import type { Shapes } from '../../../types'

export class LineModel extends ShapeModel<Konva.Line, Konva.LineConfig> {
  /**
   * @inheritdoc
   */
  public get type(): keyof Shapes {
    return 'line'
  }
}
