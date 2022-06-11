/**
 * @jest-environment node
 */

import Pikaso from '../../../src'

describe('NodeJs Environment', () => {
  it('should spin the board with its shapes', async () => {
    const editor = new Pikaso({
      width: 800,
      height: 800
    })

    editor.shapes.circle.insert({
      x: 100,
      y: 100,
      radius: 100,
      fill: 'red'
    })

    const json = editor.export.toJson()

    expect(json.shapes.length).toBe(1)
  })
})
