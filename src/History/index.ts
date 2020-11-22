import Konva from 'konva'

import { omit } from '../utils/omit'

import type { HistoryState, UnknownObject } from '../types'

export class History {
  /**
   *
   */
  private list: Array<{
    container: Konva.Stage | Konva.Layer
    states: HistoryState[]
    callback: (states: HistoryState[]) => void
  }> = []

  /**
   *
   */
  private step = -1

  /**
   *
   */
  public getStep() {
    return this.step
  }

  /**
   *
   */
  public getList() {
    return this.list
  }

  /**
   *
   */
  public getState() {
    return this.list[this.step]
  }

  /**
   *
   * @param stage
   */
  public create(
    container: Konva.Stage | Konva.Layer,
    state: HistoryState | HistoryState[],
    callback?: (states: HistoryState[] | undefined) => void
  ) {
    this.step += 1

    const states = Array.isArray(state) ? state : [state]

    const normalizedStates = states.map(state => {
      return {
        ...state,
        current: state.current ? omit(state.current, ['id']) : null
      }
    })

    this.list = [
      ...this.list.slice(0, this.step),
      {
        container,
        states: normalizedStates,
        callback: callback || (() => {})
      }
    ]
  }

  /**
   *
   * @param node
   */
  public getNodeState(node: HistoryState['node']): HistoryState {
    return {
      node,
      current: { ...node.attrs }
    }
  }

  /**
   *
   */
  public undo() {
    if (this.step < 0) {
      return
    }

    this.applyAttributes(state => state.node.attrs)
    this.step -= 1
  }

  /**
   *
   */
  public redo() {
    if (this.step === this.list.length - 1) {
      return
    }

    this.step += 1
    this.applyAttributes(state => state.current)
  }

  /**
   *
   */
  public reset() {}

  /**
   *
   * @param getAttrs
   */
  private applyAttributes(
    getAttrs: (state: HistoryState) => HistoryState['current']
  ) {
    const { container, states, callback } = this.list[this.step]

    states.forEach(({ node, current }, index) => {
      if (current) {
        // update current attributes
        this.list[this.step].states[index].current = { ...node.attrs }

        // get attributes
        const attributes = omit(getAttrs({ node, current }) as UnknownObject, [
          'id'
        ])

        Object.entries(attributes).forEach(([key]) => {
          node.setAttr(key, current[key])
        })
      }

      if (!current && this.isLayer(container) && this.isShape(node)) {
        const layer = <Konva.Layer>container
        const shape = <Konva.Group | Konva.Shape>node

        const hasNode = layer.children.toArray().includes(shape)

        if (hasNode) {
          node.remove()
        } else {
          layer.add(shape)
        }
      }
    })

    // trigger callback function
    callback(states)

    // redraw
    container.batchDraw()
  }

  /**
   *
   * @param node
   */
  private isShape(node: HistoryState['node']) {
    return ['Group', 'Shape'].includes(node.getType())
  }

  /**
   *
   * @param node
   */
  private isLayer(container: Konva.Stage | Konva.Layer) {
    return container.getType() === 'Layer'
  }
}
