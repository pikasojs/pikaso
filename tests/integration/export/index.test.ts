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
      stage: {
        className: 'Stage',
        filters: [],
        children: undefined,
        attrs: { width: image[0], height: image[1], x: 0, y: 0 }
      },
      layer: {
        className: 'Layer',
        filters: [],
        children: undefined,
        attrs: { x: 0, y: 0, width: image[0], height: image[1] }
      },
      background: {
        image: {
          className: 'Image',
          filters: [],
          children: undefined,
          group: undefined,
          attrs: {
            url: `http://localhost/${image[0]}x${image[1]}`,
            x: 0,
            y: 0,
            width: image[0],
            height: image[1]
          }
        },
        overlay: {
          className: 'Rect',
          filters: [],
          children: undefined,
          group: undefined,
          attrs: { width: image[0], height: image[1], x: 0, y: 0 }
        }
      },
      shapes: [
        {
          className: 'Label',
          filters: [],
          group: undefined,
          children: [
            {
              attrs: {
                width: labelConfig.text.width,
                height: 100,
                ...labelConfig.tag
              },
              className: 'Tag'
            },
            {
              attrs: {
                ...labelConfig.text,
                height: 'auto'
              },
              className: 'Text'
            }
          ],
          attrs: {
            width: labelConfig.text.width,
            height: 100,
            ...labelConfig.container
          }
        }
      ]
    })
  })

  it('should export to image', async () => {
    const editor = createEditor()

    const url = editor.export.toImage()

    expect(url).toBe('data:image/png;base64,00')
  })
})
