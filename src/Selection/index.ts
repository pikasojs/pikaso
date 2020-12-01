import Konva from 'konva'

import { Board } from '../Board'
import { Events } from '../Events'
import { History } from '../History'
import { Shape } from '../Shape'
import { Filter } from '../Filter'

import type { Point, Filters } from '../types'

export class Selection {
  /**
   *
   */
  public list: Array<Shape> = []

  /**
   *
   */
  public transformer: Konva.Transformer

  /**
   *
   */
  private board: Board

  /**
   *
   */
  private readonly history: History

  /**
   *
   */
  private readonly events: Events

  /**
   *
   */
  private readonly filter: Filter

  /**
   *
   */
  private zone: Konva.Rect

  /**
   *
   */
  private startPointerPosition: Point

  constructor(board: Board, events: Events, history: History) {
    this.board = board
    this.events = events
    this.history = history

    this.filter = new Filter(board, events, history)

    this.createZone()
    this.createTransformer()

    this.board.stage.on('mousedown touchstart', this.onDragZoneStart.bind(this))
    this.board.stage.on('mousemove touchmove', this.onDragZoneMove.bind(this))
    this.board.stage.on('mouseup touchend', this.onDragZoneEnd.bind(this))

    window.addEventListener('mouseup', this.onWindowMouseUp.bind(this))
    window.addEventListener('touchend', this.onWindowMouseUp.bind(this))

    window.addEventListener('keydown', this.onKeyDown.bind(this))
  }

  /**
   *
   */
  public get shapes() {
    return this.list
  }

  /**
   *
   */
  public get isVisible() {
    return this.transformer.nodes().length > 0
  }

  /**
   *
   */
  public getTransformer() {
    return this.transformer
  }

  /**
   *
   */
  public find(selector: (shape: Shape) => boolean) {
    const list = this.board.getShapes().filter(shape => {
      return selector(shape)
    })

    this.multi(list)
  }

  /**
   *
   */
  public selectAll() {
    this.multi(this.board.getShapes())
  }

  /**
   *
   */
  public deselectAll() {
    this.multi([])
  }

  /**
   *
   */
  public reselect() {
    const list = this.list

    this.deselectAll()
    this.multi(list)
  }

  /**
   *
   */
  public multi(shapes: Shape[]) {
    this.list = shapes

    const attrs: Partial<Konva.TransformerConfig> = shapes.reduce(
      (acc, item) => {
        const enabledAnchors = item.node.isCached()
          ? []
          : item.config.transformer?.enabledAnchors

        return {
          ...acc,
          ...item.config.transformer,
          enabledAnchors
        }
      },
      {
        visible: true,
        centeredScaling: true,
        rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
        keepRatio: shapes.length > 1,
        rotateEnabled: true,
        enabledAnchors: [
          'top-left',
          'top-right',
          'bottom-left',
          'bottom-right',
          'top-center',
          'bottom-center',
          'middle-left',
          'middle-right'
        ]
      } as Konva.TransformerConfig
    )

    this.transformer.show()
    this.transformer.moveToTop()
    this.transformer.setAttrs(attrs).nodes(shapes.map(shape => shape.node))

    if (shapes.length === 0) {
      this.transformer.hide()
    }

    this.board.layer.draw()

    this.events.emit('selection:change', {
      shapes
    })
  }

  /**
   *
   * @param shape
   */
  public add(shape: Shape) {
    const isSelected = this.list.some(item => item.node === shape.node)

    if (isSelected) {
      return
    }

    this.multi([...this.list, shape])
  }

  /**
   *
   * @param shape
   */
  public toggle(shape: Shape) {
    const isSelected = this.list.some(item => item.node === shape.node)

    if (isSelected) {
      this.deselect(shape)
      return
    }

    this.multi([...this.list, shape])
  }

  /**
   *
   */
  public deselect(shape: Shape) {
    this.list = this.list.filter(item => item !== shape)

    this.multi(this.list)
  }

  /***
   *
   */
  public delete() {
    if (this.list.length === 0) {
      return
    }

    const shapes = this.list

    this.list = []

    this.board.stage.getContent().style.cursor = 'inherit'
    this.transformer.nodes([])

    this.history.create(this.board.layer, [], {
      undo: () => shapes.forEach(shape => shape.undelete()),
      redo: () => shapes.forEach(shape => shape.delete())
    })

    shapes.forEach(shape => shape.delete())

    this.board.layer.batchDraw()

    this.events.emit('selection:delete', {
      shapes
    })
  }

  /**
   *
   */
  public moveX(value: number) {
    this.history.create(
      this.board.layer,
      this.transformer.nodes() as Konva.Shape[]
    )

    this.list.forEach(shape => {
      shape.node.to({
        x: shape.node.x() + value
      })
    })

    this.board.layer.batchDraw()

    this.events.emit('selection:move', {
      shapes: this.list,
      data: {
        axis: 'x',
        value
      }
    })
  }

  /**
   *
   */
  public moveY(value: number) {
    this.history.create(
      this.board.layer,
      this.transformer.nodes() as Konva.Shape[]
    )

    this.list.forEach(shape => {
      shape.node.to({
        y: shape.node.y() + value
      })
    })

    this.board.layer.batchDraw()

    this.events.emit('selection:move', {
      shapes: this.list,
      data: {
        axis: 'y',
        value
      }
    })
  }

  /**
   *
   */
  public addFilter(filter: Filters) {
    this.filter.apply(this.list, filter)
    this.reselect()
  }

