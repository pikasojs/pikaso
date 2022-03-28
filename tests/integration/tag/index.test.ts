import Konva from 'konva'

import { createEditor } from '../../../jest/utils/create-editor'

describe('Tag Measure', () => {
  const shapeConfig = {
    x: 100,
    y: 100,
    width: 100,
    height: 50
  }

  it('should create labels for selection and drawers', () => {
    const editor = createEditor({
      measurement: {}
    })

    const labels = editor.board.layer.children!.filter(
      node => node.className === 'Label'
    )

    expect(labels.length).toBe(10)
  })

  it('should show measure tag when select a shape', () => {
    const editor = createEditor({
      measurement: {}
    })

    const shape = editor.shapes.rect.insert(shapeConfig)

    const label = editor.board.layer.children![4] as Konva.Label
    expect(label.isVisible()).toBe(false)

    shape.select()
    expect(label.isVisible()).toBe(true)
  })

  it('should reposition tag when there is no space at bottom', () => {
    const editor = createEditor({
      measurement: {}
    })

    const shape = editor.shapes.rect.insert(shapeConfig)
    const label = editor.board.layer.children![4] as Konva.Label

    shape.select()
    expect(label.attrs).toMatchObject({
      x: 146,
      y: 165
    })

    shape.deselect()
    shape.node.setAttrs({
      y: 680
    })
    shape.select()

    expect(label.attrs.y).toBeLessThanOrEqual(
      editor.board.getDimensions().height
    )
  })

  it('should not display tag when it is disabled', () => {
    const editor = createEditor()

    const shape = editor.shapes.rect.insert(shapeConfig)
    shape.select()

    const labels = editor.board.layer.children!.filter(
      node => node.className === 'Label'
    )
    expect(labels.length).toBe(0)
  })
})
