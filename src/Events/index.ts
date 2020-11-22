import type { EventListenerNames } from '../types'

type ListenerCallback = (...args: any) => void

interface EventListeners {
  [key: string]: ListenerCallback[]
}

export class Events {
  /**
   *
   */
  private listeners: EventListeners = {}

  /**
   *
   * @param eventName
   * @param callback
   */
  public on(
    eventName: EventListenerNames | EventListenerNames[],
    callback: ListenerCallback
  ) {
    const list = Array.isArray(eventName) ? eventName : [eventName]

    list.forEach(name => {
      if (!this.listeners[name]) {
        this.listeners[name] = []
      }

      this.listeners[name].push(callback)
    })
  }

  /**
   *
   * @param eventName
   * @param callback
   */
  public off(
    eventName: EventListenerNames | EventListenerNames[],
    callback: ListenerCallback
  ) {
    const list = Array.isArray(eventName) ? eventName : [eventName]

    list.forEach(name => {
      if (!this.listeners[name]) {
        return
      }

      const index = this.listeners[name].indexOf(callback)
      if (index > -1) {
        this.listeners[name].splice(index, 1)
      }
    })
  }

  /**
   *
   * @param eventName
   * @param data
   */
  public emit(eventName: EventListenerNames, data?: object) {
    if (!this.listeners[eventName]) {
      return
    }

    this.listeners[eventName].forEach(fn => fn(data))
  }
}
