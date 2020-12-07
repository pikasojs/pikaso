import { createEditor } from '../../../jest/utils/create-editor'

describe('Export', () => {
  it('should export to json', async () => {
    const editor = createEditor()

    const image = [1200, 500]
    await editor.board.background.setImageFromUrl(`${image[0]}x${image[1]}`)

    const labelConfig = {
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
    }

    editor.shapes.label.insert(labelConfig)

    const json = editor.export.toJson()

    expect(json).toStrictEqual({
      stage: { attrs: { width: image[0], height: image[1] } },
      layer: { attrs: {} },
      background: {
        image: {
          attrs: { url: `http://localhost/${image[0]}x${image[1]}` },
          className: 'Image'
        },
        overlay: {
          attrs: { width: image[0], height: image[1] },
          className: 'Rect'
        }
      },
      shapes: [
        {
          attrs: {
            x: labelConfig.container.x,
            y: labelConfig.container.y,
            draggable: true
          },
          className: 'Label',
          children: [
            {
              attrs: { fill: labelConfig.tag.fill, width: 400, height: 100 },
              className: 'Tag'
            },
            {
              attrs: {
                height: 'auto',
                ...labelConfig.text
              },
              className: 'Text'
            }
          ]
        }
      ]
    })
  })
})
