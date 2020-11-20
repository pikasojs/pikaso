import { getPointsDistance } from '.'

describe('Utils -> getPointsDistance', () => {
  it('should calculate the distance between two [0,0] and [16,0]', () => {
    const point = getPointsDistance(
      {
        x: 0,
        y: 0
      },
      {
        x: 16,
        y: 0
      }
    )

    expect(point).toEqual(16)
  })

  it('should calculate the distance between two [0,0] and [0,16]', () => {
    const point = getPointsDistance(
      {
        x: 0,
        y: 0
      },
      {
        x: 0,
        y: 16
      }
    )

    expect(point).toEqual(16)
  })

  it('should calculate the distance between two [10,10] and [100,100]', () => {
    const point = getPointsDistance(
      {
        x: 10,
        y: 10
      },
      {
        x: 100,
        y: 100
      }
    )

    expect(point).toEqual(127.27922061357856)
  })
})
