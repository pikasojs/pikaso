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
  public on(eventName: string, callback: ListenerCallback) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = []
    }

    this.listeners[eventName].push(callback)
  }

  /**
   *
   * @param eventName
   * @param callback
   */
  public off(eventName: string, callback: ListenerCallback) {
    if (!this.listeners[eventName]) {
      return
    }

    const index = this.listeners[eventName].indexOf(callback)

    if (index > -1) {
      this.listeners[name].splice(index, 1)
    }
  }

  /**
   *
   * @param eventName
   * @param data
   */
  public emit(eventName: string, data: object) {
    if (!this.listeners[eventName]) {
      return
    }

    this.listeners[eventName].forEach(fn => fn(data))
  }
}
