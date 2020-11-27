import Konva from 'konva'

import { Board } from '../Board'
import { Events } from '../Events'
import { Flip } from '../Flip'
import { History } from '../History'
import { rotateAroundCenter } from '../utils/rotate-around-center'

export class Shape {
  /**
   *
   */
  public node: Konva.Group | Konva.Shape

  /**
   *
   */
  public transformerConfig: Konva.TransformerConfig

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
  private deleted: boolean = false

  constructor(
    board: Board,
    events: Events,
    history: History,
    node: Konva.Group | Konva.Shape,
    transformerConfig = {}
  ) {
    this.board = board
    this.events = events
    this.history = history
    this.flip = new Flip(board, events, history)

    this.node = node
    this.transformerConfig = transformerConfig

    this.registerEvents()
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

    this.events.emit('shape:destory', {
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
