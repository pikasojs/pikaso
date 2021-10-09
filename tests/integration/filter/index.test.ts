import Konva from 'konva'

import { createEditor } from '../../../jest/utils/create-editor'

describe('Filter', () => {
  const shapeConfig = {
    x: 200,
    y: 200,
    radius: 50,
    fill: 'red'
  }

  it('should add filter to the shape', () => {
    const editor = createEditor()

    const shape = editor.shapes.circle.insert(shapeConfig)

    shape.addFilter({
      name: 'Blur',
      options: {
        blurRadius: 20
      }
    })

    expect(editor.board.activeShapes[0].node.attrs.filters.length).toBe(1)

    expect(editor.board.activeShapes[0].node.attrs.filters[0]).toEqual(
      Konva.Filters['Blur']
    )
  })

  it('should add multiple filters to the shape', () => {
    const editor = createEditor()

    const shape = editor.shapes.circle.insert(shapeConfig)

    shape.addFilter({
      name: 'Blur',
      options: {
        blurRadius: 20
      }
    })

    shape.addFilter({
      name: 'Invert'
    })

    expect(editor.board.activeShapes[0].node.attrs.filters.length).toBe(2)

    expect(editor.board.activeShapes[0].node.attrs.filters[0]).toEqual(
      Konva.Filters['Blur']
    )

    expect(editor.board.activeShapes[0].node.attrs.filters[1]).toEqual(
      Konva.Filters['Invert']
    )
  })

  it('should remove filter from the shape', () => {
    const editor = createEditor()

    const shape = editor.shapes.circle.insert(shapeConfig)

    shape.addFilter({
      name: 'Blur',
      options: {
        blurRadius: 20
      }
    })

    expect(editor.board.activeShapes[0].node.attrs.filters.length).toBe(1)

    shape.removeFilter({ name: 'Blur' })

    expect(editor.board.activeShapes[0].node.attrs.filters.length).toBe(0)
  })

  it('should remove all filters from the shape', () => {
    const editor = createEditor()

    const shape = editor.shapes.circle.insert(shapeConfig)

    shape.addFilter({
      name: 'Blur',
      options: {
        blurRadius: 20
      }
    })

    shape.addFilter({
      name: 'Invert'
    })

    expect(editor.board.activeShapes[0].node.attrs.filters.length).toBe(2)

    shape.removeFilter([{ name: 'Blur' }, { name: 'Invert' }])

    expect(editor.board.activeShapes[0].node.attrs.filters.length).toBe(0)
  })

  it('should undo and redo after adding filter', () => {
    console.warn = () => {}

    const editor = createEditor()

    const shape = editor.shapes.circle.insert(shapeConfig)

    shape.addFilter({
      name: 'Blur',
      options: {
        blurRadius: 20
      }
    })

    expect(editor.board.activeShapes[0].node.attrs.filters.length).toBe(1)

    editor.undo()
    expect(editor.board.activeShapes[0].node.attrs.filters?.length).toBe(
      undefined
    )

    editor.redo()
    expect(editor.board.activeShapes[0].node.attrs.filters.length).toBe(1)
  })

  it('should undo and redo after removing filter', () => {
    console.warn = () => {}

    const editor = createEditor()

    const shape = editor.shapes.circle.insert(shapeConfig)

    shape.addFilter({
      name: 'Blur',
      options: {
        blurRadius: 20
      }
    })

    shape.removeFilter({ name: 'Blur' })
    expect(editor.board.activeShapes[0].node.attrs.filters.length).toBe(0)

    editor.undo()
    expect(editor.board.activeShapes[0].node.attrs.filters?.length).toBe(1)

    editor.redo()
    expect(editor.board.activeShapes[0].node.attrs.filters.length).toBe(0)
  })

  it('should work with remove filter on shapes without filter', () => {
    const editor = createEditor()

    const shape = editor.shapes.circle.insert(shapeConfig)

    expect(editor.board.activeShapes[0].node.attrs.filters?.length).toBe(
      undefined
    )

    shape.removeFilter({ name: 'Blur' })

    expect(editor.board.activeShapes[0].node.attrs.filters?.length).toBe(
      undefined
    )
  })
})
