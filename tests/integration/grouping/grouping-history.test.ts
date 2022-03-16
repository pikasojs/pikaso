import { createEditor } from '../../../jest/utils/create-editor'
import { createShapes } from '../../../jest/utils/create-shapes'

describe('Grouping -> History States', () => {
  it('should undo and redo creating an empty group', () => {
    const editor = createEditor()
    editor.board.groups.create('g1', {})

    expect(editor.board.groups.find('g1')).not.toBe(undefined)

    editor.undo()
    expect(editor.board.groups.find('g1')).toBe(undefined)

    editor.redo()
    expect(editor.board.groups.find('g1')).not.toBe(undefined)
  })

  it('should undo and redo deleting a group', () => {
    const editor = createEditor()

    editor.board.groups.attach(createShapes(editor, 2), 'g1')
    editor.board.groups.delete('g1')

    expect(editor.board.groups.find('g1')).toBe(undefined)
    expect(editor.board.activeShapes.length).toBe(0)

    editor.undo()
    expect(editor.board.groups.find('g1')).not.toBe(undefined)
    expect(editor.board.activeShapes.length).toBe(3)

    editor.redo()
    expect(editor.board.groups.find('g1')).toBe(undefined)
    expect(editor.board.activeShapes.length).toBe(0)
  })

  it('should undo and redo undeleting a group', () => {
    const editor = createEditor()

    editor.board.groups.attach(createShapes(editor, 2), 'g1')
    editor.board.groups.delete('g1')
    editor.board.groups.undelete('g1')

    expect(editor.board.groups.find('g1')).not.toBe(undefined)
    expect(editor.board.activeShapes.length).toBe(3)

    editor.undo()
    expect(editor.board.groups.find('g1')).toBe(undefined)
    expect(editor.board.activeShapes.length).toBe(0)

    editor.redo()
    expect(editor.board.groups.find('g1')).not.toBe(undefined)
    expect(editor.board.activeShapes.length).toBe(3)
  })

  it('should undo and redo ungrouping a group', () => {
    const editor = createEditor()

    const shapes = createShapes(editor, 2)
    editor.board.groups.attach(shapes, 'g1')
    editor.board.groups.ungroup('g1')

    expect(editor.board.groups.find('g1')).toBe(undefined)
    expect(shapes[0].hasGroup()).toBe(false)
    expect(shapes[1].hasGroup()).toBe(false)

    editor.undo()
    expect(editor.board.groups.find('g1')).not.toBe(undefined)
    expect(shapes[0].group).toBe('g1')
    expect(shapes[1].group).toBe('g1')
    expect(editor.board.activeShapes.length).toBe(3)

    editor.redo()
    expect(editor.board.groups.find('g1')).toBe(undefined)
    expect(shapes[0].hasGroup()).toBe(false)
    expect(shapes[1].hasGroup()).toBe(false)
    expect(editor.board.activeShapes.length).toBe(2)
  })

  it('should undo and redo attaching shapes to a group', () => {
    const editor = createEditor()
    const shapes = createShapes(editor, 2)
    editor.board.groups.attach(shapes, 'g1')

    editor.undo()
    expect(shapes[0].hasGroup()).toBe(false)
    expect(shapes[1].hasGroup()).toBe(false)
    expect(editor.board.activeShapes.length).toBe(2)

    editor.redo()
    expect(shapes[0].group).toBe('g1')
    expect(shapes[1].group).toBe('g1')
    expect(editor.board.activeShapes.length).toBe(3)
  })

  it('should undo and redo detaching shapes from a group', () => {
    const editor = createEditor()
    const shapes = createShapes(editor, 2)
    editor.board.groups.attach(shapes, 'g1')
    editor.board.groups.detach([shapes[0]], 'g1')

    editor.undo()
    expect(shapes[0].group).toBe('g1')

    editor.redo()
    expect(shapes[0].hasGroup()).toBe(false)
  })
})
