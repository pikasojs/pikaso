export function omit(state: object, keys: string[]) {
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
