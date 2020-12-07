import Konva from 'konva'

import { Board } from '../../Board'
import { omit } from '../../utils/omit'

export class JsonExport {
  /**
   * Represents the [[Board]]
   */
  private readonly board: Board

  constructor(board: Board) {
    this.board = board
  }

  /**
   * Exports the current workstation to JSON format
   */
  export() {
    const stage = omit(this.board.stage.toObject(), ['children', 'className'])
    const layer = omit(this.board.layer.toObject(), ['children', 'className'])

    const shapes = this.board.getShapes().map(shape => {
      return this.nodeToObject(shape.node)
    })

    const background = {
      image: this.nodeToObject(this.board.background.image.node),
      overlay: this.nodeToObject(this.board.background.overlay.node)
    }

    return {
      stage,
      layer,
      background,
      shapes
    }
  }

  /**
   * Converts node to object
   * @param node The node
   */
  private nodeToObject(node: Konva.Node) {
    const object = node.toObject()

    if (node.getClassName() === 'Image') {
      object.attrs.url = node.attrs.image.src
    }

    return omit(object, ['draggable'])
  }
}
