import Konva from 'konva'

import { rotateAroundCenter } from '.'

describe('Utils -> rotateAroundCenter', () => {
  it('should rotate a node around its center', () => {
    const node = new Konva.Rect({
      x: 100,
      y: 100,
      width: 200,
      height: 100
    })

    rotateAroundCenter(node, 45)

    expect(node.rotation()).toBe(45)
    expect(node.x()).toBe(164.64466094067262)
    expect(node.y()).toBe(43.93398282201787)
  })
})