  /**
   *
   */
  public removeFilter(name: Filters['name']) {
    this.filter.remove(this.list, name)
    this.reselect()
  }

  /**
   *
   */
  private createZone() {
    this.zone = new Konva.Rect({
      fill: 'rgba(105, 105, 105, 0.7)',
      stroke: '#dbdbdb',
      visible: false
    })

    this.board.layer.add(this.zone)
    this.board.layer.draw()
  }

  /**
   *
   */
  private createTransformer() {
    this.transformer = new Konva.Transformer()

    /**
     *
     */
    this.transformer.on('dragstart', () => {
      this.history.create(
        this.board.layer,
        this.list.map(shape => shape.node)
      )

      this.events.emit('selection:dragstart', {
        shapes: this.list
      })
    })

    /**
     *
     */
    this.transformer.on('dragmove', () => {
      this.events.emit('selection:dragmove', {
        shapes: this.list
      })
    })

    /**
     *
     */
    this.transformer.on('dragend', () => {
      this.events.emit('selection:dragend', {
        shapes: this.list
      })
    })

    /**
     * selections transform start
     */
    this.transformer.on('transformstart', () => {
      this.history.create(
        this.board.layer,
        this.list.map(shape => shape.node),
        {
          execute: () => this.board.selection.transformer.forceUpdate()
        }
      )

      this.events.emit('selection:transformstart', {
        shapes: this.list
      })
    })

    /**
     * selections transform
     */
    this.transformer.on('transform', () => {
      this.events.emit('selection:transform', {
        shapes: this.list
      })
    })

    /**
     * selections transform end
     */
    this.transformer.on('transformend', () => {
      this.events.emit('selection:transformend', {
        shapes: this.list
      })
    })

    this.board.layer.add(this.transformer)
    this.board.layer.draw()
  }

  /**
   *
   * @param e
   */
  private onDragZoneStart(e: Konva.KonvaEventObject<MouseEvent>) {
    const shape = this.board
      .getShapes()
      .find(shape => shape.node === this.getParentNode(e.target))

    if (shape && !this.list.includes(shape)) {
      const isShiftKeyUp = e.evt.shiftKey === true
      const isCtrlKeyUp = e.evt.ctrlKey === true

      if (!isShiftKeyUp && !isCtrlKeyUp) {
        this.multi([shape])
      } else if (isShiftKeyUp && !isCtrlKeyUp) {
        this.add(shape)
      } else if (isCtrlKeyUp && !isShiftKeyUp) {
        this.toggle(shape)
      }

      this.board.setActiveDrawing(null)

      return
    }

    if (
      this.board.activeDrawing !== null ||
      this.isBackgroundNode(e.target) === false
    ) {
      return
    }

    this.startPointerPosition = this.board.stage.getPointerPosition()!

    this.zone
      .setAttrs({
        width: 0,
        height: 0,
        visible: true
      })
      .moveToTop()

    this.board.layer.batchDraw()
  }

  /**
   *
   */
  private onDragZoneMove() {
    if (!this.zone.visible()) {
      return
    }

    const { x, y } = this.board.stage.getPointerPosition()!

    this.zone.setAttrs({
      x: Math.min(this.startPointerPosition.x, x),
      y: Math.min(this.startPointerPosition.y, y),
      width: Math.abs(x - this.startPointerPosition.x),
      height: Math.abs(y - this.startPointerPosition.y)
    })

    this.board.layer.batchDraw()
  }

  /**
   *
   */
  private onDragZoneEnd() {
    if (!this.zone.visible()) {
      return
    }

    setTimeout(() => {
      this.zone.visible(false)
      this.board.layer.batchDraw()
    }, 10)

    const box = this.zone.getClientRect()

    const shapes = this.board
      .getShapes()
      .filter(shape =>
        Konva.Util.haveIntersection(box, shape.node.getClientRect())
      )

    this.multi(shapes)
  }

  /**
   *
   * @param e
   */
  private onWindowMouseUp(e: MouseEvent) {
    if (e.target instanceof HTMLCanvasElement) {
      return
    }

    this.onDragZoneEnd()
  }

  /**
   *
   *
   */
  private onKeyDown(
    e: Event & {
      key: string
    }
  ) {
    const nodes = this.transformer.nodes()

    if (this.transformer.getAttr('visible') === false || nodes.length === 0) {
      return
    }

    switch (e.key) {
      case 'Backspace':
      case 'Delete':
        this.delete()
        break

      case 'ArrowLeft':
        this.moveX(-5)
        break

      case 'ArrowRight':
        this.moveX(5)
        this.board.layer.batchDraw()
        break

      case 'ArrowUp':
        this.moveY(-5)
        this.board.layer.batchDraw()
        break

      case 'ArrowDown':
        this.moveY(5)
        this.board.layer.batchDraw()
        break

      case 'Escape':
        this.deselectAll()
        break
    }
  }

  /**
   *
   * @param node
   */
  private getParentNode(
    node: Konva.Stage | Konva.Group | Konva.Shape
  ): Konva.Group | Konva.Shape {
    let item = node

    while (item.parent && item.parent?.getType() !== 'Layer') {
      item = item.parent as Konva.Group | Konva.Shape
    }

    return item
  }

  /**
   *
   * @param node
   */
  private isBackgroundNode(node: Konva.Stage | Konva.Group | Konva.Shape) {
    return (
      node === this.board.stage || node === this.board.background.overlay.node
    )
  }
}
