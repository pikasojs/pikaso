import Konva from 'konva'

export function createImageFromUrl(url: string): Promise<Konva.Image> {
  return new Promise((resolve, reject) => {
    Konva.Image.fromURL(url, (image: Konva.Image) => {
      if (!image) {
        reject()
        return
      }

      resolve(image)
    })
  })
}
