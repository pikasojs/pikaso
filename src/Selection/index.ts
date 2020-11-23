import Konva from 'konva'

import { Board } from '../Board'
import { Shape } from '../Shape'

import type { Point } from '../types'

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
  private zone: Konva.Rect

  /**
   *
   */
  private startPointerPosition: Point

  constructor(board: Board) {
    this.board = board

    this.createZone()
    this.createTransformer()

    this.board.stage.on('mousedown touchstart', this.onDragZoneStart.bind(this))
    this.board.stage.on('mousemove touchmove', this.onDragZoneMove.bind(this))
    this.board.stage.on('mouseup touchend', this.onDragZoneEnd.bind(this))

    window.addEventListener('mouseup', this.onDragZoneEnd.bind(this))
    window.addEventListener('touchend', this.onDragZoneEnd.bind(this))
    window.addEventListener('keydown', this.onKeyDown.bind(this))
  }

  /**
   *
   */
  public getShapes() {
    return this.list
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

    this.multiSelect(list)
  }

  /**
   *
   */
  public selectAll() {
    this.multiSelect(this.board.getShapes())
  }

  /**
   *
   */
  public deselectAll() {
    this.update([])

    this.transformer.hide()
    this.board.layer.draw()
  }

  /**
   *
   * @param shapes
   */
  public update(shapes: Shape[]) {
    this.list = shapes
  }

  /**
   *
   * @param shape
   */
  public add(shape: Shape) {
    this.list = [...this.list, shape]
  }

  /**
   *
   */
  public multiSelect(shapes: Shape[]) {
    this.list = shapes

    const attrs: Partial<Konva.TransformerConfig> = shapes.reduce(
      (acc, item) => {
        return {
          ...acc,
          ...item.transformerConfig
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

    this.transformer.moveToTop()
    this.transformer.setAttrs(attrs).nodes(shapes.map(shape => shape.node))

    this.board.layer.draw()
  }

  /**
   *
   * @param shape
   */
  public select(shape: Shape) {
    const isSelected = this.list.some(item => item.node === shape.node)

    if (isSelected) {
      return
    }

    this.multiSelect([...this.list, shape])
  }

  /**
   *
   */
  public deselect(shape: Shape) {
    const nodes = this.getTransformer()
      .nodes()
      .filter(node => {
        return node !== shape.node
      })

    if (nodes.length === 0) {
      this.deselectAll()
      return
    }

    this.transformer.nodes(nodes)
    this.board.layer.draw()
  }

  /***
   *
   */
  public delete() {
    const nodes = this.transformer.nodes()

    if (nodes.length === 0) {
      return
    }

    this.board.stage.getContent().style.cursor = 'inherit'

    const shapes = this.board.getShapes().filter(shape => {
      return nodes.some(node => node === shape.node) === false
    })

    this.board.setShapes(shapes)

    nodes.forEach(shape => {
      shape.destroy()
    })

    this.update([])
    this.transformer.nodes([])

    this.board.layer.batchDraw()
  }

  /**
   *
   */
  public moveX(value: number) {
    this.transformer.nodes().forEach(node => {
      node.x(node.x() + value)
    })

    this.board.layer.batchDraw()
  }

  /**
   *
   */
  public moveY(value: number) {
    this.transformer.nodes().forEach(node => {
      node.y(node.y() + value)
    })

    this.board.layer.batchDraw()
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

    if (shape) {
      this.select(shape)
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

    this.update(shapes)
    this.multiSelect(shapes)
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
    return node === this.board.stage || node === this.board.backgroundOverlay
  }
}
