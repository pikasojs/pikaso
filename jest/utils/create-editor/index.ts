import Pikaso from '../../../src'
import { Settings } from '../../../src/types'

export function createEditor(options?: Partial<Settings>) {
  const width = 1280
  const height = 720

  document.body.style.margin = '0'
  document.body.style.padding = '0'

  const element = document.createElement('div')
  element.style.width = `${width}px`
  element.style.height = `${height}px`

  return new Pikaso({
    container: element,
    width,
    height,
    ...options
  })
}
