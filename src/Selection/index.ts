import Konva from 'konva'

import { Board } from '../Board'
import { Filter } from '../Filter'
import { Tag } from '../Tag'
import { LabelModel } from '../shape/models/LabelModel'
import { ShapeModel } from '../shape/ShapeModel'
import { isBrowser } from '../utils/detect-environment'

import type { Point, Filters, FilterFunctions, Dimensions } from '../types'

export class Selection {
  /**
   * Represents list of the selected shapes
   */
  public list: Array<ShapeModel> = []

  /**
   * Represents the selections transformer object
   */
  public transformer: Konva.Transformer

  /**
   * Represents the [[Board]]
   */
  private board: Board

  /**
   * Represents the [[Filter]]
   */
  private readonly filter: Filter

  /**
   * Represents the selection zone rectangle
   */
  private zone: Konva.Rect

  /**
   * Represents the selection dimensions
   */
  private dimensionsTag: Tag | undefined

  /**
   * Represents the start point of selection zone rectangle
   */
  private startPointerPosition: Point

  constructor(board: Board) {
    this.board = board

    this.filter = new Filter(board)

    this.createZone()
    this.createTransformer()

    if (this.board.settings.measurement) {
      this.dimensionsTag = new Tag(this.board)
    }

    this.board.stage.on('mousedown touchstart', this.onDragZoneStart.bind(this))
    this.board.stage.on('mousemove touchmove', this.onDragZoneMove.bind(this))
    this.board.stage.on('mouseup touchend', this.onDragZoneEnd.bind(this))

    if (isBrowser()) {
      window.addEventListener('mouseup', this.onWindowMouseUp.bind(this))
      window.addEventListener('touchend', this.onWindowMouseUp.bind(this))
      window.addEventListener('keydown', this.onKeyDown.bind(this))
    }
  }

  /**
   * Returns list of selected shapes
   *
   * @returns array of [[ShapeModel]]
   */
  public get shapes() {
    return this.list
  }

  /**
   * Checks whether the selection transformer is visible or not
   */
  public get isVisible() {
    return this.list.length > 0
  }

  /**
   * Determines whether the selection has been disabled by another component
   *
   * @returns the disabled status which is true or false
   */
  public get isDisabled(): boolean {
    return (
      !!this.board.activeDrawing ||
      this.board.activeShapes.some(
        shape => shape instanceof LabelModel && shape.isEditing
      )
    )
  }

  /**
   * Returns selection transformer object
   */
  public getTransformer() {
    return this.transformer
  }

  /**
   * Finds and selects multiple shapes
   * @param selector The selector function
   *
   * @example
   * ```ts
   * editor.board.selection.find(shape => shape.node.getType() === 'Rect')
   * ```
   *
   * @example
   * ```ts
   * editor.board.selection.find(shape => shape.node.getId() === '<id>')
   * ```
   */
  public find(selector: (shape: ShapeModel) => boolean) {
    const list = this.board.activeShapes.filter(shape => {
      return selector(shape)
    })

    this.multi(list)
  }

  /**
   * Selects all shapes in the board
   *
   * @example
   * ```ts
   * editor.board.selection.selectAll()
   * ```
   */
  public selectAll() {
    this.multi(this.board.activeShapes)
  }

  /**
   * Deselects all shapes in the board
   *
   * @example
   * ```ts
   * editor.board.selection.deselectAll()
   * ```
   */
  public deselectAll() {
    this.multi([])
  }

  /**
   * Reselects all selected shapes
   *
   * @example
   * ```ts
   * editor.board.selection.reselectAll()
   * ```
   */
  public reselect() {
    const list = this.list

    this.deselectAll()
    this.multi(list)
  }

