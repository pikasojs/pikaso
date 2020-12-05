import Konva from 'konva'

import { Events } from '../Events'

import { History } from './index'

describe('History', () => {
  it('should create a new record when given state is not array', () => {
    const { history, layer, node } = createState()

    history.create(layer, node)

    expect(history.getList().length).toBe(1)
  })

  it('should create a new record when given state is array', () => {
    const { history, layer, node } = createState()

    history.create(layer, [node])

    expect(history.getList().length).toBe(1)
  })

  it('should undo the state', () => {
    const { history, layer, node } = createState()

    history.create(layer, node)

    expect(history.getList().length).toBe(1)
    expect(history.getStep()).toBe(0)

    history.undo()

    expect(history.getList().length).toBe(1)
    expect(history.getStep()).toBe(-1)
    expect(history.getState()).toBe(undefined)
  })

  it('should not undo the state', () => {
    const { history } = createState()

    history.undo()

    expect(history.getList().length).toBe(0)
    expect(history.getStep()).toBe(-1)
    expect(history.getState()).toBe(undefined)
  })

  it('should redo the state', () => {
    const { history, layer, node } = createState()

    history.create(layer, node)

    expect(history.getList().length).toBe(1)
    expect(history.getStep()).toBe(0)

    history.undo()

    expect(history.getList().length).toBe(1)
    expect(history.getStep()).toBe(-1)
    expect(history.getState()).toBe(undefined)

    history.redo()

    expect(history.getList().length).toBe(1)
    expect(history.getStep()).toBe(0)
    expect(history.getState()).not.toBe(undefined)
  })

  it('should not redo the state', () => {
    const { history } = createState()

    history.redo()

    expect(history.getList().length).toBe(0)
    expect(history.getStep()).toBe(-1)
    expect(history.getState()).toBe(undefined)
  })
})

function createState() {
  const shapeConfig = {
    x: 0,
    y: 0,
    width: 100,
    height: 100
  }

  const history = new History(new Events())
  const layer = new Konva.Layer()
  const node = new Konva.Rect(shapeConfig)

  return { history, layer, node }
}
