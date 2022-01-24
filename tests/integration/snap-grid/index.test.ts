import { createEditor } from '../../../jest/utils/create-editor'
import { SnapGrid } from '../../../src/SnapGrid'

// jest.mock('../../../src/SnapGrid')

describe('Snap Grid', () => {
  const shapeConfig = {
    x: 100,
    y: 100,
    width: 100,
    height: 50
  }

  it('should return the actual state of snap grid when disabled', () => {
    const editor = createEditor()

    expect(editor.snapGrid.isActive).toBe(false)
  })

  it('should return the actual state of snap grid when enabled', () => {
    const editor = createEditor({
      snapToGrid: {}
    })

    expect(editor.snapGrid.isActive).toBe(true)
  })

  it('should return the actual state of snap grid after enabling', () => {
    const editor = createEditor()

    expect(editor.snapGrid.isActive).toBe(false)
    editor.snapGrid.enable()
    expect(editor.snapGrid.isActive).toBe(true)
  })

  it('should return the actual state of snap grid after disabling', () => {
    const editor = createEditor({
      snapToGrid: {}
    })

    expect(editor.snapGrid.isActive).toBe(true)
    editor.snapGrid.disable()
    expect(editor.snapGrid.isActive).toBe(false)
  })

  it('should trigger the onDragMove method after dragging a shape', () => {
    const editor = createEditor({
      snapToGrid: {}
    })

    const shape = editor.shapes.rect.insert(shapeConfig)

    const methods = [
      'destroy',
      'getGuideLines',
      'getLineStops',
      'getNodeEdgeBounds',
      'draw'
    ]

    methods.forEach(name => {
      jest.spyOn(SnapGrid.prototype as any, name)
    })

    methods.forEach(name => {
      expect((editor.snapGrid as any)[name]).toHaveBeenCalledTimes(0)
    })

    editor.snapGrid['onDragMove']({
      target: shape.node
    } as any)

    methods.forEach(name => {
      expect((editor.snapGrid as any)[name]).toHaveBeenCalledTimes(1)
    })
  })

  it('should render two snap lines when shape is fully centered', () => {
    const editor = createEditor({
      snapToGrid: {}
    })

    const shape = editor.shapes.rect.insert({
      x: (editor.board.stage.width() - 100) / 2,
      y: (editor.board.stage.height() - 100) / 2,
      width: 100,
      height: 100
    })

    editor.snapGrid['onDragMove']({
      target: shape.node
    } as any)

    const lines = editor.board.layer.children?.filter(
      node => node.className === 'Line'
    )!

    expect(lines.length).toBe(2)

    expect(lines[0].attrs.points).toEqual([
      0,
      0,
      0,
      editor.board.stage.height()
    ])

    expect(lines[1].attrs.points).toEqual([0, 0, editor.board.stage.width(), 0])

    expect(lines[0].attrs.x).toBe(editor.board.stage.width() / 2)
    expect(lines[1].attrs.y).toBe(editor.board.stage.height() / 2)
  })

  it('should render one snap line when shape is vertically centered', () => {
    const editor = createEditor({
      snapToGrid: {}
    })

    const shape = editor.shapes.rect.insert({
      x: 100,
      y: (editor.board.stage.height() - 100) / 2,
      width: 100,
      height: 100
    })

    editor.snapGrid['onDragMove']({
      target: shape.node
    } as any)

    const lines = editor.board.layer.children?.filter(
      node => node.className === 'Line'
    )!

    expect(lines.length).toBe(1)

    expect(lines[0].attrs.points).toEqual([0, 0, editor.board.stage.width(), 0])

    expect(lines[0].attrs.y).toBe(editor.board.stage.height() / 2)
  })

  it('should render one snap line when shape is horizontally centered', () => {
    const editor = createEditor({
      snapToGrid: {}
    })

    const shape = editor.shapes.rect.insert({
      x: (editor.board.stage.width() - 100) / 2,
      y: 100,
      width: 100,
      height: 100
    })

    editor.snapGrid['onDragMove']({
      target: shape.node
    } as any)

    const lines = editor.board.layer.children?.filter(
      node => node.className === 'Line'
    )!

    expect(lines.length).toBe(1)

    expect(lines[0].attrs.points).toEqual([
      0,
      0,
      0,
      editor.board.stage.height()
    ])

    expect(lines[0].attrs.x).toBe(editor.board.stage.width() / 2)
  })

  it('should render one snap line when bottom of the shape have overlap with another shape', () => {
    const editor = createEditor({
      snapToGrid: {}
    })

    const shape1 = editor.shapes.rect.insert({
      x: 500,
      y: 100,
      width: 100,
      height: 100
    })

    editor.shapes.rect.insert({
      x: 100,
      y: 200,
      width: 100,
      height: 100
    })

    editor.snapGrid['onDragMove']({
      target: shape1.node
    } as any)

    const lines = editor.board.layer.children?.filter(
      node => node.className === 'Line'
    )!

    expect(lines.length).toBe(1)

    expect(lines[0].attrs.points).toEqual([0, 0, editor.board.stage.width(), 0])
    expect(lines[0].attrs.y).toBe(200)
  })

  it('should render two snap lines when shapes are positioned inside each other', () => {
    const editor = createEditor({
      snapToGrid: {}
    })

    const shape1 = editor.shapes.rect.insert({
      x: 400,
      y: 400,
      width: 200,
      height: 250
    })

    editor.shapes.rect.insert({
      x: 500,
      y: 525,
      width: 100,
      height: 100
    })

    editor.snapGrid['onDragMove']({
      target: shape1.node
    } as any)

    const lines = editor.board.layer.children?.filter(
      node => node.className === 'Line'
    )!

    expect(lines.length).toBe(2)

    expect(lines[0].attrs.points).toEqual([
      0,
      0,
      0,
      editor.board.stage.height()
    ])

    expect(lines[1].attrs.points).toEqual([0, 0, editor.board.stage.width(), 0])

    expect(lines[0].attrs.x).toBe(500)
    expect(lines[1].attrs.y).toBe(525)
  })

  it('should set options', () => {
    const editor = createEditor({
      snapToGrid: {}
    })

    const shape = editor.shapes.rect.insert({
      x: 100,
      y: (editor.board.stage.height() - 100) / 2,
      width: 100,
      height: 100
    })

    editor.snapGrid.setOptions({
      strokeWidth: 2,
      stroke: 'red'
    })

    editor.snapGrid['onDragMove']({
      target: shape.node
    } as any)

    const lines = editor.board.layer.children?.filter(
      node => node.className === 'Line'
    )!

    expect(lines[0].attrs).toMatchObject({
      stroke: 'red',
      strokeWidth: 2
    })
  })

  it('should work with different offset thresholds', () => {
    const editor = createEditor({
      snapToGrid: {}
    })

    const shape = editor.shapes.rect.insert({
      x: 100,
      y: (editor.board.stage.height() - 100) / 2 - 30,
      width: 100,
      height: 100
    })

    editor.snapGrid.setOffset(30)

    editor.snapGrid['onDragMove']({
      target: shape.node
    } as any)

    const lines = editor.board.layer.children?.filter(
      node => node.className === 'Line'
    )!

    expect(lines.length).toBe(1)
  })

  it('should do nothing when the snap grid is already disabled', () => {
    const editor = createEditor({
      snapToGrid: {}
    })

    jest.spyOn(SnapGrid.prototype as any, 'unregisterEvents')

    expect(editor.snapGrid.isActive).toBe(true)

    editor.snapGrid.disable()
    expect(editor.snapGrid.isActive).toBe(false)

    editor.snapGrid.disable()
    expect(editor.snapGrid.isActive).toBe(false)

    expect(editor.snapGrid['unregisterEvents']).toHaveBeenCalledTimes(1)
  })

  it('should do nothing when the snap grid is already enabled', () => {
    const editor = createEditor()

    jest.spyOn(SnapGrid.prototype as any, 'registerEvents')

    expect(editor.snapGrid.isActive).toBe(false)

    editor.snapGrid.enable()
    expect(editor.snapGrid.isActive).toBe(true)

    editor.snapGrid.enable()
    expect(editor.snapGrid.isActive).toBe(true)

    expect(editor.snapGrid['registerEvents']).toHaveBeenCalledTimes(1)
  })

  it('should destroy lines after drag end', () => {
    const editor = createEditor({
      snapToGrid: {}
    })

    const shape = editor.shapes.rect.insert({
      x: (editor.board.stage.width() - 100) / 2,
      y: 100,
      width: 100,
      height: 100
    })

    editor.snapGrid['onDragMove']({
      target: shape.node
    } as any)

    const lines = editor.board.layer.children?.filter(
      node => node.className === 'Line'
    )!

    expect(lines.length).toBe(1)

    editor.snapGrid['onDragEnd']()

    expect(
      editor.board.layer.children?.filter(node => node.className === 'Line')!
        .length
    ).toBe(0)
  })

  it('shoud not work when the dragged shape is not an active shape', () => {
    const editor = createEditor({
      snapToGrid: {}
    })

    const shape = editor.shapes.rect.insert(shapeConfig)
    shape.delete()

    jest.spyOn(SnapGrid.prototype as any, 'draw')

    expect(editor.snapGrid['draw']).toHaveBeenCalledTimes(0)

    editor.snapGrid['onDragMove']({
      target: shape.node
    } as any)

    expect(editor.snapGrid['draw']).toHaveBeenCalledTimes(0)
  })
})