  /**
   * Selects one or multiple shapes
   *
   * @param shapes The array of [[ShapeModel]]
   */
  public multi(shapes: ShapeModel[]) {
    this.list = shapes

    const settings = {
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
      ],
      ...this.board.settings.transformer,
      ...this.board.settings.selection?.transformer
    } as Konva.TransformerConfig

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
      settings
    )

    this.transformer.setAttrs(attrs).nodes(shapes.map(shape => shape.node))
    this.dimensionsTag?.measure(this.transformer, this.getTransformerRect())

    this.transformer.show()
    this.transformer.moveToTop()

    if (shapes.length === 0) {
      this.transformer.hide()
      this.dimensionsTag?.hide()
    }

    this.board.events.emit('selection:change', {
      shapes
    })
  }

  /**
   * Adds a [[ShapeModel | shape ]] to the selections list
   *
   * @param shape The [[ShapeModel]]
   */
  public add(shape: ShapeModel) {
    const isSelected = this.list.some(item => item.node === shape.node)

    if (isSelected) {
      return
    }

    this.multi([...this.list, shape])
  }

  /**
   * Toggles a [[ShapeModel | shape]]
   *
   * @param shape The [[ShapeModel]]
   */
  public toggle(shape: ShapeModel) {
    const isSelected = this.list.some(item => item.node === shape.node)

    if (isSelected) {
      this.deselect(shape)
      return
    }

    this.multi([...this.list, shape])
  }

  /**
   * Deselects a shape
   *
   * @param shape The [[ShapeModel]]
   */
  public deselect(shape: ShapeModel) {
    this.list = this.list.filter(item => item !== shape)

    this.multi(this.list)
  }

  /**
   * Deletes all selected shapes
   */
  public delete() {
    if (this.list.length === 0) {
      return
    }

    const shapes = this.list

    this.list = []

    this.board.stage.getContent().style.cursor = 'inherit'
    this.transformer.nodes([])

    this.board.history.create(this.board.layer, [], {
      undo: () => shapes.forEach(shape => shape.undelete()),
      redo: () => shapes.forEach(shape => shape.delete())
    })

    shapes.forEach(shape => shape.delete())

    this.board.events.emit('selection:delete', {
      shapes
    })
  }

  /**
   * Moves the selected shape horizontally
   *
   * @param value The value number
   */
  public async moveX(value: number) {
    return new Promise(resolve => {
      this.board.history.create(
        this.board.layer,
        this.transformer.nodes() as Konva.Shape[]
      )

      this.list.forEach(shape => {
        shape.node.to({
          x: shape.node.x() + value,
          onFinish: resolve
        })
      })

      this.board.events.emit('selection:move', {
        shapes: this.list,
        data: {
          axis: 'x',
          value
        }
      })
    })
  }

  /**
   * Moves the selected shape vertically
   *
   * @param value The value number
   */
  public async moveY(value: number) {
    return new Promise(resolve => {
      this.board.history.create(
        this.board.layer,
        this.transformer.nodes() as Konva.Shape[]
      )

      this.list.forEach(shape => {
        shape.node.to({
          y: shape.node.y() + value,
          onFinish: resolve
        })
      })

      this.board.events.emit('selection:move', {
        shapes: this.list,
        data: {
          axis: 'y',
          value
        }
      })
    })
  }

  /**
   * Adds filter or filters to the selected shapes
   *
   * @param filters The [[Filters]]
   */
  public addFilter(filters: Filters | Filters[]) {
    this.filter.apply(this.list, filters)
    this.reselect()
  }

  /**
   * Removes a filter or list of filters from the selected shapes
   *
   * @param filters The filter names
   */
  public removeFilter(filters: FilterFunctions | FilterFunctions[]) {
    this.filter.remove(this.list, filters)
    this.reselect()
  }

  /**
   * Creates a group of the selected shapes
   *
   * @param groupName The group name
   */
  public group(groupName: string) {
    this.board.groups.attach(this.list, groupName)
  }

  /**
   * Creates the rectangle zone instance
   */
  private createZone() {
    this.zone = new Konva.Rect({
      visible: false,
      ...this.board.settings.selection?.zone
    })

    this.board.layer.add(this.zone)
  }

  /**
   * Create the transformer and register its event listeners
   */
  private createTransformer() {
    this.transformer = new Konva.Transformer()

    /**
     * registers DragStart event
     * Triggers when the client starts dragging the transformer
     */
    this.transformer.on('dragstart', () => {
      this.transformer.hide()
      this.dimensionsTag?.hide()

      this.board.history.create(
        this.board.layer,
        this.list.map(shape => shape.node)
      )

      this.board.events.emit('selection:dragstart', {
        shapes: this.list
      })
    })

    /**
     * registers DragMove event
     * Triggers when the client dragging the transformer
     */
    this.transformer.on('dragmove', () => {
      this.board.events.emit('selection:dragmove', {
        shapes: this.list
      })
    })

    /**
     * registers DragEnd event
     * Triggers when dragging finishes
     */
    this.transformer.on('dragend', () => {
      this.transformer.show()
      this.dimensionsTag?.measure(this.transformer, this.getTransformerRect())

      this.board.events.emit('selection:dragend', {
        shapes: this.list
      })
    })

    /**
     * registers TransformStart event
     * Triggers when the client starts transforming the transformer
     */
    this.transformer.on('transformstart', () => {
      this.board.history.create(
        this.board.layer,
        this.list.map(shape => shape.node),
        {
          execute: () => this.board.selection.transformer.forceUpdate()
        }
      )

      this.board.events.emit('selection:transformstart', {
        shapes: this.list
      })
    })

    /**
     * registers Transform event
     * Triggers when the client transforming the transformer
     */
    this.transformer.on('transform', () => {
      this.dimensionsTag?.measure(this.transformer, this.getTransformerRect())

      this.board.events.emit('selection:transform', {
        shapes: this.list
      })
    })

    /**
     * registers TransformEnd event
     * Triggers when transforming finishes
     */
    this.transformer.on('transformend', () => {
      this.board.events.emit('selection:transformend', {
        shapes: this.list
      })
    })

    this.board.layer.add(this.transformer)
  }

  /**
   * Starts creating the selection zone rectangle
   *
   * @param e The trigger event
   */
  private onDragZoneStart(e: Konva.KonvaEventObject<MouseEvent>) {
    if (
      this.board.settings.selection?.interactive === false ||
      this.isDisabled
    ) {
      return
    }

    const shape = this.board.activeShapes.find(
      shape => shape.node === this.getParentNode(e.target)
    )

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
  }

  /**
   * Continues creating the selection zone
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
  }

  /**
   * Finalizes creating the selection zone
   */
  private onDragZoneEnd() {
    if (!this.zone.visible()) {
      return
    }

    setTimeout(() => {
      this.zone.visible(false)
    }, 10)

    const box = this.zone.getClientRect()

    const shapes = this.board.activeShapes.filter(shape =>
      Konva.Util.haveIntersection(box, shape.node.getClientRect())
    )

    this.multi(shapes)
  }

  /**
   * Triggers on mouse up to finalize creating the zone
   *
   * @param e The mouse event
   *
   * @see [[Selection.onDragZoneEnd]]
   *
   */
  private onWindowMouseUp(e: MouseEvent) {
    if (e.target instanceof HTMLCanvasElement) {
      return
    }

    this.onDragZoneEnd()
  }

  /**
   * Handles keyboard events
   *
   * @param e The keyboard event
   */
  private onKeyDown(
    e: Event & {
      key: string
    }
  ) {
    const keyboard = this.board.settings.selection?.keyboard

    if (keyboard?.enabled === false) {
      return
    }

    const nodes = this.transformer.nodes()
    const movingSpaces = keyboard?.movingSpaces ?? 5

    if (this.transformer.getAttr('visible') === false || nodes.length === 0) {
      return
    }

    if (keyboard?.map?.delete?.includes(e.key)) {
      this.delete()
    }

    if (keyboard?.map?.moveLeft?.includes(e.key)) {
      this.moveX(-movingSpaces)
    }

    if (keyboard?.map?.moveRight?.includes(e.key)) {
      this.moveX(movingSpaces)
    }

    if (keyboard?.map?.moveUp?.includes(e.key)) {
      this.moveY(-movingSpaces)
    }

    if (keyboard?.map?.moveDown?.includes(e.key)) {
      this.moveY(movingSpaces)
    }

    if (keyboard?.map?.deselect?.includes(e.key)) {
      this.deselectAll()
    }
  }

  /**
   * Finds parent node of the give node
   *
   * @returns The parent node
   * @param node The node
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
   * Checks wheather the node is a background node or not
   *
   * @param node The node
   */
  private isBackgroundNode(node: Konva.Stage | Konva.Group | Konva.Shape) {
    return (
      node === this.board.stage || node === this.board.background.overlay.node
    )
  }

  /**
   * Returns Position and Dimensions of the transformer
   *
   * @returns x, y, width and height of the transformer
   */
  private getTransformerRect(): Point & Dimensions {
    return {
      x: this.transformer.x(),
      y: this.transformer.y(),
      width: this.transformer.width(),
      height: this.transformer.height()
    }
  }
}
