import type { UnknownObject } from '../../types'

export function omit(state: UnknownObject, keys: string[]) {
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
