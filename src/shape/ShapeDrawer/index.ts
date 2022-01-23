import Konva from 'konva'

import { Board } from '../../Board'
import { ShapeModel } from '../../shape/ShapeModel'

import { IShape, IDrawableShape, Point } from '../../types'

/**
 * This is an abstract class that Shapes have to extend that to insert or
 * draw their own
 *
 * @example
 * ```ts
 * editor.board.shapes.circle.insert({
 *  x: 100,
 *  y: 100,
 *  radius: 10,
 *  fill: 'red'
 * })
 * ```
 *
 * @example
 * ```ts
 * editor.board.shapes.circle.draw()
 * ```
 *
 * @example
 * ```
 * editor.board.shapes.circle.stopDrawing()
 * ```
 */
export abstract class ShapeDrawer<
  T extends Konva.Shape,
  P extends Konva.ShapeConfig
> implements IShape, IDrawableShape
{
  /**
   * Reperesents the configuration of the shape that is drawing that
   */
  public config: Partial<P>

  /**
   * Reperesents the start point of the drawing shape
   */
  public startPoint: Point

  /**
   * Reperesents the [[Board]]
   */
  protected readonly board: Board

  /***
   * Reperesents [[string | Draw Types]]
   */
  private drawType: string

  /**
   * Reperesents the node which is drawing or has been drawn
   */
  public abstract node: T | null

  /**
   * Creates a Shape Drawer instance to build and draw different shapes
   *
   * @param board The [[Board]]
   * @param drawType The type of [[string | Drawing]]
   */
  constructor(board: Board, drawType: string) {
    this.board = board
    this.drawType = drawType

    this.onStartDrawing = this.onStartDrawing.bind(this)
    this.onFinishDrawing = this.onFinishDrawing.bind(this)
    this.onDrawing = this.onDrawing.bind(this)

    this.onKeyDown = this.onKeyDown.bind(this)
  }

  /**
   * Checks wheather the current shape is drawing or not
   */
  public get isDrawing() {
    return this.board.activeDrawing === this.drawType
  }

  /**
   * Creates a new shape and insert that into the [[Board]]
   *
   * @param config The [[ShapeModel]] configuration
   * @returns The created [[ShapeModel]]
   *
   * @override
   */
  public insert(config: Konva.ShapeConfig): ShapeModel<T> {
    this.stopDrawing()

    return this.createShape(config)
  }

  /**
   * Enables the drawing mode
   *
   * @param config The initial [[ShapeModel]] config
   *
   * @override
   */
  public draw(config: Partial<P>) {
    this.config = config

    // stop previous drawing if exists
    this.stopDrawing()

    this.board.setActiveDrawing(this.drawType)

    this.board.stage.on('mousedown touchstart', this.onStartDrawing)
    this.board.stage.on('mousemove touchmove', this.onDrawing)
    this.board.stage.on('mouseup touchend', this.onFinishDrawing)

    window.addEventListener('mouseup', this.onFinishDrawing)
    window.addEventListener('touchend', this.onFinishDrawing)
    window.addEventListener('keydown', this.onKeyDown)
  }

  /**
   * Stops drawing mode
   */
  public stopDrawing() {
    this.node = null

    this.board.setActiveDrawing(null)
    this.board.stage.container().style.cursor = 'inherit'

    this.board.stage.off('mousedown touchstart', this.onStartDrawing)
    this.board.stage.off('mousemove touchmove', this.onDrawing)
    this.board.stage.off('mouseup touchend', this.onFinishDrawing)

    window.removeEventListener('mouseup', this.onFinishDrawing)
    window.removeEventListener('touchend', this.onFinishDrawing)
    window.removeEventListener('keydown', this.onKeyDown)
  }

  /**
   * Returns current position of the shape
   *
   * @returns the current position of the shape as a [[Point]]
   */
  public getShapePosition() {
    return {
      x: this.node!.x(),
      y: this.node!.y()
    }
  }

  /**
   * Triggers when drawing mode is active and a click, touch or mouse
   * down event receiving on the board. then it starting to create the
   * initial shape for drawing that
   */
  protected onStartDrawing() {
    const { x, y } = this.board.stage.getPointerPosition()!
    this.startPoint = { x, y }
  }

  /**
   * Continues drawing the shape based on the mouse move points
   */
  protected onDrawing(e: Konva.KonvaEventObject<MouseEvent>) {
    if (this.isDrawing) {
      this.board.stage.container().style.cursor = 'crosshair'
    }
  }

  /**
   * Triggers on mouse up and finalizes the drawing
   */
  protected onFinishDrawing() {
    this.board.stage.container().style.cursor = 'inherit'

    // auto select the created shape when drawing finishes
    if (this.node && this.board.settings.drawing?.autoSelect) {
      this.board.selection.find(shape => shape.node === this.node)
    }

    this.board.setActiveDrawing(null)
    this.node = null
  }

  /**
   * The keyboard shortcuts for the drawing actions
   */
  private onKeyDown(
    e: Event & {
      key: string
    }
  ) {
    switch (e.key) {
      case 'Escape':
        if (this.board.settings.drawing?.keyboard?.cancelOnEscape) {
          this.stopDrawing()
        }

        break
    }
  }

  /**
   * Creates a shape to insert into board or start drawing that
   *
   * @param config The [[ShapeModel]] config
   *
   * @virtual
   */
  protected abstract createShape(
    config: Partial<Konva.ShapeConfig>
  ): ShapeModel<T>
}
