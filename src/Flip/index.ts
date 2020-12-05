import { Board } from '../Board'
import { Events } from '../Events'
import { History } from '../History'
import { Shape } from '../Shape'

export class Flip {
  /**
   * Reperesents the [[Board]]
   */
  private readonly board: Board

  /**
   * Reperesents the [[History]]
   */
  private readonly history: History

  /**
   * Reperesents the [[Events]]
   */
  private readonly events: Events

  /**
   * Lets the shapes to get flipped vertically and horizontally
   *
   * @example
   * Flips everything in the board horizontally
   * ```ts
   * editor.board.flip.horizontal()
   * ```
   *
   * @example
   * Flips everything in the board vertically
   *```ts
   * editor.board.flip.vertical()
   * ```
   *
   * @example
   * Flips selected shapes horizontally
   * ```ts
   * editor.board.flip.vertical(this.board.selection.shapes)
   * ```
   *
   * @param board The [[Board]]
   * @param events The [[Events]]
   * @param history The [[History]]
   */
  constructor(board: Board, events: Events, history: History) {
    this.board = board
    this.events = events
    this.history = history
  }

  /**
   * Flips the given shapes horizontally
   *
   * @param shapes List of the [[Shape | Shapes]]
   */
  public horizontal(shapes: Shape[] = this.board.getShapes()) {
    this.history.create(
      this.board.layer,
      shapes.map(shape => shape.node)
    )

    shapes.forEach(shape => {
      const node = shape.node

      node.scaleX(node.scaleX() * -1)
      node.x(
        node.scaleX() < 0 ? node.width() + node.x() : node.x() - node.width()
      )
    })

    this.board.draw()

    this.events.emit('flip:x', {
      shapes
    })
  }

  /**
   * Flips the given shapes vertically
   *
   * @param shapes List of the [[Shape | Shapes]]
   */
  public vertical(shapes: Shape[] = this.board.getShapes()) {
    this.history.create(
      this.board.layer,
      shapes.map(shape => shape.node)
    )

    shapes.forEach(shape => {
      const node = shape.node

      node.scaleY(node.scaleY() * -1)
      node.y(
        node.scaleY() < 0 ? node.height() + node.y() : node.y() - node.height()
      )
    })

    this.board.draw()

    this.events.emit('flip:y', {
      shapes
    })
  }
}
