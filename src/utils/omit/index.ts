import type { UnknownObject } from '../../types'

export function omit(state: object, keys: string[]): UnknownObject {
  return Object.entries(state).reduce((acc, [key, value]) => {
    if (keys.includes(key)) {
      return acc
    }

    return {
      ...acc,
      [key]: value
    }
  }, {})
}
