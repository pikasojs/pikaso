import Konva from 'konva'

import { Board } from '../../Board'
import { Events } from '../../Events'
import { ShapeDrawer } from '../../ShapeDrawer'

import { DrawType } from '../../types'

export class Line extends ShapeDrawer {
  /**
   *
   */
  public shape: Konva.Line

  /**
   * Creates a new line builder component
   *
   * @param board The [[Board]]
   * @param events The [[Events]]
   */
  constructor(board: Board, events: Events) {
    super(board, events, DrawType.Line)
  }

  /**
   *
   * @param config
   */
  public insert(config: Konva.LineConfig) {
    return super.insert(config)
  }

  /**
   *
   * @param config
   */
  public draw(config: Partial<Konva.LineConfig> = {}) {
    super.draw(config)
  }

  /**
   *
   * @param config
   */
  protected createShape(config: Konva.LineConfig) {
    this.shape = new Konva.Line({
      hitStrokeWidth: 15,
      ...config
    })

    return this.board.addShape(this.shape)
  }

  /**
   * Starts drawing a line
   */
  protected onStartDrawing() {
    super.onStartDrawing()

    if (!this.isDrawing) {
      return
    }

    this.createShape({
      globalCompositeOperation: 'source-over',
      points: [this.startPoint.x, this.startPoint.y],
      ...this.config
    })
  }

  /**
   * Continues line drawing by concating the first point and
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
