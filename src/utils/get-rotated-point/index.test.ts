import { getRotatedPoint } from '.'

describe('Utils -> getRotatedPoint', () => {
  it('should calculate rotated point at [50,50] and 30 degrees', () => {
    const point = getRotatedPoint(
      {
        x: 50,
        y: 50
      },
      30
    )

    expect(point).toEqual({
      x: 57.114153699022296,
      y: -41.68900871026389
    })
  })

  it('should calculate rotated point at [100,100] and 45 degrees', () => {
    const point = getRotatedPoint(
      {
        x: 100,
        y: 100
      },
      45
    )

    expect(point).toEqual({
      x: -32.55815357163887,
      y: 137.62255133518482
    })
  })
})
