import Konva from 'konva'

import { rotateAroundCenter } from '../utils/rotate-around-center'

import { Board } from '../Board'
import { Events } from '../Events'
import { Filter } from '../Filter'
import { Flip } from '../Flip'
import { History } from '../History'

import type { Filters } from '../types'

interface SetAttributesAnimationOptions {
  duration: number
  onUpdate?: () => void
  onFinish?: () => void
}
interface ShapeConfig {
  transformer?: Konva.TransformerConfig
  selectable?: boolean
}
export class Shape {
  /**
   * Represents the shape's node
   */
  public node: Konva.Group | Konva.Shape

  /**
   * Represents the configuration of the shape
   */
  public config: ShapeConfig

  /**
   * Represents the [[Board]]
   */
  private readonly board: Board

  /**
   * Represents the [[Events]]
   */
  private readonly events: Events

  /**
   * Represents the [[History]]
   */
  private readonly history: History

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
   * Creates a new shape
   *
   * @param board The [[Board]]
   * @param events The [[Events]]
   * @param history The [[History]]
   * @param node The Node
   * @param config The [[ShapeConfig | Config]]
   */
  constructor(
    board: Board,
    events: Events,
    history: History,
    node: Konva.Group | Konva.Shape,
    config: ShapeConfig
  ) {
    this.board = board
    this.events = events
    this.history = history

    this.node = node
    this.config = Object.assign(
      {
        transformer: {},
        selectable: true
      },
      config
    )

    this.flip = new Flip(board, events, history)
    this.filter = new Filter(board, events, history)

    if (this.config.selectable) {
      this.registerEvents()
    }
  }

  /**
   * Returns whether the shape is deleted or not
   */
  public get isDeleted() {
    return this.deleted
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
   * Adds a filter to the shape
   *
   * @param filter The [[Filters | Filter]]
   */
  public addFilter(filter: Filters) {
    this.filter.apply([this], filter)
  }

  /**
   * Removes filter from the shape
   *
   * @param name The filter name
   */
  public removeFilter(name: Filters['name']) {
    this.filter.remove([this], name)
  }

  /**
   * Deletes the shape.
   *
   * This action can undo with [[Shape.undelete]] method
   */
  public delete() {
    if (this.deleted) {
      return
    }

    this.deselect()
    this.node.hide()
    this.node.cache()
    this.deleted = true

    this.events.emit('shape:delete', {
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

    this.events.emit('shape:undelete', {
      shapes: [this]
    })
  }

  /**
   * Destroys a deleted shape
   */
  public destroy() {
    this.node.destroy()

    const shapes = this.board
      .getShapes()
      .filter(shape => shape.node !== this.node)

    this.board.setShapes(shapes)

    this.events.emit('shape:destroy', {
      shapes: [this]
    })
  }

  /**
   * Rotates the node around its center without transforming
   *
   * @param theta The rotation angle
   */
  public rotate(theta: number) {
    rotateAroundCenter(this.node, theta)
    this.board.draw()

    this.events.emit('shape:rotate', {
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
   * @param animationOptions The animation options
   */
  public update(
    attributes: Partial<Konva.ShapeConfig>,
    animationOptions?: SetAttributesAnimationOptions
  ) {
    this.history.create(this.board.layer, this.node)

    if (animationOptions) {
      this.node.to({
        ...attributes,
        duration: animationOptions.duration || 0.5,
        onUpdate: () => animationOptions.onUpdate?.(),
        onFinish: () => animationOptions.onFinish?.()
      })
    } else {
      this.node.setAttrs(attributes)
    }

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
      this.board.stage.getContent().style.cursor = 'move'
    })

    /**
     * mouseout event
     */
    this.node.addEventListener('mouseout', () => {
      this.board.stage.getContent().style.cursor = 'inherit'
    })
  }
}
