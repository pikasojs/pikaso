import Konva from 'konva'

import { Board } from '../../Board'
import { omit } from '../../utils/omit'

import type { JsonData } from '../../types'

/**
 * @internal
 */
export class JsonExport {
  /**
   * Represents the [[Board]]
   */
  private readonly board: Board

  constructor(board: Board) {
    this.board = board
  }

  /**
   * Exports the current workspace to JSON format
   */
  export(): JsonData {
    const stage = this.nodeToObject(this.board.stage, ['container', 'children'])
    const layer = this.nodeToObject(this.board.layer, ['children'])

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
  private nodeToObject(
    node: Konva.Stage | Konva.Layer | Konva.Node,
    exclude: string[] = []
  ) {
    const data = node.toObject()

    if (data.className === 'Image' && node.attrs.image) {
      data.attrs.url = node.attrs.image.src
    }

    const filters = (node.filters() || []).map(filter => {
      return Object.keys(Konva.Filters).find(
        (name: keyof typeof Konva.Filters) => Konva.Filters[name] === filter
      )
    }) as string[]

    return {
      className: data.className,
      filters,
      children: ['Label'].includes(data.className) ? data.children : undefined,
      attrs: omit(
        {
          ...data.attrs,
          x: node.x(),
          y: node.y(),
          width: node.width(),
          height: node.height()
        },
        ['draggable', 'filters', ...exclude]
      )
    }
  }
}
