import type { Point } from '../../types'

export function getRotateCenterPoint({ x, y }: Point, radian: number) {
  const rcos = Math.cos(radian)
  const rsin = Math.sin(radian)

  return {
    x: x * rcos - y * rsin,
    y: y * rcos + x * rsin
  }
}
