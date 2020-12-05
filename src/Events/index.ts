import type {
  EventListenerCallbackEvent,
  EventListenerNames,
  ListenerCallback
} from '../types'

interface EventListeners {
  [key: string]: ListenerCallback[]
}

export class Events {
  /**
   * Represents the list of all event listeneres
   */
  private listeners: EventListeners = {}

  /**
   * Subscribes to one or multiple events
   *
   * @param name The event name or array of event names. it can be one of [[EventListenerNames]]
   * @param callback The callback [[EventListenerCallbackEvent]]
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
   * UnSubscribes from one or multiple events
   *
   * @param name The event name. it can be one of [[EventListenerNames]]
   * @param callback The callback [[EventListenerCallbackEvent]]
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
   * Emits an event to all subscribers of that event
   *
   * @param eventName The event Name [[EventListenerNames]]
   * @param data The event data [[EventListenerCallbackEvent]]
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
