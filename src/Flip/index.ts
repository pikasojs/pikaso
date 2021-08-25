import { Board } from '../Board'
import { ShapeModel } from '../shape/ShapeModel'

export class Flip {
  /**
   * Reperesents the [[Board]]
   */
  private readonly board: Board

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
   */
  constructor(board: Board) {
    this.board = board
  }

  /**
   * Flips the given shapes horizontally
   *
   * @param shapes List of the [[Shape | Shapes]]
   */
  public horizontal(shapes?: ShapeModel[]) {
    const list = shapes || [...this.board.shapes, this.board.background.image]

    this.board.history.create(
      this.board.layer,
      list.map(shape => shape.node)
    )

    list.forEach(shape => {
      const node = shape.node

      node.scaleX(node.scaleX() * -1)

      if (node.attrs.x && node.attrs.width) {
        node.x(
          node.scaleX() < 0 ? node.width() + node.x() : node.x() - node.width()
        )
      }
    })

    this.board.draw()

    this.board.events.emit('flip:x', {
      shapes: list
    })
  }

  /**
   * Flips the given shapes vertically
   *
   * @param shapes List of the [[Shape | Shapes]]
   */
  public vertical(shapes?: ShapeModel[]) {
    const list = shapes || [...this.board.shapes, this.board.background.image]

    this.board.history.create(
      this.board.layer,
      list.map(shape => shape.node)
    )

    list.forEach(shape => {
      const node = shape.node

      node.scaleY(node.scaleY() * -1)

      if (node.attrs.y && node.attrs.height) {
        node.y(
          node.scaleY() < 0
            ? node.height() + node.y()
            : node.y() - node.height()
        )
      }
    })

    this.board.draw()

    this.board.events.emit('flip:y', {
      shapes: list
    })
  }
}
