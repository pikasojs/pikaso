import Konva from 'konva'

import { omit } from '../utils/omit'

import type { HistoryState, UnknownObject, HistoryHooks } from '../types'

export class History {
  /**
   *
   */
  private list: Array<{
    container: Konva.Stage | Konva.Layer
    states: HistoryState[]
    hooks?: HistoryHooks
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
    hooks?: HistoryHooks
  ) {
    this.step += 1

    const states = Array.isArray(state) ? state : [state]

    const normalizedStates = states.map(state => {
      return {
        ...state,
        current: omit(state.current, ['id'])
      }
    })

    this.list = [
      ...this.list.slice(0, this.step),
      {
        container,
        states: normalizedStates,
        hooks
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
      current: Object.assign({}, node.attrs)
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
    this.list[this.step].hooks?.undo?.(this.list[this.step].states)

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

    this.list[this.step].hooks?.redo?.(this.list[this.step].states)
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
    const { container, states, hooks } = this.list[this.step]

    states.forEach(({ node, current }, index) => {
      // update current attributes
      this.list[this.step].states[index].current = { ...node.attrs }

      // get attributes
      const attributes = omit(getAttrs({ node, current }) as UnknownObject, [
        'id'
      ])

      Object.entries(attributes).forEach(([key]) => {
        node.setAttr(key, current[key])
      })
    })

    // trigger callback function
    hooks?.execute?.(states)

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
