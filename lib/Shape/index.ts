import Konva from 'konva'

import { Board } from '../Board'
import { Events } from '../Events'
import { Flip } from '../Flip'
import { History } from '../History'

export class Shape {
  /**
   *
   */
  public instance: Konva.Group | Konva.Shape

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

  constructor(
    board: Board,
    events: Events,
    history: History,
    instance: Konva.Group | Konva.Shape,
    transformerConfig = {}
  ) {
    this.board = board
    this.flip = new Flip(board, events, history)

    this.instance = instance
    this.transformerConfig = transformerConfig

    this.registerEvents()
  }

  /**
   *
   */
  public flipX() {
    this.flip.horizontal([this.instance])
  }

  /**
   *
   */
  public flipY() {
    this.flip.vertical([this.instance])
  }

  private registerEvents() {
    this.instance.addEventListener('mouseover', () => {
      this.board.stage.getContent().style.cursor = 'move'
    })

    this.instance.addEventListener('mouseout', () => {
      this.board.stage.getContent().style.cursor = 'inherit'
    })
  }
}
