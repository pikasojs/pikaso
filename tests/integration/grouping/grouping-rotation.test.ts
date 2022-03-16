import { createEditor } from '../../../jest/utils/create-editor'

describe('Grouping -> Rotation', () => {
  it('should rotate a group', () => {
    const editor = createEditor()
    const shapes = [
      editor.shapes.circle.insert({
        x: editor.board.stage.width() / 2,
        y: editor.board.stage.height() / 2,
        radius: 10,
        fill: 'red'
      }),
      editor.shapes.circle.insert({
        x: editor.board.stage.width() / 2,
        y: editor.board.stage.height() / 2,
        radius: 10,
        fill: 'red'
      })
    ]

    const group = editor.board.groups.attach(shapes, 'g1')

    editor.rotation.transform(90)

    const rect = group.container.node.getClientRect()
    expect({
      ...rect,
      x: Number(rect.x.toFixed(2)),
      y: Number(rect.y.toFixed(2))
    }).toMatchObject({
      x: 196.88,
      y: 354.38,
      width: 11.25,
      height: 11.25
    })

    expect(group.container.node.attrs).toMatchObject({
      rotation: 90,
      scaleX: 0.5625,
      scaleY: 0.5625
    })
  })

  it('should straighten the group', () => {
    const editor = createEditor()
    const shapes = [
      editor.shapes.circle.insert({
        x: editor.board.stage.width() / 2,
        y: editor.board.stage.height() / 2,
        radius: 10,
        fill: 'red'
      }),
      editor.shapes.circle.insert({
        x: editor.board.stage.width() / 2,
        y: editor.board.stage.height() / 2,
        radius: 10,
        fill: 'red'
      })
    ]

    const group = editor.board.groups.attach(shapes, 'g1')
    group.container.rotate(45)

    const rect = group.container.node.getClientRect()
    expect({
      ...rect,
      x: Number(rect.x.toFixed(2)),
      y: Number(rect.y.toFixed(2)),
      width: Number(rect.width.toFixed(2)),
      height: Number(rect.height.toFixed(2))
    }).toMatchObject({
      x: 625.86,
      y: 345.86,
      width: 28.28,
      height: 28.28
    })

    expect(group.container.node.attrs).toMatchObject({
      rotation: 45
    })
  })
})
