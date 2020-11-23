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
  private flip: Flip

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
    this.flip = new Flip(board, events, history)

    this.node = node
    this.transformerConfig = transformerConfig

    node.addEventListener('transformstart', () => {
      history.create(board.layer, this.getCurrentState())
    })

    node.addEventListener('dragstart', () => {
      history.create(board.layer, this.getCurrentState())
    })

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
    this.board.selection.select(this)
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
  }

  /**
   *
   */
  public gc() {
    if (!this.deleted) {
      return
    }

    this.destroy()
  }

  /**
   * rotates the node around its center without transforming
   * @param theta - the rotation angle
   */
  public rotate(theta: number) {
    rotateAroundCenter(this.node, theta)
    this.board.layer.draw()
  }

  /**
   *
   */
  private getCurrentState() {
    return [this.node, ...this.node.children].map(node => ({
      node,
      current: {
        rotation: node.rotation(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY(),
        width: node.width(),
        height: node.height(),
        ...node.attrs
      }
    }))
  }

  private registerEvents() {
    this.node.addEventListener('mouseover', () => {
      this.board.stage.getContent().style.cursor = 'move'
    })

    this.node.addEventListener('mouseout', () => {
      this.board.stage.getContent().style.cursor = 'inherit'
    })
  }
}
