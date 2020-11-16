import type { Point } from '../../types'

export function getRotateCenterPoint({ x, y }: Point, rad: number) {
  const rcos = Math.cos(rad)
  const rsin = Math.sin(rad)

  return {
    x: x * rcos - y * rsin,
    y: y * rcos + x * rsin
  }
}
