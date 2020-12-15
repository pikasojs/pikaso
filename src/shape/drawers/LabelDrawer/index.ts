import Konva from 'konva'

import { Board } from '../../../Board'

import { LabelModel } from '../../models/LabelModel'

export class LabelDrawer {
  /**
   * Represents the [[Board]]
   */
  private readonly board: Board

  /**
   * Creates a new label builder component
   *
   * @param board The [[Board]]
   */
  constructor(board: Board) {
    this.board = board
  }

  /**
   * Inserts a new label into the board
   *
   * @param config The configuration of the label
   */
  public insert(config: {
    container: Konva.LabelConfig
    text: Konva.TextConfig
    tag?: Konva.TagConfig
  }): LabelModel {
    const label = new Konva.Label({
      ...config.container,
      draggable: true
    })

    const text = new Konva.Text(config.text)
    const tag = new Konva.Tag(config.tag)

    text.setAttr('height', 'auto')

    label.add(tag).add(text)

    return new LabelModel(this.board, label, {
      transformer: {
        centeredScaling: false,
        enabledAnchors: ['middle-left', 'middle-right']
      }
    })
  }
}
