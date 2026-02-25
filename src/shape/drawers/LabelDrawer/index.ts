import Konva from 'konva'

import { Board } from '../../../Board'
import { LabelModel } from '../../models/LabelModel'

import type { LabelConfig } from '../../../types/shapes'
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
   * @param configuration The configuration of the label
   */
  public insert({
    container,
    text,
    tag,
    config
  }: {
    container: Konva.LabelConfig
    text: Konva.TextConfig
    tag?: Konva.TagConfig
    config?: LabelConfig
  }): LabelModel {
    const label = new Konva.Label({
      ...container,
      draggable: this.board.settings.selection?.interactive
    })

    const textNode = new Konva.Text(text)
    const tagNode = new Konva.Tag(tag)

    label.add(tagNode).add(textNode)

    return new LabelModel(this.board, label, {
      ...config,
      transformer: {
        centeredScaling: false,
        enabledAnchors: ['middle-left', 'middle-right'],
        ...(config?.transformer ?? {})
      }
    })
  }
}
