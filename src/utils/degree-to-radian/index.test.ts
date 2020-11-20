import { convertDegreeToRadian } from '.'

describe('Utils -> convertDegreeToRadian', () => {
  it('should convert degree to radian', () => {
    const point = convertDegreeToRadian(90)

    expect(point).toEqual(1.5707963267948966)
  })
})
