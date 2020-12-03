import Konva from 'konva'

import { Board } from '../Board'
import { Events } from '../Events'
import { History } from '../History'
import { Shape } from '../Shape'

import type { Filters, HistoryState } from '../types'

export class Filter {
  /**
   * @see [[Board]]
   * @private
   */
  private board: Board

  /**
   * @see [[Events]]
   * @private
   */
  private events: Events

  /**
   * @see [[History]]
   * @private
   */
  private history: History

  /**
   * Creates a filter instance that lets apply various filters
   * on every shape that extends the class.
   *
   * Basically every [[Shape]] has exposed [[Shape.addFilter]] and
   * [[Shape.removeFilter]] to work with filters
   *
   * @param board The [[Board]]
   * @param events The [[Events]]
   * @param history The [[History]]
   *
   * @example
   * Adds a blur filter to background image
   * ```ts
   * editor.board.background.image.addFilter({
   *  name: 'Blur',
   *  options: {
   *    blurRadius: 20
   *  }
   * })
   * ```
   *
   * @example
   * Adds a contrast filter to all selected shapes
   * ```ts
   * editor.selection.addFilter({
   *  name: 'Contrast',
   *  options: {
   *    contrast: 30
   *  }
   * })
   * ```
   *
   * @example
   * Remove contrast filter of selected items
   * ```ts
   * editor.selection.removeFilter('Contrast')
   * ```
   */
  constructor(board: Board, events: Events, history: History) {
    this.board = board
    this.events = events
    this.history = history
  }

  /**
   * Applies a filter to the given shapes
   *
   * @param shapes List of the [[Shape | Shapes]]
   * @param filter The [[Filters | Filter]]
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
   * Remove filters of the given shapes
   *
   * @param shapes List of the [[Shape | Shapes]]
   * @param name The [[Filters | filter]] name
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
   * Caches the state
   *
   * The main purpose of this function is make the filters working
   * with Konva library. basically when an Undo happens the [[History]]
   * component tries to apply previous attributes but it doesn't know
   * about methods. so this function does the job
   *
   * @param states The history state
   *
   * @private
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
   * Removes the cache of the states
   *
   * @see [[Filter.addCache]]
   *
   * @param states The history state
   * @private
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
