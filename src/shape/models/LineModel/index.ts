import Konva from 'konva'

import { ShapeModel } from '../../ShapeModel'
export class LineModel extends ShapeModel<Konva.Line, Konva.LineConfig> {
  /**
   * @inheritdoc
   */
  public get type(): string {
    return 'line'
  }
}
