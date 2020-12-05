import Konva from 'konva'

/**
 * Create an image node from the given url
 *
 * @returns an image node
 * @param url The image url
 */
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
