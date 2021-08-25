import Konva from 'konva'

import { Board } from '../../Board'

import type { ExportImageConfig } from '../../types'

/**
 * @internal
 */
export class ImageExport {
  /**
   * Represents the [[Board]]
   */
  private readonly board: Board

  constructor(board: Board) {
    this.board = board
  }

  /**
   * Exports the current workspace to image
   *
   * @returns The exported image data url
   * @param config The [[ExportImageConfig | config]]
   */
  export(config?: Partial<ExportImageConfig>) {
    // find visible transformers to exclude them from the exported image
    const transformers = this.board.stage.children?.flatMap(layer => {
      return layer.children?.filter(
        node =>
          node.getClassName() === 'Transformer' &&
          (node as Konva.Transformer).nodes().length > 0
      )
    })

    // hide visible transformers
    transformers?.forEach(node => node?.hide())

    const url = this.board.stage.toDataURL(config)

    // revert transformers to their previous state
    transformers?.forEach(node => node?.show())

    return url
  }
}
