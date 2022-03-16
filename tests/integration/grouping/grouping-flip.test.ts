import { createEditor } from '../../../jest/utils/create-editor'

describe('Grouping -> Rotation', () => {
  it('should flip a group vertically', () => {
    const editor = createEditor()
    const shapes = [
      editor.shapes.circle.insert({
        x: 200,
        y: 200,
        radius: 20,
        fill: 'blue'
      }),
      editor.shapes.circle.insert({
        x: 300,
        y: 300,
        radius: 10,
        fill: 'red'
      })
    ]

    const group = editor.board.groups.attach(shapes, 'g1')

    group.container.flipY()

    expect(group.container.node.attrs).toMatchObject({
      scaleY: -1,
      y: 490,
      x: 0
    })
  })

  it('should flip the group horizontally', () => {
    const editor = createEditor()
    const shapes = [
      editor.shapes.circle.insert({
        x: 200,
        y: 200,
        radius: 20,
        fill: 'blue'
      }),
      editor.shapes.circle.insert({
        x: 300,
        y: 300,
        radius: 10,
        fill: 'red'
      })
    ]

    const group = editor.board.groups.attach(shapes, 'g1')

    group.container.flipX()

    expect(group.container.node.attrs).toMatchObject({
      scaleX: -1,
      x: 490,
      y: 0
    })
  })
})
