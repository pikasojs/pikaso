import Konva from 'konva'

import { Board } from '../../../Board'

import { ShapeDrawer } from '../../ShapeDrawer'
import { EllipseModel } from '../../models/EllipseModel'

import { DrawType } from '../../../types'

export class EllipseDrawer extends ShapeDrawer<
  Konva.Ellipse,
  Konva.EllipseConfig
> {
  /**
   * Demonstrates the ellipse node that is being created
   */
  public node: Konva.Ellipse

  /**
   * Creates a new ellipse builder component
   *
   * @param board The [[Board]
   */
  constructor(board: Board) {
    super(board, DrawType.Ellipse)
  }

  /**
   * @inheritdoc
   * @override
   */
  public insert(config: Konva.EllipseConfig): EllipseModel {
    return super.insert(config)
  }

  /**
   * @inheritdoc
   * @override
   */
  public draw(config: Partial<Konva.EllipseConfig> = {}) {
    super.draw(config)
  }

  /**
   * @inheritdoc
   * @override
   */
  protected createShape(config: Konva.EllipseConfig): EllipseModel {
    this.node = new Konva.Ellipse(config)

    return new EllipseModel(this.board, this.node)
  }

  /**
   * Starts drawing an ellipse shape
   */
  protected onStartDrawing() {
    super.onStartDrawing()

    if (!this.isDrawing) {
      return
    }

    this.createShape({
      x: this.startPoint.x,
      y: this.startPoint.y,
      radiusX: 0,
      radiusY: 0,
      ...this.config
    })
  }

  /**
   * Continues drawing the ellipse by changing its radius values
   */
  protected onDrawing(e: Konva.KonvaEventObject<MouseEvent>) {
    super.onDrawing(e)

    if (!this.node) {
      return
    }

    const point = this.board.stage.getPointerPosition()!

    const radiusX = Math.abs(point.x - this.node.x())
    const radiusY = Math.abs(point.y - this.node.y())

    this.node.setAttrs({
      radiusX,
      radiusY: e.evt.shiftKey ? radiusX : radiusY
    })
  }
}
