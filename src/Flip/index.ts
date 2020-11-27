import Konva from 'konva'

import { Board } from '../Board'
import { Events } from '../Events'
import { History } from '../History'

export class Flip {
  /**
   *
   */
  private readonly board: Board

  /**
   *
   */
  private readonly history: History

  /**
   *
   */
  private readonly events: Events

  constructor(board: Board, events: Events, history: History) {
    this.board = board
    this.events = events
    this.history = history
  }

  /**
   * flips the stage horizontally
   */
  public horizontal(nodes?: Array<Konva.Group | Konva.Shape>) {
    const list = nodes || this.board.getNodes()

    this.createHistory(list)

    list.forEach((node: Konva.Shape) => {
      node.scaleX(node.scaleX() * -1)
      node.x(
        node.scaleX() < 0 ? node.width() + node.x() : node.x() - node.width()
      )
    })

    this.board.layer.batchDraw()

    this.events.emit('flip:x', {
      nodes: list
    })
  }

  /**
   * flips the stage horizontally
   */
  public vertical(nodes?: Array<Konva.Group | Konva.Shape>) {
    const list = nodes || this.board.getNodes()

    this.createHistory(list)

    list.forEach((node: Konva.Shape) => {
      node.scaleY(node.scaleY() * -1)
      node.y(
        node.scaleY() < 0 ? node.height() + node.y() : node.y() - node.height()
      )
    })

    this.board.layer.batchDraw()

    this.events.emit('flip:y', {
      nodes: list
    })
  }

  /**
   *
   */
  private createHistory(nodes: Array<Konva.Shape | Konva.Group>) {
    this.history.create(this.board.layer, nodes)
  }
}
