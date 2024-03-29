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
   * @param shapes List of the [[ShapeModel | Shapes]]
   */
  public horizontal(shapes?: ShapeModel[]) {
    const list = (
      shapes ?? [...this.board.activeShapes, this.board.background.image]
    ).filter(shape => !shape.hasGroup())

    this.board.history.create(
      this.board.layer,
      list.map(shape => shape.node)
    )

    list.forEach(shape => {
      const node = shape.node

      const rect = node.getClientRect()

      node.scaleX(node.scaleX() * -1)

      const newRect = node.getClientRect()

      node.setAttrs({
        x: node.x() + (rect.x - newRect.x),
        y: node.y() + (rect.y - newRect.y)
      })
    })

    this.board.events.emit('flip:x', {
      shapes: list
    })
  }

  /**
   * Flips the given shapes vertically
   *
   * @param shapes List of the [[ShapeModel | Shapes]]
   */
  public vertical(shapes?: ShapeModel[]) {
    const list = (
      shapes ?? [...this.board.activeShapes, this.board.background.image]
    ).filter(shape => !shape.hasGroup())

    this.board.history.create(
      this.board.layer,
      list.map(shape => shape.node)
    )

    list.forEach(shape => {
      const node = shape.node

      const rect = node.getClientRect()

      node.scaleY(node.scaleY() * -1)

      const newRect = node.getClientRect()

      node.setAttrs({
        x: node.x() + (rect.x - newRect.x),
        y: node.y() + (rect.y - newRect.y)
      })
    })

    this.board.events.emit('flip:y', {
      shapes: list
    })
  }
}
