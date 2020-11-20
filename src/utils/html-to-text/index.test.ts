import { convertHtmlToText } from '.'

describe('Utils -> Html2Text', () => {
  it('should filter html to text', () => {
    const text = convertHtmlToText('<div>Hi <b>Ramin</b>&nbsp;<br></div>')

    expect(text).toEqual('Hi Ramin')
  })

  it('should convert <br /> tag to new line', () => {
    const text = convertHtmlToText('Line1<br>Line2<br>Line3')

    expect(text).toEqual('Line1\nLine2\nLine3')
  })
})
