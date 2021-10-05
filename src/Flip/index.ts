import Konva from 'konva'

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
    const list = shapes ?? [
      ...this.board.activeShapes,
      this.board.background.image
    ]

    this.board.history.create(
      this.board.layer,
      list.map(shape => shape.node)
    )

    list.forEach(shape => {
      const node = shape.node

      node.scaleX(node.scaleX() * -1)

      if (this.shouldRecalculatePosition(shape)) {
        node.x(
          node.scaleX() < 0
            ? node.width() * Math.abs(node.scaleX()) + node.x()
            : node.x() - node.width() * Math.abs(node.scaleX())
        )
      }
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
    const list = shapes ?? [
      ...this.board.activeShapes,
      this.board.background.image
    ]

    this.board.history.create(
      this.board.layer,
      list.map(shape => shape.node)
    )

    list.forEach(shape => {
      const node = shape.node

      node.scaleY(node.scaleY() * -1)

      if (this.shouldRecalculatePosition(shape)) {
        node.y(
          node.scaleY() < 0
            ? node.height() * Math.abs(node.scaleY()) + node.y()
            : node.y() - node.height() * Math.abs(node.scaleY())
        )
      }
    })

    this.board.events.emit('flip:y', {
      shapes: list
    })
  }

  /**
   * checks whether after flipping the shape repositioning is required or not
   *
   * @param shape the given [[ShapeModel | Shapes]]
   * @returns boolean
   */
  private shouldRecalculatePosition(shape: ShapeModel): boolean {
    return [Konva.Image, Konva.Label, Konva.Text, Konva.Rect].some(
      component => shape.node instanceof component
    )
  }
}
