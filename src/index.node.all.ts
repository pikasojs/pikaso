import { Konva } from './index.all'
import { isNode } from './utils/detect-environment'

if (isNode()) {
  const canvas = require('canvas')

  global.DOMMatrix = canvas.DOMMatrix

  Konva.Util.createCanvasElement = () => {
    const node = new canvas.Canvas()
    node.style = {}

    return node
  }

  Konva.Util.createImageElement = () => {
    const node = new canvas.Image()

    return node
  }
}

export * from './index.all'
