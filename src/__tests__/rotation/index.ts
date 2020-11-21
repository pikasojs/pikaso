import { createEditor } from '../../../jest/utils/create-editor'

describe('Rotation', () => {
  test('it should rotate the landscape background', async () => {
    const editor = createEditor()

    await editor.loadFromUrl('1200x800')

    editor.rotation.transform(30)

    const node = editor.board.backgroundImage
    expect(node.rotation()).toBe(30)
    expect(round(node.scaleX())).toBe(0.62)
    expect(round(node.scaleY())).toBe(0.62)
    expect(round(node.x())).toBe(247.52)
    expect(node.y()).toBe(0)

    expect(editor.board.backgroundOverlay.rotation()).toBe(30)
  })

  test('it should rotate the portrait background', async () => {
    const editor = createEditor()

    await editor.loadFromUrl('800x1200')

    editor.rotation.transform(45)

    const node = editor.board.backgroundImage

    expect(node.rotation()).toBe(45)
    expect(round(node.scaleX())).toBe(0.85)
    expect(round(node.scaleY())).toBe(0.85)
    expect(node.x()).toBe(720)
    expect(node.y()).toBe(0)

    expect(editor.board.backgroundOverlay.rotation()).toBe(45)
  })

  test('it should rotate the square background', async () => {
    const editor = createEditor()

    await editor.loadFromUrl('800x800')

    editor.rotation.transform(15)

    const node = editor.board.backgroundImage

    expect(node.rotation()).toBe(15)
    expect(round(node.scaleX())).toBe(0.82)
    expect(round(node.scaleY())).toBe(0.82)
    expect(round(node.x())).toBe(169.06)
    expect(round(node.y())).toBe(-0)

    expect(editor.board.backgroundOverlay.rotation()).toBe(15)
  })

  test('it should rotate created shape', () => {
    const editor = createEditor()

    const { node } = editor.shapes.rect.insert({
      x: 100,
      y: 100,
      width: 100,
      height: 50
    })

    editor.rotation.transform(15)

    expect(round(node.scaleX())).toBe(0.7)
    expect(round(node.scaleY())).toBe(0.7)
    expect(round(node.x())).toBe(180.26)
    expect(round(node.y())).toBe(85.88)

    editor.board.shapes.forEach(shape => {
      expect(shape.node.rotation()).toBe(15)
    })
  })

  test('it should spin backaground and shapes in the board', async () => {
    const editor = createEditor()

    await editor.loadFromUrl('800x800')

    editor.shapes.rect.insert({
      x: 100,
      y: 100,
      width: 100,
      height: 50
    })

    editor.shapes.triangle.insert({
      x: 150,
      y: 150,
      radius: 20
    })

    editor.rotation.straighten(10)

    expect(editor.board.backgroundImage.rotation()).toBe(10)

    editor.board.shapes.forEach(shape => {
      expect(shape.node.rotation()).toBe(10)
    })
  })
})

const round = (value: number) => Number(value.toFixed(2))
