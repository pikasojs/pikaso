import { createEditor } from '../../../jest/utils/create-editor'

describe('Background', () => {
  it('should load background with "auto" size option', async () => {
    const editor = createEditor()

    await editor.loadFromUrl('400x300')

    expect(editor.board.background.image.node.attrs.width).toBe(400)
    expect(editor.board.background.image.node.attrs.height).toBe(300)
  })

  it('should load background with "stretch" size option', async () => {
    const editor = createEditor()

    await editor.loadFromUrl('400x300', {
      size: 'stretch'
    })

    expect(editor.board.background.image.node.attrs.width).toBe(
      editor.board.stage.width()
    )
    expect(editor.board.background.image.node.attrs.height).toBe(
      editor.board.stage.height()
    )
  })

  it('should load background with "cover" size option', async () => {
    const editor = createEditor()

    await editor.loadFromUrl('400x300', {
      size: 'cover'
    })

    expect(editor.board.background.image.node.attrs.width).toBe(1280)
    expect(editor.board.background.image.node.attrs.height).toBe(960)
  })

  it('should load background with "contain" size option', async () => {
    const editor = createEditor()

    await editor.loadFromUrl('400x300', {
      size: 'contain'
    })

    expect(editor.board.background.image.node.attrs.width).toBe(960)
    expect(editor.board.background.image.node.attrs.height).toBe(720)
  })

  it('should load background with different x and y', async () => {
    const editor = createEditor()

    await editor.loadFromUrl('400x300', {
      size: 'contain',
      x: -200,
      y: -300
    })

    expect(editor.board.background.image.node.attrs.width).toBe(960)
    expect(editor.board.background.image.node.attrs.height).toBe(720)
    expect(editor.board.background.image.node.attrs.x).toBe(-200)
    expect(editor.board.background.image.node.attrs.y).toBe(-300)
  })
})
