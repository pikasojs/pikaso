import { createEditor } from '../../../../jest/utils/create-editor'

describe('Shape -> Label', () => {
  const baseConfig = {
    container: {
      x: 100,
      y: 100
    },
    text: {
      fontSize: 50,
      fill: 'red',
      text: 'Test Label'
    }
  }

  it('should create a label', () => {
    const editor = createEditor()

    editor.shapes.label.insert(baseConfig)

    expect(editor.board.activeShapes.length).toBe(1)
  })

  it('should transition to inline editing stage', () => {
    const editor = createEditor()

    const label = editor.shapes.label.insert(baseConfig)

    label.node.fire('dblclick')

    expect(label.isEditing).toBe(true)
  })

  it('should change label text', () => {
    const editor = createEditor()

    const label = editor.shapes.label.insert(baseConfig)

    label.updateText({
      text: 'Foo Bar'
    })

    expect(label.textNode.text()).toBe('Foo Bar')
  })

  it('should change label background', () => {
    const editor = createEditor()

    const label = editor.shapes.label.insert(baseConfig)

    label.updateTag({
      fill: 'red'
    })

    expect(label.tagNode.attrs.fill).toBe('red')
  })
})
