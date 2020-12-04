import Konva from 'konva'

import { Board } from '../../Board'
import { Events } from '../../Events'
import { ShapeDrawer } from '../../ShapeDrawer'

import { DrawType } from '../../types'

export class Arrow extends ShapeDrawer {
  /**
   * Demonstrates the arrow shape that is being created
   */
  public shape: Konva.Arrow

  /**
   * Creates a new arrow builder component
   *
   * @param board The [[Board]]
   * @param events The [[Events]]
   */
  constructor(board: Board, events: Events) {
    super(board, events, DrawType.Arrow)
  }

  /**
   * @inheritdoc
   * @override
   */
  public insert(config: Konva.ArrowConfig) {
    return super.insert(config)
  }

  /**
   * @inheritdoc
   * @override
   */
  public draw(config: Partial<Konva.ArrowConfig> = {}) {
    super.draw(config)
  }

  /**
   * @inheritdoc
   * @override
   */
  protected createShape(config: Konva.ArrowConfig) {
    this.shape = new Konva.Arrow(config)

    return this.board.addShape(this.shape)
  }

  /**
   * Starts drawing an arrow shape
   */
  protected onStartDrawing() {
    super.onStartDrawing()

    this.createShape({
      globalCompositeOperation: 'source-over',
      points: [this.startPoint.x, this.startPoint.y],
      ...this.config
    })
  }

  /**
   * Continues arrow drawing by concating the first point and
   * current point together
   */
  protected onDrawing(e: Konva.KonvaEventObject<MouseEvent>) {
    super.onDrawing(e)

    if (!this.shape) {
      return
    }

    const point = this.board.stage.getPointerPosition()!
    this.shape.points([...this.shape.points().slice(0, 2), point.x, point.y])

    this.board.draw()
  }
}
