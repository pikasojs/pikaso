import Konva from 'konva'

import { Board } from '../Board'

export class Export {
  /**
   *
   */
  private readonly board: Board

  constructor(board: Board) {
    this.board = board
  }

  public imageDataUrl(config: Parameters<Konva.Stage['toDataURL']>[0]) {
    return this.board.stage.toDataURL(config)
  }
}
