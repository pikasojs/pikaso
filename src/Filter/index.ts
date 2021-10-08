import Konva from 'konva'

import { Board } from '../Board'
import { ShapeModel } from '../shape/ShapeModel'

import type { FilterFunctions, Filters, HistoryState } from '../types'

export class Filter {
  /**
   * Represents the [[Board]]
   */
  private board: Board

  /**
   * Creates a filter instance that lets apply various filters
   * on every shape that extends the class.
   *
   * Basically every [[ShapeModel]] has exposed [[ShapeModel.addFilter]] and
   * [[ShapeModel.removeFilter]] to work with filters
   *
   * @param board The [[Board]]
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
   * Adds blur and contrast filters to background image
   * ```ts
   * editor.board.background.image.addFilter([
   *  {
   *    name: 'Blur',
   *    options: {
   *      blurRadius: 20
   *    }
   *  },
   *  {
   *    name: 'Contrast',
   *    options: {
   *      contrast: 30
   *    }
   *  }
   * ])
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
   * editor.selection.removeFilter({ name: Contrast' })
   * ```
   *
   * @example
   * Remove multiple filters
   * ```ts
   * editor.selection.removeFilter([
   *  { name: Contrast' },
   *  { customFn: theFunction },
   *  { name: 'Contrast' }
   * ])
   * ```
   *
   * @example
   * Adds a custom filter to background image
   * ```ts
   * editor.selection.addFilter({
   *  customFn: imageData => theCustomFunction(imageData),
   * })
   * ```
   *
   * @example
   * Directly access to filters
   *
   * ```ts
   * editor.filters.apply([editor.board.background.image], {
   *  name: 'Grayscale',
   * })
   * ```
   */
  constructor(board: Board) {
    this.board = board
  }

  /**
   * Applies a filter to the given shapes
   *
   * @param shapes List of the [[ShapeModel | Shapes]]
   * @param filters The list of given [[Filters | Filter]]
   */
  public apply(shapes: ShapeModel[], filters: Filters | Filters[]) {
    this.board.history.create(
      this.board.layer,
      shapes.map(shape => shape.node),
      {
        undo: (states: HistoryState[]) => this.clearCache(states),
        redo: (states: HistoryState[]) => this.addCache(states)
      }
    )

    shapes.forEach(shape => {
      shape.node.cache()

      const list = Array.isArray(filters) ? filters : [filters]

      list.forEach(filter => {
        if ('options' in filter) {
          shape.node.setAttrs(filter.options)
        }

        const nodeFilters = shape.node.filters() || []
        const filterFn = this.getFilterFunction(filter)

        if (nodeFilters.includes(filterFn) === false) {
          shape.node.filters([...nodeFilters, filterFn])
        }
      })
    })

    this.board.events.emit('filter:add', {
      shapes,
      data: {
        filters
      }
    })
  }

  /**
   * Remove filters of the given shapes
   *
   * @param shapes List of the [[ShapeModel | Shapes]]
   * @param filters The [[Filters | filter]] list
   */
  public remove(
    shapes: ShapeModel[],
    filters: FilterFunctions | FilterFunctions[]
  ) {
    this.board.history.create(
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

      const list = Array.isArray(filters)
        ? filters.map(this.getFilterFunction)
        : [this.getFilterFunction(filters)]

      const nextFilters = shape.node
        .filters()
        .filter(filter => !list.includes(filter))

      if (nextFilters.length === 0) {
        shape.node.clearCache()
      }

      shape.node.filters(nextFilters)
    })

    this.board.events.emit('filter:remove', {
      shapes,
      data: {
        filters
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

  /**
   * Returns filter processor function
   *
   * @param filter The [[Filters | filter]]
   * @returns filter function
   */
  private getFilterFunction(filter: Filters) {
    return 'customFn' in filter ? filter.customFn : Konva.Filters[filter.name]
  }
}
