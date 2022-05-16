import Konva from 'konva'

import { Board } from '../../Board'
import { omit } from '../../utils/omit'
import { NODE_GROUP_ATTRIBUTE } from '../../constants'

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
    const stage = this.nodeToObject(this.board.stage, [
      'container',
      'children',
      'zIndex'
    ])
    const layer = this.nodeToObject(this.board.layer, ['children', 'zIndex'])

    const shapes = this.board.activeShapes.map(shape => {
      return {
        ...this.nodeToObject(shape.node, []),
        group: shape.group
      }
    })

    const background = {
      image: {
        ...this.nodeToObject(this.board.background.image.node),
        group: this.board.background.image.group
      },
      overlay: {
        ...this.nodeToObject(this.board.background.overlay.node),
        group: this.board.background.overlay.group
      }
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

    const attrs = omit(
      {
        ...data.attrs,
        ...Object.entries({
          x: node.x() ?? undefined,
          y: node.y() ?? undefined,
          width: node.width() || undefined,
          height: node.height() || undefined
        }).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: value ? Number(value?.toFixed(2)) : value
          }),
          {}
        )
      },
      ['draggable', 'filters', NODE_GROUP_ATTRIBUTE, ...exclude]
    )

    return {
      attrs,
      filters,
      className: data.className,
      ...(!exclude.includes('zIndex') && { zIndex: node.zIndex() }),
      ...(['Label'].includes(data.className) && { children: data.children })
    }
  }
}
