import { omit } from '.'

describe('Utils -> Omit', () => {
  const input = {
    foo: 1,
    bar: 2,
    pho: 3
  }

  it('should filter object correctly', () => {
    const object = omit(input, ['foo', 'bar'])

    expect(object).toEqual({
      pho: 3
    })
  })

  it('should return the given object with the second argument is empty', () => {
    const object = omit(input, [])
    expect(object).toEqual(object)
  })
})
