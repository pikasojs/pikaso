import { createEditor } from '../../../jest/utils/create-editor'

describe('Export', () => {
  it('should export to json', async () => {
    const editor = createEditor()

    await editor.board.background.setImageFromUrl('1200x500')

    editor.shapes.label.insert({
      container: {
        x: 400,
        y: 400
      },
      tag: {
        fill: 'blue'
      },
      text: {
        text: 'Test',
        width: 400,
        fill: '#fff',
        fontSize: 100
      }
    })

    const json = editor.export.json()

    console.log(json)
    // expect(json).toBe(
    //   '{"attrs":{"width":1280,"height":720},"className":"Stage","children":[{"attrs":{},"className":"Layer","children":[{"attrs":{"fill":"rgba(105, 105, 105, 0.7)","stroke":"#dbdbdb","visible":false},"className":"Rect"},{"attrs":{},"className":"Transformer"},{"attrs":{},"className":"Image"},{"attrs":{},"className":"Rect"},{"attrs":{"x":400,"y":400,"draggable":true},"className":"Label","children":[{"attrs":{"fill":"blue","width":400,"height":100},"className":"Tag"},{"attrs":{"text":"Test","width":400,"fill":"#fff","fontSize":100,"height":"auto"},"className":"Text"}]}]}]}'
    // )
  })
})
