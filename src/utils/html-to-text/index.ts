/**
 * @returns The converted html code to the plain text
 * @param html The html code
 */
export function convertHtmlToText(html = '') {
  let value = String(html)

  value = value.replace(/&nbsp;/gi, ' ')
  value = value.replace(/&amp;/gi, '&')

  value = value.replace(/<br>/gi, '\n')
  value = value.replace(/<br\/>/gi, '\n')
  value = value.replace(/<div>/gi, '\n')
  value = value.replace(/<p>/gi, '\n')
  value = value.replace(/<(.*?)>/g, '')

  value = value
    .split('\n')
    .map((line = '') => {
      return line.trim()
    })
    .join('\n')

  value = value.replace(/\n\n+/g, '\n\n')

  value = value.replace(/[ ]+/g, ' ')
  value = value.trim()

  return value
}
