import Konva from 'konva'

import { ShapeModel } from '../../ShapeModel'
import type { Shapes } from '../../../types'

export class RectModel extends ShapeModel<Konva.Rect, Konva.RectConfig> {
  /**
   * @inheritdoc
   */
  public get type(): keyof Shapes {
    return 'rect'
  }
}
