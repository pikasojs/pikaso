import Konva from 'konva'

import { Board } from '../../Board'
import { Filter } from '../../Filter'
import { Flip } from '../../Flip'

import type { Filters, ShapeConfig, FilterFunctions } from '../../types'

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
      history: config.history ?? true,
      selectable: this.selectable,
      ...config
    }

    if (this.config.history) {
      this.board.history.create(this.board.layer, [], {
        undo: () => this.delete(),
        redo: () => this.undelete()
      })
    }

    this.board.events.emit('shape:create', {
      shapes: [this]
    })

    if (this.config.selectable) {
      this.node.draggable(true)
      this.board.addShape(this)
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
  }

  /**
   * Removes a filter or list of filters from the selected shapes
   *
   * @param filters The filter function or functions
   */
  public removeFilter(filters: FilterFunctions | FilterFunctions[]) {
    this.filter.remove([this], filters)
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
    this.node.cache()
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
    this.node.clearCache()
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
   * @param options The options of updading attributes
   */
  public update(attributes: Partial<P>) {
    this.board.history.create(this.board.layer, this.node)
    this.node.setAttrs(attributes)

    this.board.draw()
  }

  /**
   * Updates attributes of the shape with animation effect
   *
   * @param attributes The list of attributes
   * @param options The options of updading attributes
   */
  public to(
    attributes: Partial<P> & { duration: number } & Partial<{
        onUpdate: () => void
        onFinish: () => void
      }>
  ) {
    this.board.history.create(this.board.layer, this.node)
    this.node.to(attributes)

    this.board.draw()
  }

  /**
   * Registers required events of the shape
   */
  private registerEvents() {
    /**
     * mouseorver event
     */
    this.node.addEventListener('mouseover', () => {
      if (this.isSelectable) {
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
      if (this.isSelectable === false || this.board.selection.isLocked) {
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
   * Returns type of the shape
   */
  public abstract get type(): string
}
