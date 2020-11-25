import Konva from 'konva'

import { omit } from '../utils/omit'

import type { HistoryNode, HistoryHooks, HistoryState } from '../types'

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
   */
  public create(
    container: Konva.Stage | Konva.Layer,
    node: HistoryNode | HistoryNode[],
    hooks?: HistoryHooks
  ) {
    const nodes = Array.isArray(node) ? node : [node]

    this.step += 1
    this.list = [
      ...this.list.slice(0, this.step),
      {
        container,
        states: nodes.map(node => this.getNodeSnapshot(node)),
        hooks
      }
    ]
  }

  /**
   *
   * @param node
   */
  public getNodeSnapshot(node: HistoryNode): HistoryState {
    const snapshot = <HistoryNode>node.clone({})

    if (node.getType() === 'Group') {
      return {
        nodes: this.getNodesTree(node),
        snapshots: this.getNodesTree(snapshot)
      }
    }

    return {
      nodes: [node],
      snapshots: [snapshot]
    }
  }

  /**
   *
   */
  public undo() {
    if (this.step < 0) {
      return
    }

    this.applyAttributes(state => state)
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

    this.applyAttributes((state: HistoryState) => ({
      nodes: state.snapshots,
      snapshots: state.nodes
    }))

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
  private applyAttributes(getState: (state: HistoryState) => HistoryState) {
    const { container, states, hooks } = this.list[this.step]

    states.forEach(state => {
      const { nodes, snapshots } = getState(state)

      nodes.forEach((node, index) => {
        const attributes = this.getNodeAttributes(node)

        Object.entries(attributes).forEach(([key, value]) => {
          node.setAttr(key, snapshots[index].getAttr(key))
          snapshots[index].setAttr(key, value)
        })
      })
    })

    // trigger callback function
    hooks?.execute?.(states)

    container.batchDraw()
  }

  /**
   *
   *
   */
  private getNodesTree(node: HistoryNode | HistoryNode[]): HistoryNode[] {
    if (node) {
      const list = Array.isArray(node) ? node : [node]
      return list.reduce(
        (acc, item) => [
          ...acc,
          item,
          ...this.getNodesTree(item.children.toArray())
        ],
        []
      )
    }

    return []
  }

  /**
   *
   * @param node
   */
  private getNodeAttributes(node: HistoryNode) {
    return omit(
      {
        x: node.x(),
        y: node.y(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY(),
        width: node.width(),
        height: node.height(),
        ...node.attrs
      },
      ['id', 'listening']
    )
  }
}
