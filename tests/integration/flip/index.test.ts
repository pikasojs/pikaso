import { createEditor } from '../../../jest/utils/create-editor'

describe('Flip', () => {
  const shapeConfig = {
    x: 10,
    y: 10,
    width: 100,
    height: 50
  }

  it('should flip horizontally', async () => {
    const editor = createEditor()

    const width = 1200
    await editor.loadFromUrl(`${width}x800`)
    const rect = editor.shapes.rect.insert(shapeConfig)

    editor.flip.horizontal()

    expect(rect.node.x()).toBe(110)
    expect(rect.node.scaleX()).toBe(-1)

    expect(editor.board.background.image.node.x()).toBe(width)
    expect(editor.board.background.image.node.scaleX()).toBe(-1)
  })

  it('should toggle flipping horizontally', async () => {
    const editor = createEditor()

    await editor.loadFromUrl('1200x800')

    const rect = editor.shapes.rect.insert(shapeConfig)

    editor.flip.horizontal()
    editor.flip.horizontal()

    expect(rect.node.x()).toBe(shapeConfig.x)
    expect(rect.node.scaleX()).toBe(1)

    expect(editor.board.background.image.node.x()).toBe(0)
    expect(editor.board.background.image.node.scaleX()).toBe(1)
  })

  it('should flip horizontally', async () => {
    const editor = createEditor()

    const height = 800
    await editor.loadFromUrl(`1200x${height}`)
    const rect = editor.shapes.rect.insert(shapeConfig)

    editor.flip.vertical()

    expect(rect.node.y()).toBe(60)
    expect(rect.node.scaleY()).toBe(-1)

    expect(editor.board.background.image.node.y()).toBe(height)
    expect(editor.board.background.image.node.scaleY()).toBe(-1)
  })

  it('should toggle flipping vertically', async () => {
    const editor = createEditor()

    await editor.loadFromUrl('1200x800')

    const rect = editor.shapes.rect.insert(shapeConfig)

    editor.flip.vertical()
    editor.flip.vertical()

    expect(rect.node.y()).toBe(shapeConfig.y)
    expect(rect.node.scaleY()).toBe(1)

    expect(editor.board.background.image.node.y()).toBe(0)
    expect(editor.board.background.image.node.scaleY()).toBe(1)
  })
})
