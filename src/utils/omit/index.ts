import type { UnknownObject } from '../../types'

/**
 * @returns The object without the given keys
 * @param object The object
 * @param keys The array of the keys
 */
export function omit(object: object, keys: string[]): UnknownObject {
  return Object.entries(object).reduce((acc, [key, value]) => {
    if (keys.includes(key)) {
      return acc
    }

    return {
      ...acc,
      [key]: value
    }
  }, {})
}
