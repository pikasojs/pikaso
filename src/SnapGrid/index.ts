import Konva from 'konva'

import { Board } from '../Board'

import {
  GuideLine,
  LineStops,
  NodeEdgeBound,
  Orientation,
  Nullable
} from '../types'

export class SnapGrid {
  /**
   * Represents the [[Board]]
   */
  private board: Board

  /**
   * List of the created guide lines
   */
  private lines: Konva.Line[] = []

  /**
   * Snapping guide line threshold offset
   */
  private offset = 5

  /**
   * Options for snapping guide lines
   */
  private options?: Nullable<Konva.LineConfig> = {}

  /**
   * The active state of the snap grid
   */
  private active = false

  /**
   * Creates a new SnapGrid instance
   *
   * @example
   * ```ts
   * editor.snapGrid.setOffset(10)
   * ```
   *
   * @example
   * ```ts
   * editor.snapGrid.setOptions({
   *  stroke: '#fff',
   *  strokeWidth: 2
   * })
   * ```
   *
   * @example
   * ```ts
   * editor.snapGrid.disable()
   * ```
   *
   * @example
   * ```ts
   * editor.snapGrid.enable()
   * ```
   *
   * @param board The [[Board]]
   */
  constructor(board: Board) {
    const options = board.settings.snapToGrid

    this.board = board
    this.options = options
    this.active = options !== null

    if (this.active) {
      this.registerEvents()
    }
  }

  /**
   * Returns the active state of the snap grid
   */
  public get isActive() {
    return this.active
  }

  /**
   * Updates configs of guide line
   *
   * @example
   * ```ts
   * editor.snapGrid.setOptions({
   *  stroke: '#262626',
   *  strokeWidth: 2
   * })
   * ```
   * @param options the line config
   */
  public setOptions(options: Konva.LineConfig) {
    this.options = options
  }

  /**
   * Sets offset to the given value
   *
   * @example
   * ```ts
   * editor.snapGrid.setOffset(5)
   * ```
   * @param offset the offset value
   */
  public setOffset(offset: number) {
    this.offset = offset
  }

  /**
   * Enables snap grid
   */
  public enable() {
    if (this.active) {
      return
    }

    this.active = true
    this.registerEvents()
  }

  /**
   * Disables snap grid
   */
  public disable() {
    if (this.active === false) {
      return
    }

    this.active = false
    this.unregisterEvents()
  }

  /**
   * Creates list of line stops to find guide lines
   *
   * @param node the dragging node
   * @returns the list of line stops
   */
  private getLineStops(node: Konva.Shape): LineStops {
    let list = {
      vertical: [0, this.board.stage.width() / 2, this.board.stage.width()],
      horizontal: [0, this.board.stage.height() / 2, this.board.stage.height()]
    }

    this.board.activeShapes.forEach(shape => {
      if (shape.node === node || shape.hasGroup()) {
        return
      }

      const box = shape.node.getClientRect()

      list = {
        vertical: [
          ...list.vertical,
          ...[box.x, box.x + box.width, box.x + box.width / 2]
        ],
        horizontal: [
          ...list.horizontal,
          ...[box.y, box.y + box.height, box.y + box.height / 2]
        ]
      }
    })

    return list
  }

  /**
   * Creates the edge bounds list for a given dragging node
   *
   * @param node the dragging node
   * @returns the list of edge bounds
   */
  private getNodeEdgeBounds(node: Konva.Shape): NodeEdgeBound[] {
    const box = node.getClientRect()
    const pos = node.absolutePosition()

    return [
      {
        guide: Math.round(box.x),
        offset: Math.round(pos.x - box.x),
        snap: 'start',
        orientation: 'vertical'
      },
      {
        guide: Math.round(box.x + box.width / 2),
        offset: Math.round(pos.x - box.x - box.width / 2),
        snap: 'center',
        orientation: 'vertical'
      },
      {
        guide: Math.round(box.x + box.width),
        offset: Math.round(pos.x - box.x - box.width),
        snap: 'end',
        orientation: 'vertical'
      },
      {
        guide: Math.round(box.y),
        offset: Math.round(pos.y - box.y),
        snap: 'start',
        orientation: 'horizontal'
      },
      {
        guide: Math.round(box.y + box.height / 2),
        offset: Math.round(pos.y - box.y - box.height / 2),
        snap: 'center',
        orientation: 'horizontal'
      },
      {
        guide: Math.round(box.y + box.height),
        offset: Math.round(pos.y - box.y - box.height),
        snap: 'end',
        orientation: 'horizontal'
      }
    ]
  }

