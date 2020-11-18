import Konva from 'konva'

import { getPointsDistance } from '../utils/get-points-distance'

import { Board } from '../Board'
import { Events } from '../Events'
import { History } from '../History'
import { Shape } from '../Shape'

import { IShape, IDrawableShape, DrawType, Point } from '../types'

export abstract class ShapeDrawer implements IShape, IDrawableShape {
  /**
   *
   */
  protected readonly board: Board

  /**
   *
   */
  private readonly events: Events

  /**
   *
   */
  private readonly history: History

  /***
   *
   */
  private drawType: DrawType

  /**
   *
   */
  private config: Partial<Konva.ShapeConfig>

  /**
   *
   */
  private startPointerPosition: Point

  /**
   *
   */
  public abstract shape: Konva.Shape | null

  constructor(
    board: Board,
    events: Events,
    history: History,
    drawType: DrawType
  ) {
    this.board = board
    this.events = events
    this.history = history
    this.drawType = drawType

    this.onStart = this.onStart.bind(this)
    this.onMove = this.onMove.bind(this)
    this.onEnd = this.onEnd.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  /**
   *
   */
  public isDrawing() {
    return this.board.activeDrawing === this.drawType
  }

  /**
   *
   */
  public insert(config: Konva.ShapeConfig): Shape | void {
    this.stopDrawing()

    return this.createShape(config)
  }

  /**
   *
   */
  public draw(config: Partial<Konva.LineConfig | Konva.ArrowConfig> = {}) {
    this.config = config

    // stop previous drawing if exists
    this.stopDrawing()

    this.board.setActiveDrawing(this.drawType)

    this.board.stage.on('mousedown touchstart', this.onStart)
    this.board.stage.on('mousemove touchmove', this.onMove)
    this.board.stage.on('mouseup touchend', this.onEnd)

    window.addEventListener('mouseup', this.onEnd)
    window.addEventListener('touchend', this.onEnd)
    window.addEventListener('keydown', this.onKeyDown)
  }

  /**
   *
   */
  public stopDrawing() {
    this.shape = null

    this.board.setActiveDrawing(null)
    this.board.stage.container().style.cursor = 'inherit'

    this.board.stage.off('mousedown touchstart', this.onStart)
    this.board.stage.off('mousemove touchmove', this.onMove)
    this.board.stage.off('mouseup touchend', this.onEnd)

    window.removeEventListener('mouseup', this.onEnd)
    window.removeEventListener('touchend', this.onEnd)
    window.removeEventListener('keydown', this.onKeyDown)
  }

  /**
   *
   */
  private onStart() {
    if (!this.isDrawing()) {
      return
    }

    const { x, y } = this.board.stage.getPointerPosition()!
    this.startPointerPosition = { x, y }

    if (this.isLineType()) {
      this.createShape({
        globalCompositeOperation: 'source-over',
        points: [x, y],
        ...this.config
      })
    } else {
      this.createShape({
        x,
        y,
        ...this.config
      })
    }
  }

  /**
   *
   */
  private onMove(e: Konva.KonvaEventObject<MouseEvent>) {
    if (this.isDrawing()) {
      this.board.stage.container().style.cursor = 'crosshair'
    }

    if (!this.shape) {
      return
    }

    const point = this.board.stage.getPointerPosition()!

    switch (this.drawType) {
      case DrawType.Pencil:
        this.drawPencil(point)
        break

      case DrawType.Line:
      case DrawType.Arrow:
        this.drawLine(point)
        break

      case DrawType.Ellipse:
        this.drawEllipse(point, e)
        break

      case DrawType.Rect:
        this.drawRect(point, e)
        break

      case DrawType.Polygon:
      case DrawType.Triangle:
        this.drawPolygon(point)
        break

      case DrawType.Circle:
        this.drawCircle(point)
        break
    }

    this.board.layer.batchDraw()
  }

  /**
   *
   */
  private onEnd() {
    this.shape = null
    this.board.stage.container().style.cursor = 'inherit'
  }

  /**
   *
   */
  private drawPencil({ x, y }: Point) {
    const shape = <Konva.Line>this.shape
    shape.points(shape.points().concat([x, y]))
  }

  /**
   *
   */
  private drawLine({ x, y }: Point) {
    const shape = <Konva.Line>this.shape
    shape.points([...shape.points().slice(0, 2), x, y])
  }

  /**
   *
   * @param point
   */
  private drawPolygon(point: Point) {
    const shape = <Konva.RegularPolygon>this.shape

    shape.setAttrs({
      radius: getPointsDistance(point, this.getShapePosition())
    })
  }

  /**
   *
   * @param point
   */
  private drawCircle(point: Point) {
    const shape = <Konva.Circle>this.shape

    shape.setAttrs({
      radius: getPointsDistance(point, this.getShapePosition())
    })
  }

  /**
   *
   * @param point
   */
  private drawEllipse(point: Point, e: Konva.KonvaEventObject<MouseEvent>) {
    const shape = <Konva.Ellipse>this.shape
    const radiusX = Math.abs(point.x - shape.x())
    const radiusY = Math.abs(point.y - shape.y())

    shape.setAttrs({
      radiusX,
      radiusY: e.evt.shiftKey ? radiusX : radiusY
    })
  }

  /**
   *
   * @param point
   */
  private drawRect(point: Point, e: Konva.KonvaEventObject<MouseEvent>) {
    const shape = <Konva.Rect>this.shape

    const width = Math.abs(point.x - this.startPointerPosition.x)
    const height = Math.abs(point.y - this.startPointerPosition.y)

    shape.setAttrs({
      x: Math.min(this.startPointerPosition.x, point.x),
      y: Math.min(this.startPointerPosition.y, point.y),
      width,
      height: e.evt.shiftKey ? width : height
    })
  }

  /**
   *
   */
  private onKeyDown(
    e: Event & {
      key: string
    }
  ) {
    switch (e.key) {
      case 'Escape':
        this.stopDrawing()
        break
    }
  }

  /**
   *
   */
  private isLineType() {
    return [DrawType.Pencil, DrawType.Line, DrawType.Arrow].includes(
      this.drawType
    )
  }

  /**
   *
   */
  private getShapePosition() {
    return {
      x: this.shape!.x(),
      y: this.shape!.y()
    }
  }

  /**
   *
   * @param config
   */
  protected abstract createShape(config: Partial<Konva.ShapeConfig>): Shape
}
