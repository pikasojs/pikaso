import Pikaso from '../../../src'

export function createShapes(editor: Pikaso, count = 2) {
  return new Array(count).fill(null).map(() =>
    editor.shapes.circle.insert({
      x: random(100, 1000),
      y: random(100, 700),
      radius: random(20, 30),
      fill: 'red'
    })
  )
}

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min)
}
