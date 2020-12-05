/**
 * @returns The converted image to data url
 * @param file The image [[File]]
 */
export async function imageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener('load', () => {
      resolve(<string>reader.result)
    })

    reader.addEventListener('error', e => {
      reject(e)
    })

    reader.readAsDataURL(file)
  })
}
