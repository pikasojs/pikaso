import { createEditor } from '../../../jest/utils/create-editor'

describe('Shapes::Circle', () => {
  test('it should insert a circle', () => {
    const editor = createEditor()

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
