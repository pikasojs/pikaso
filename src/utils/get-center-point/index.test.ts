import { getRotateCenterPoint } from '.'

describe('Utils -> getRotateCenterPoint', () => {
  it('should calculate center point of rotation', () => {
    const point = getRotateCenterPoint(
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
})
