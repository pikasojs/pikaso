import Pikaso from '../../src'

export function createInstance() {
  const element = document.createElement('div')
  element.style.width = '1280px'
  element.style.height = '720px'

  return new Pikaso({
    container: element,
    width: element.clientWidth,
    height: element.clientHeight
  })
}
