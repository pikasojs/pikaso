import { Events } from './index'

describe('Events', () => {
  const obj = {
    name: '',
    data: {}
  }

  const callback = jest.fn((data: object) => {
    expect(data).toMatchObject(obj)
  })

  it('should emit an event', () => {
    const event = new Events()

    event.on('shape:move', callback)
    event.emit('shape:move', obj)

    expect(callback).toBeCalledTimes(1)
  })

  it('should emit an event two times', () => {
    const event = new Events()

    event.on('shape:create', callback)
    event.emit('shape:create', obj)
    event.emit('shape:create', obj)

    expect(callback).toBeCalledTimes(2)
  })

  it('should work with a multi event callback', () => {
    const event = new Events()

    event.on(['shape:create', 'shape:move'], callback)

    event.emit('shape:create', obj)
    event.emit('shape:move', obj)

    expect(callback).toBeCalledTimes(2)
  })

  it('should unsubscribe from the events', () => {
    const event = new Events()

    event.on('shape:create', callback)

    event.emit('shape:create', obj)
    expect(callback).toBeCalledTimes(1)

    event.off('shape:create', callback)

    event.emit('shape:create', obj)
    expect(callback).toBeCalledTimes(1)
  })
})
