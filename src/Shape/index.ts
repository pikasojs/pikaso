import Konva from 'konva'

import { rotateAroundCenter } from '../utils/rotate-around-center'

import { Board } from '../Board'
import { Events } from '../Events'
import { Filter } from '../Filter'
import { Flip } from '../Flip'
import { History } from '../History'

import type { Filters } from '../types'

interface ShapeConfig {
  transformer?: Konva.TransformerConfig
  selectable?: boolean
}
export class Shape {
  /**
   *
   */
  public node: Konva.Group | Konva.Shape

  /**
   *
   */
  public config: ShapeConfig

  /**
   *
   */
  private readonly board: Board

  /**
   *
   */
  private readonly events: Events

  /**
   *
   */
  private readonly history: History

  /**
   *
   */
  private readonly flip: Flip

  /**
   *
   */
  private readonly filter: Filter

  /**
   *
   */
  private deleted: boolean = false

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
   *
   */
  public get isDeleted() {
    return this.deleted
  }

  /**
   *
   */
  public flipX() {
    this.flip.horizontal([this.node])
  }

  /**
   *
   */
  public flipY() {
    this.flip.vertical([this.node])
  }

  /**
   *
   */
  public select() {
    this.board.selection.add(this)
  }

  /**
   *
   */
  public deselect() {
    this.board.selection.deselect(this)
  }

  /**
   *
   */
  public addFilter(filter: Filters) {
    this.filter.apply([this], filter)
  }

  /**
   *
   */
  public removeFilter(name: Filters['name']) {
    this.filter.remove([this], name)
  }

  /**
   *
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
   *
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
   *
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
   *
   */
  public gc() {
    if (!this.deleted) {
      return
    }

    this.destroy()

    this.events.emit('shape:gc', {
      shapes: [this]
    })
  }

  /**
   * rotates the node around its center without transforming
   * @param theta - the rotation angle
   */
  public rotate(theta: number) {
    rotateAroundCenter(this.node, theta)
    this.board.layer.draw()

    this.events.emit('shape:rotate', {
      shapes: [this]
    })
  }

  /**
   *
   */
  public x() {
    return this.node.x()
  }

  /**
   *
   */
  public y() {
    return this.node.y()
  }

  /**
   *
   */
  public scale() {
    return this.node.scale()
  }

  /**
   *
   */
  public scaleX() {
    return this.node.scaleX()
  }

  /**
   *
   */
  public scaleY() {
    return this.node.scaleY()
  }

  /**
   *
   */
  public show() {
    return this.node.show()
  }

  /**
   *
   */
  public hide() {
    return this.node.hide()
  }

  /**
   *
   */
  public setAttr(name: string, value: unknown) {
    return this.setAttrs({
      [name]: value
    })
  }

  /**
   *
   */
  public setAttrs(attributes: Partial<Konva.ShapeConfig>) {
    this.history.create(this.board.layer, this.node)

    return this.node.setAttrs(attributes)
  }

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
