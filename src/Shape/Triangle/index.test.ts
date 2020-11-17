import { createInstance } from '../../../tests/create-instance'

describe('Shapes::Triangle', () => {
  test('It should insert a triangle', () => {
    const editor = createInstance()

    const config = {
      name: 'triangle-insert',
      x: 200,
      y: 200,
      radius: 150,
      fill: 'red'
    }
    editor.shapes.triangle.insert(config)

    const shapes = editor.board.stage.find(`.${config.name}`)

    expect(shapes.length).toBe(1)
    expect(shapes[0].attrs).toEqual({
      ...config,
      draggable: true,
      sides: 3 // because it's triangle
    })
  })
})
