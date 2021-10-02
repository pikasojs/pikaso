import { createEditor } from '../../../jest/utils/create-editor'

describe('Rotation', () => {
  const shapeConfig = {
    x: 100,
    y: 100,
    width: 100,
    height: 50
  }

  it('should not rotate the stage after transformation', () => {
    const editor = createEditor()

    editor.rotation.transform(30)

    expect(editor.board.stage.rotation()).toBe(0)
  })

  it('should rotate and transform the board with its shapes', async () => {
    const editor = createEditor()

    await editor.loadFromUrl('1200x720')
    editor.shapes.rect.insert(shapeConfig)

    editor.rotation.transform(30)

    editor.board.activeShapes.forEach(shape => {
      expect(shape.node.rotation()).toBe(30)
      expect(shape.node.x()).not.toBe(shapeConfig.x)
      expect(shape.node.y()).not.toBe(shapeConfig.y)
      expect(shape.node.width()).toBe(shapeConfig.width)
      expect(shape.node.height()).toBe(shapeConfig.height)
      expect(shape.node.scaleX()).not.toBe(1)
      expect(shape.node.scaleY()).not.toBe(1)
    })
  })

  it('should spin the board with its shapes', async () => {
    const editor = createEditor()

    await editor.loadFromUrl('1200x720')
    editor.shapes.rect.insert(shapeConfig)

    editor.rotation.straighten(30)

    editor.board.activeShapes.forEach(shape => {
      expect(shape.node.rotation()).toBe(30)
      expect(shape.node.x()).not.toBe(shapeConfig.x)
      expect(shape.node.y()).not.toBe(shapeConfig.y)
      expect(shape.node.width()).toBe(shapeConfig.width)
      expect(shape.node.height()).toBe(shapeConfig.height)
    })
  })
})
