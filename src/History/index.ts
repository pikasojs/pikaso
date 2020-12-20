import Konva from 'konva'

import { omit } from '../utils/omit'

import type { Events } from '../Events'

import type {
  HistoryNode,
  HistoryHooks,
  HistoryState,
  UnknownObject,
  Settings
} from '../types'

export class History {
  /**
   * Represents the list of history states
   */
  private list: Array<{
    container: Konva.Stage | Konva.Layer
    states: HistoryState[]
    hooks?: HistoryHooks
  }> = []

  /**
   * Represents the current step of the history
   */
  private step = -1

  /**
   * Represents the history settings
   */
  private settings: Partial<Settings>

  /**
   * Represents the [[Events]]
   */
  private events: Events

  constructor(settings: Partial<Settings>, events: Events) {
    this.settings = settings
    this.events = events

    window.addEventListener('keydown', this.onKeyDown.bind(this))
  }

  /**
   * Returns the current step
   */
  public getStep() {
    return this.step
  }

  /**
   * Returns the list of states
   */
  public getList() {
    return this.list
  }

  /**
   * Returns state of current step
   */
  public getState() {
    return this.list[this.step]
  }

  /**
   * Creates a new state action
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
        states: nodes.map(node => this.getNodeState(node)),
        hooks
      }
    ]
  }

  /**
   * Reverses the last action
   */
  public undo() {
    if (this.step < 0) {
      return
    }

    this.applyAttributes((node, _) => this.getNodeAttributes(node))
    this.list[this.step].hooks?.undo?.(this.list[this.step].states)

    this.step -= 1

    this.events.emit('history:undo', this.getEventData())
  }

  /**
   * Reverses the last [[History.undo]]
   */
  public redo() {
    if (this.step === this.list.length - 1) {
      return
    }

    this.step += 1

    this.applyAttributes((_, snapshot) => snapshot)

    this.list[this.step].hooks?.redo?.(this.list[this.step].states)

    this.events.emit('history:redo', this.getEventData())
  }

  /**
   * Jumps to a specific state
   *
   * @param step The step number to jump in
   */
  public jump(to: number) {
    if (to < 0 || to > this.list.length - 1 || this.step === to) {
      return
    }

    while (to !== this.step) {
      to < this.step ? this.undo() : this.redo()
    }
  }

  /**
   * Calculates state of the given node
   *
   * @param node The [[ShapeModel | shape's]] node
   */
  private getNodeState(node: HistoryNode): HistoryState {
    const snapshpot = <HistoryNode>node.clone({})

    if (node.getType() === 'Group') {
      return {
        nodes: this.getNodesTree(node),
        snapshots: this.getNodesTree(snapshpot).map(node => node.attrs)
      }
    }

    return {
      nodes: [node],
      snapshots: [snapshpot.attrs]
    }
  }

  /**
   * Applies the given attributes to the state
   *
   * @param getAttributes
   */
  private applyAttributes(
    getAttributes: (node: HistoryNode, snapshot: UnknownObject) => UnknownObject
  ) {
    const { container, states, hooks } = this.list[this.step]

    states.forEach(({ nodes, snapshots }) => {
      nodes.forEach((node, index) => {
        const snapshot = snapshots[index]
        const attributes = getAttributes(node, snapshot)

        snapshots[index] = { ...this.getNodeAttributes(node) }

        Object.entries(attributes).forEach(([key]) => {
          node.setAttr(key, snapshot[key])
        })
      })
    })

    // trigger callback function
    hooks?.execute?.(states)

    container.batchDraw()
  }

  /**
   * Creates a tree from the node and its children
   *
   * @param node The shape's node
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
   * Normalizes the attributes of the given node
   *
   * @param node The shape's node
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
      ['id', 'container']
    )
  }

  /**
   * Returns the event data of current step
   */
  private getEventData() {
    return {
      data: {
        step: this.step,
        total: this.list.length,
        canUndo: this.step > -1,
        canReset: this.step > -1,
        canRedo: this.step > -1 && this.step < this.list.length - 1
      }
    }
  }

  /**
   * Handles global keyboard events
   *
   * @param e The keyboard event
   */
  private onKeyDown(
    e: Event & {
      key: string
      metaKey: boolean
      ctrlKey: boolean
      shiftKey: boolean
    }
  ) {
    if (this.settings?.history?.keyboard?.enabled === false) {
      return
    }

    const isSpecialKey = e.metaKey || e.ctrlKey
    const isShiftKey = e.shiftKey === true
    const key = e.key.toLowerCase()

    isSpecialKey && !isShiftKey && key === 'z' && this.undo()
    isSpecialKey && isShiftKey && key === 'z' && this.redo()
  }
}
