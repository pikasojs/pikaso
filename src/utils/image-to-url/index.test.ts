import { imageToDataUrl } from '.'

describe('Utils -> imageToDataUrl', () => {
  it('should convert file to data url', async () => {
    const file = new File([''], 'foo.png', {
      type: 'image/png'
    })

    const url = await imageToDataUrl(file)

    expect(url).toContain('data:image/png;base64,')
  })
})
