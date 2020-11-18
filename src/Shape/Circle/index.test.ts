import { createInstance } from '../../../jest/create-instance'

describe('Shapes::Circle', () => {
  test('It should insert a circle', () => {
    const editor = createInstance()

    const config = {
      name: 'circle',
      x: 200,
      y: 200,
      radius: 150
    }
    editor.shapes.circle.insert(config)

    const shapes = editor.board.stage.find(`.${config.name}`)

    expect(shapes.length).toBe(1)
    expect(shapes[0].attrs).toEqual({
      ...config,
      draggable: true
    })
  })
})
