import Konva from 'konva'

import { Board } from '../../Board'
import { Filter } from '../../Filter'
import { Flip } from '../../Flip'
import { NODE_GROUP_ATTRIBUTE } from '../../constants'

import type {
  Filters,
  ShapeConfig,
  FilterFunctions,
  Nullable
} from '../../types'

export abstract class ShapeModel<
  T extends Konva.Group | Konva.Shape = Konva.Group | Konva.Shape,
  P extends Konva.ShapeConfig = Konva.ShapeConfig
> {
  /**
   * Represents the shape's node
   */
  public node: T

  /**
   * Represents the configuration of the shape
   */
  public config: ShapeConfig

  /**
   * Represents the [[Board]]
   */
  protected readonly board: Board

  /**
   * Represents the [[Flip]]
   */
  private readonly flip: Flip

  /**
   * Represents the [[Filter]]
   */
  private readonly filter: Filter

  /**
   * Represents whether the shape is deleted or not
   */
  private deleted: boolean = false

  /**
   * Represents whether the shape is selectable or not
   */
  private selectable: boolean = false

  /**
   * Represents list of the shape's filters
   */
  private filtersList: Filters[] = []

  /**
   * Creates a new shape
   *
   * @param board The [[Board]]
   * @param node The shape node
   * @param config The [[ShapeConfig | Config]]
   */
  constructor(board: Board, node: T, config: ShapeConfig = {}) {
    this.board = board
    this.node = node

    this.flip = new Flip(board)
    this.filter = new Filter(board)

    this.selectable =
      config.selectable ?? this.board.settings.selection?.interactive ?? true

    this.config = {
      transformer: {},
      internal: false,
      history: true,
      selectable: true,
      ...config
    }

    if (this.config.history) {
      this.board.history.create(this.board.layer, [], {
        undo: () => this.delete(),
        redo: () => this.undelete()
      })
    }

    if (this.config.internal === false) {
      this.board.addShape(this)
    }

    this.board.events.emit('shape:create', {
      shapes: [this]
    })

    if (this.selectable) {
      this.node.draggable(true)
    }

    this.board.layer.add(this.node)

    // register shape events
    this.registerEvents()
  }

  /**
   * Returns whether the shape is active or not
   */
  public get isActive() {
    return !this.isDeleted && !this.isInvisible
  }

  /**
   * Returns whether the shape is deleted or not
   */
  public get isDeleted() {
    return this.deleted
  }

  /**
   * Returns whether the shape is visible or not
   */
  public get isVisible() {
    return this.node.isVisible()
  }

  /**
   * Returns whether the shape is invisible or not
   */
  public get isInvisible() {
    return this.isVisible === false
  }

  /**
   * Returns whether the shape is selectable or not
   */
  public get isSelectable() {
    return this.selectable
  }

  /**
   * Returns group id of the shape
   */
  public get group(): Nullable<string> {
    return this.node.getAttr(NODE_GROUP_ATTRIBUTE)
  }

  /**
   * Returns name of the shape
   */
  public get name(): string {
    return this.node.name()
  }

  /**
   * Returns a list of the shape's filters
   */
  public get filters(): Filters[] {
    return this.filtersList
  }

  /**
   * Returns type of the shape
   */
  public abstract get type(): string

  /**
   * Updates the selectable behavior of the shape
   */
  public set isSelectable(selectable: boolean) {
    this.selectable = selectable
    this.node.draggable(selectable)

    if (selectable) {
      this.board.addShape(this)
    } else {
      this.deselect()
      this.board.removeShape(this)
    }

    this.board.events.emit('shape:selectable', {
      shapes: [this],
      data: {
        selectable
      }
    })
  }

  /**
   * Adds the shape to the given group name
   */
  public set group(name: Nullable<string>) {
    if (this.group && name !== this.group) {
      this.board.groups.detach([this], this.group)
    }

    if (name && name.length > 0) {
      this.board.groups.attach([this], name)
    }
  }

  /**
   * Returns whether the shape belongs to a group
   */
  public hasGroup(): boolean {
    return !!this.group
  }

  /**
   * Flips the shape horizontally
   */
  public flipX() {
    this.flip.horizontal([this])
  }

  /**
   * Flips the shape vertically
   */
  public flipY() {
    this.flip.vertical([this])
  }

  /**
   * Adds the shape to the selections
   */
  public select() {
    this.board.selection.add(this)
  }

  /**
   * Deselects the shape
   */
  public deselect() {
    this.board.selection.deselect(this)
  }

  /**
   * Adds filter or filters to the selected shapes
   *
   * @param filter The [[Filters]]
   */
  public addFilter(filter: Filters | Filters[]) {
    this.filter.apply([this], filter)

    this.filtersList = [
      ...this.getFiltersDiff(filter),
      ...(Array.isArray(filter) ? filter : [filter])
    ]
  }

  /**
   * Removes a filter or list of filters from the selected shapes
   *
   * @param filter The filter function or functions
   */
  public removeFilter(filter: FilterFunctions | FilterFunctions[]) {
    this.filter.remove([this], filter)

    this.filtersList = this.getFiltersDiff(filter)
  }

  /**
   * Deletes the shape.
   *
   * This action can undo with [[ShapeModel.undelete]] method
   */
  public delete() {
    if (this.deleted) {
      return
    }

    this.deselect()
    this.node.hide()

    if (!this.node.isCached && this.node.width() && this.node.height()) {
      this.node.cache()
    }

    this.deleted = true

    this.board.events.emit('shape:delete', {
      shapes: [this]
    })
  }

  /**
   * Undeletes a deleted shape
   */
  public undelete() {
    if (!this.deleted) {
      return
    }

    this.node.show()

    if (this.node.isCached()) {
      this.node.clearCache()
    }

    this.deleted = false

    this.board.events.emit('shape:undelete', {
      shapes: [this]
    })
  }

  /**
   * Destroys a deleted shape
   */
  public destroy() {
    this.node.destroy()

    const shapes = this.board.activeShapes.filter(
      shape => shape.node !== this.node
    )

    this.board.setShapes(shapes)

    this.board.events.emit('shape:destroy', {
      shapes: [this]
    })
  }

  /**
   * Rotates the node around its center without transforming
   *
   * @param theta The rotation angle
   */
  public rotate(theta: number) {
    this.node.rotation(theta)

    this.board.events.emit('shape:rotate', {
      shapes: [this]
    })
  }

  /**
   * Returns `x` position of the shape
   */
  public x() {
    return this.node.x()
  }

  /**
   * Returns `y` position of the shape
   */
  public y() {
    return this.node.y()
  }

  /**
   * Returns `width` of the shape
   */
  public width() {
    return this.node.width()
  }

  /**
   * Returns `height`  of the shape
   */
  public height() {
    return this.node.height()
  }

  /**
   * Returns `scale` value of the shape
   */
  public scale() {
    return this.node.scale()
  }

  /**
   * Returns `scaleX` value of the shape
   */
  public scaleX() {
    return this.node.scaleX()
  }

  /**
   * Returns `scaleY` value of the shape
   */
  public scaleY() {
    return this.node.scaleY()
  }

  /**
   * Makes the shape visible if is hidden
   */
  public show() {
    return this.node.show()
  }

  /**
   * Makes the shape hidden if is visible
   */
  public hide() {
    return this.node.hide()
  }

  /**
   * Updates attributes of the shape
   *
   * @param attributes The list of attributes
   */
  public update(attributes: Partial<P>) {
    this.board.history.create(this.board.layer, this.node)
    this.node.setAttrs(attributes)
  }

  /**
   * Updates attributes of the shape with animation effect
   *
   * @param attributes The list of attributes
   */
  public to(
    attributes: Partial<P> & { duration: number } & Partial<{
        onUpdate: () => void
        onFinish: () => void
      }>
  ) {
    this.board.history.create(this.board.layer, this.node)
    this.node.to(attributes)
  }

  /**
   * Registers required events of the shape
   */
  private registerEvents() {
    /**
     * mouseorver event
     */
    this.node.addEventListener('mouseover', () => {
      if (this.selectable && !this.board.activeDrawing) {
        this.board.stage.getContent().style.cursor = 'move'
      }
    })

    /**
     * mouseout event
     */
    this.node.addEventListener('mouseout', () => {
      this.board.stage.getContent().style.cursor = 'inherit'
    })

    /**
     * dragging start event
     */
    this.node.addEventListener('dragstart', () => {
      if (this.selectable === false || this.board.selection.isDisabled) {
        this.node.stopDrag()
      }
    })

    /**
     * resets originalX and originalY that has been set by [[Rotation]]
     */
    this.node.on('dragend', node =>
      node.currentTarget.setAttrs({
        originalX: undefined,
        originalY: undefined
      })
    )

    /**
     * resets scaleX and scaleX that has been set by [[Rotation]]
     */
    this.node.on('transformend', node =>
      node.currentTarget.setAttrs({
        originalScaleX: undefined,
        originalScaleY: undefined
      })
    )
  }

  /**
   * Calculates the list of filters based on the previous filters and the new filters
   *
   * @param filter The list of filters
   * @returns The new list of filters
   */
  private getFiltersDiff(filter: FilterFunctions | FilterFunctions[]) {
    const filters = Array.isArray(filter) ? filter : [filter]

    return this.filters.filter(
      search =>
        !filters.find(item => {
          if ('name' in search && 'name' in item) {
            return item.name === search.name
          }

          if ('customFn' in search && 'customFn' in item) {
            return search.customFn === item.customFn
          }

          return false
        })
    )
  }
}
