export function createElement(): HTMLDivElement {
  const element = document.createElement('div')
  element.style.width = '1280px'
  element.style.height = '720px'

  return element
}
