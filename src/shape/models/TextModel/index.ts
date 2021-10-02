import Konva from 'konva'

import { ShapeModel } from '../../ShapeModel'
import type { Shapes } from '../../../types'

export class TextModel extends ShapeModel<Konva.Text, Konva.TextConfig> {
  /**
   * @inheritdoc
   */
  public get type(): keyof Shapes {
    return 'text'
  }
}
