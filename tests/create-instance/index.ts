import Pikaso from '../../src'

export function createInstance() {
  document.body.style.margin = '0'
  document.body.style.padding = '0'

  const element = document.createElement('div')
  element.style.width = '1280px'
  element.style.height = '720px'

  return new Pikaso({
    container: element,
    width: element.clientWidth,
    height: element.clientHeight
  })
}
