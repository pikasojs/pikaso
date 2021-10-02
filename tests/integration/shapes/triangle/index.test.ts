import { createEditor } from '../../../../jest/utils/create-editor'

describe('Shape -> Label', () => {
  const config = {
    x: 100,
    y: 100,
    radius: 40
  }

  it('should create a triangle', () => {
    const editor = createEditor()

    editor.shapes.triangle.insert(config)

    expect(editor.board.activeShapes.length).toBe(1)
    expect(editor.board.activeShapes[0].type).toBe('triangle')
  })
})
