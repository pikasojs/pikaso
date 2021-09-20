import datauri from 'datauri'
import Konva from 'konva'

import { createEditor } from '../../../../jest/utils/create-editor'
import { createImageFromUrl } from '../../../../src/utils/create-image-from-url'

describe('Shape -> Image', () => {
  it('should create an image based on an url', async () => {
    const editor = createEditor()

    const base64Image = await datauri(
      __dirname + '/../../../../assets/logo.svg'
    )
    const image = await editor.shapes.image.insert(base64Image!)

    expect(image.node.attrs.image).not.toBeNull()
  })

  it('should create an image based on a file', async () => {
    const editor = createEditor()

    const image = await editor.shapes.image.insert(
      __dirname + '/../../../../assets/logo.png'
    )

    expect(image.node.attrs.image).not.toBeNull()
  })

  it('should create an image based on a Konva.Image object', async () => {
    const editor = createEditor()

    const base64Image = await datauri(
      __dirname + '/../../../../assets/logo.svg'
    )

    const imgObject = await createImageFromUrl(base64Image!)

    const konvaImage = new Konva.Image({
      image: imgObject.getAttr('image')
    })

    const image = await editor.shapes.image.insert(konvaImage)

    expect(image.node.attrs.image).not.toBeNull()
  })
})
