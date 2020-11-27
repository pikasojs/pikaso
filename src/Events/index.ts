import type { EventListenerCallbackEvent, EventListenerNames } from '../types'

type ListenerCallback = (args: EventListenerCallbackEvent) => void

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
  public emit(
    eventName: EventListenerNames,
    data?: EventListenerCallbackEvent
  ) {
    if (!this.listeners[eventName] && !this.listeners['*']) {
      return
    }

    const events = ['*', eventName]

    events.forEach(name => {
      this.listeners[name]?.forEach(fn => {
        fn({
          name: eventName,
          ...data
        })
      })
    })
  }
}
