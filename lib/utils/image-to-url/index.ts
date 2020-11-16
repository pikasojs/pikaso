export async function imageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    // Once a file is successfully readed:
    reader.addEventListener('load', () => {
      resolve(<string>reader.result)
    })

    reader.addEventListener('error', e => {
      reject(e)
    })

    reader.readAsDataURL(file)
  })
}
