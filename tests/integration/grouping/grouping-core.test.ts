import Konva from 'konva'

import { createEditor } from '../../../jest/utils/create-editor'
import { createShapes } from '../../../jest/utils/create-shapes'
import { GroupModel } from '../../../src/shape/models/GroupModel'

describe('Grouping -> Core', () => {
  it('should create an empty group', () => {
    const editor = createEditor()
    editor.board.groups.create('g1', {})

    expect(editor.board.groups.find('g1')).not.toBe(null)
    expect(editor.board.activeShapes[0]).toBeInstanceOf(GroupModel)
    expect(editor.board.groups.list.length).toBe(1)
  })

  it('should group two shapes with "group" property', () => {
    const editor = createEditor()
    const shapes = createShapes(editor, 2)

    shapes[0].group = 'g1'
    shapes[1].group = 'g1'

    expect(shapes[0].hasGroup()).toBe(true)
    expect(shapes[1].hasGroup()).toBe(true)

    const groupShape = editor.board.activeShapes[2]
    expect(groupShape).toBeInstanceOf(GroupModel)
    expect(groupShape.name).toBe('g1')
    expect(groupShape.node.name()).toBe('g1')
  })

  it('should group two shapes with "attach" property', () => {
    const editor = createEditor()
    const shapes = createShapes(editor, 2)

    editor.board.groups.attach(shapes, 'g1')

    expect(shapes[0].hasGroup()).toBe(true)
    expect(shapes[1].hasGroup()).toBe(true)

    const groupShape = editor.board.activeShapes[2]
    expect(groupShape).toBeInstanceOf(GroupModel)

    const node = groupShape.node as unknown as Konva.Group
    expect(node?.children?.length).toBe(2)
    expect(node.name()).toBe('g1')
  })

  it('should separate shapes of a group with "detach" property', () => {
    const editor = createEditor()
    const shapes = createShapes(editor, 2)
    editor.board.groups.attach(shapes, 'g1')

    editor.board.groups.detach(shapes, 'g1')

    expect(shapes[0].hasGroup()).toBe(false)
    expect(shapes[1].hasGroup()).toBe(false)
    expect(editor.board.groups.find('g1')).not.toBe(undefined)
  })

  it('should find a group', () => {
    const editor = createEditor()

    const g1 = editor.board.groups.find('g1')
    expect(g1).toBe(undefined)

    const shapes = createShapes(editor, 2)
    editor.board.groups.attach(shapes, 'g2')

    const g2 = editor.board.groups.find('g2')
    expect(g2?.container.name).toBe('g2')
  })

  it('should find a group', () => {
    const editor = createEditor()

    const g1 = editor.board.groups.findOrCreate('g1', {})
    expect(g1?.container.name).toBe('g1')
  })

  it('should delete a group', () => {
    const editor = createEditor()
    const shapes = createShapes(editor, 2)
    editor.board.groups.attach(shapes, 'g1')

    editor.board.groups.delete('g1')

    const g1 = editor.board.groups.find('g1')
    expect(g1).toBe(undefined)

    expect(editor.board.activeShapes.length).toBe(0)
  })

  it('should undelete a group', () => {
    const editor = createEditor()
    const shapes = createShapes(editor, 2)
    editor.board.groups.attach(shapes, 'g1')

    editor.board.groups.delete('g1')
    editor.board.groups.undelete('g1')

    const g1 = editor.board.groups.find('g1')

    expect(g1).not.toBe(undefined)
    expect(editor.board.activeShapes.length).toBe(3)
  })

  it('should ungroup a group', () => {
    const editor = createEditor()
    const shapes = createShapes(editor, 2)
    editor.board.groups.attach(shapes, 'g1')

    editor.board.groups.ungroup('g1')

    expect(shapes[0].hasGroup()).toBe(false)
    expect(shapes[1].hasGroup()).toBe(false)
    expect(editor.board.groups.find('g1')).toBe(undefined)
    expect(editor.board.activeShapes.length).toBe(2)
  })

  it('shoud not ungroup if the group is cached', () => {
    const editor = createEditor()
    const shapes = createShapes(editor, 2)
    const group = editor.board.groups.attach(shapes, 'g1')

    group.container.addFilter({ name: 'Invert' })

    editor.board.groups.ungroup('g1')

    expect(shapes[0].hasGroup()).toBe(true)
    expect(shapes[1].hasGroup()).toBe(true)
    expect(editor.board.groups.find('g1')).not.toBe(undefined)
    expect(editor.board.activeShapes.length).toBe(3)
  })

  it('should destroy a group', () => {
    const editor = createEditor()
    const shapes = createShapes(editor, 2)
    editor.board.groups.attach(shapes, 'g1')

    editor.board.groups.destroy('g1')

    expect(editor.board.groups.find('g1')).toBe(undefined)
    expect(editor.board.activeShapes.length).toBe(0)
  })
})
