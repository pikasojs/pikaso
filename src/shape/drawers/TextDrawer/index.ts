import Konva from 'konva'

import { Board } from '../../../Board'

import { ShapeDrawer } from '../../ShapeDrawer'

import { DrawType } from '../../../types'
import { TextModel } from '../../models/TextModel'

export class TextDrawer extends ShapeDrawer<Konva.Text, Konva.TextConfig> {
  /**
   * Demonstrates the text shape that is being created
   */
  public node: Konva.Text

  /**
   * Creates a new text builder component
   *
   * @param board The [[Board]]
   */
  constructor(board: Board) {
    super(board, DrawType.Text)
  }

  /**
   * @inheritdoc
   * @override
   */
  public insert(config: Konva.TextConfig): TextModel {
    return super.insert(config)
  }

  /**
   * @inheritdoc
   * @override
   */
  public draw(config: Partial<Konva.TextConfig> = {}) {
    super.draw(config)
  }

  /**
   * @inheritdoc
   * @override
   */
  protected createShape(config: Konva.TextConfig): TextModel {
    this.node = new Konva.Text(config)

    return new TextModel(this.board, this.node)
  }

  /**
   * Starts drawing a text shape
   */
  protected onStartDrawing() {
    super.onStartDrawing()

    if (!this.isDrawing) {
      return
    }

    this.createShape({
      x: this.startPoint.x,
      y: this.startPoint.y,
      ...this.config
    })
  }

  /**
   * Continues drawing the text by changing its radius
   */
  protected onDrawing(e: Konva.KonvaEventObject<MouseEvent>) {
    super.onDrawing(e)
  }
}
