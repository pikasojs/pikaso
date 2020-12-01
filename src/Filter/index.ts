import Konva from 'konva'

import { Board } from '../Board'
import { Events } from '../Events'
import { History } from '../History'
import { Shape } from '../Shape'

import type { Filters, HistoryState } from '../types'

export class Filter {
  /**
   *
   */
  private board: Board

  /**
   *
   */
  private events: Events

  /**
   *
   */
  private history: History

  constructor(board: Board, events: Events, history: History) {
    this.board = board
    this.events = events
    this.history = history
  }

  /**
   *
   */
  public apply(shapes: Shape[], filter: Filters) {
    this.history.create(
      this.board.layer,
      shapes.map(shape => shape.node),
      {
        undo: (states: HistoryState[]) => this.clearCache(states),
        redo: (states: HistoryState[]) => this.addCache(states)
      }
    )

    shapes.forEach(shape => {
      shape.node.cache()
      shape.node.setAttrs(filter.options)

      const filters = shape.node.filters() || []

      if (filters.includes(Konva.Filters[filter.name]) === false) {
        shape.node.filters([...filters, Konva.Filters[filter.name]])
      }
    })

    this.board.layer.batchDraw()

    this.events.emit('filter:add', {
      shapes,
      data: {
        filter: filter.name
      }
    })
  }

  /**
   *
   */
  public remove(shapes: Shape[], name: Filters['name']) {
    this.history.create(
      this.board.layer,
      shapes.map(shape => shape.node),
      {
        undo: (states: HistoryState[]) => this.addCache(states),
        redo: (states: HistoryState[]) => this.clearCache(states)
      }
    )

    shapes.forEach(shape => {
      if (!shape.node.filters()) {
        return
      }

      const filters = shape.node
        .filters()
        .filter(filter => filter !== Konva.Filters[name])

      if (filters.length === 0) {
        shape.node.clearCache()
      }

      shape.node.filters(filters)
    })

    this.board.layer.batchDraw()

    this.events.emit('filter:remove', {
      shapes,
      data: {
        filter: name
      }
    })
  }

  /**
   *
   * @param states
   */
  private addCache(states: HistoryState[]) {
    states.forEach(({ nodes }) =>
      nodes.forEach(node => {
        if (!node.isCached() && node.filters()?.length) {
          node.cache()
        }
      })
    )

    this.board.selection.reselect()
  }

  /**
   *
   * @param states
   */
  private clearCache(states: HistoryState[]) {
    states.forEach(({ nodes }) =>
      nodes.forEach(node => {
        if (node.isCached() && !node.filters()?.length) {
          node.clearCache()
        }
      })
    )

    this.board.selection.reselect()
  }
}