  /**
   * Creates the guide lines based on the given line stops and edge bounds
   *
   * @param lineStops the line stops
   * @param nodeEdgeBounds the node edge bounds
   * @returns the list of guide lines
   */
  private getGuideLines(
    lineStops: LineStops,
    nodeEdgeBounds: NodeEdgeBound[]
  ): GuideLine[] {
    const list: GuideLine[] = []

    nodeEdgeBounds.forEach(nodeEdgeBound => {
      Object.entries(lineStops).forEach(([orientation, stops]) => {
        if (orientation !== nodeEdgeBound.orientation) {
          return
        }

        stops.forEach(stop => {
          const diff = Math.abs(stop - nodeEdgeBound.guide)

          if (diff >= this.offset) {
            return
          }

          list.push({
            diff,
            stop,
            snap: nodeEdgeBound.snap,
            offset: nodeEdgeBound.offset,
            orientation: nodeEdgeBound.orientation
          })
        })
      })
    })

    const getMinByOrientation = (orientation: Orientation) =>
      list
        .filter(line => line.orientation === orientation)
        .sort((a, b) => a.diff - b.diff)[0]

    return [
      getMinByOrientation('vertical'),
      getMinByOrientation('horizontal')
    ].filter(item => !!item)
  }

  /**
   * Draws the guide lines
   *
   * @param guideLines the list of guide lines
   */
  private draw(guideLines: GuideLine[]) {
    if (!guideLines.length) {
      return
    }

    guideLines.forEach(guideLine => {
      const options: Konva.LineConfig = {
        stroke: '#000',
        strokeWidth: 1,
        dash: [2, 6],
        ...this.options
      }

      if (guideLine.orientation === 'vertical') {
        options.points = [0, 0, 0, this.board.stage.height()]
      } else if (guideLine.orientation === 'horizontal') {
        options.points = [0, 0, this.board.stage.width(), 0]
      }

      const line = new Konva.Line(options)

      if (guideLine.orientation === 'vertical') {
        line.absolutePosition({
          x: guideLine.stop,
          y: 0
        })
      } else if (guideLine.orientation === 'horizontal') {
        line.absolutePosition({
          x: 0,
          y: guideLine.stop
        })
      }

      this.board.layer.add(line)
      this.lines.push(line)
    })
  }

  /**
   * Sets the node's absolute position to the nearest snap line
   *
   * @param node The node of dragging shape
   * @param guideLines The list of guide lines
   */
  private setNodePosition(node: Konva.Shape, guideLines: GuideLine[]) {
    guideLines.forEach(({ orientation, stop: stop, offset }) => {
      const position = node.absolutePosition()

      if (orientation === 'vertical') {
        position.x = stop + offset
      } else if (orientation === 'horizontal') {
        position.y = stop + offset
      }

      node.absolutePosition(position)
    })
  }

  /**
   * Triggers when a node is dragged on the board
   *
   * @param event the KonvaEventObject
   * @returns
   */
  private onDragMove(event: Konva.KonvaEventObject<Konva.Shape>) {
    const node = event.target as Konva.Shape

    // Check if the node target is an active shape
    if (!this.board.activeShapes.find(shape => shape.node === node)) {
      return
    }

    this.destroy()

    const guideLines = this.getGuideLines(
      this.getLineStops(node),
      this.getNodeEdgeBounds(node)
    )

    this.draw(guideLines)
    this.setNodePosition(node, guideLines)
  }

  /**
   * Triggers when dragging finishes
   */
  private onDragEnd() {
    this.destroy()
  }

  /**
   * Removes all snap lines
   */
  private destroy() {
    if (this.lines.length > 0) {
      this.lines.forEach(line => line.destroy())
      this.lines = []
    }
  }

  /**
   * Registers dragging events required for snapping to grid
   */
  private registerEvents() {
    this.board.layer.on('dragmove', this.onDragMove.bind(this))
    this.board.layer.on('dragend', this.onDragEnd.bind(this))
  }

  /**
   * Removes the dragging events from the event register
   */
  private unregisterEvents() {
    this.board.layer.removeEventListener('dragmove')
    this.board.layer.removeEventListener('dragend')
  }
}
