export function isBrowser() {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined'
}

export function isNode() {
  return (
    !isBrowser() &&
    typeof process !== 'undefined' &&
    Boolean(process.versions?.node)
  )
}
