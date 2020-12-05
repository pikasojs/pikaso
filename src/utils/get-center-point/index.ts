import type { Point } from '../../types'

/**
 * @returns The center point of the given point and angle (in radian)
 *
 * @param point The [[Point]]
 * @param radian The angle (in radian)
 */
export function getRotateCenterPoint({ x, y }: Point, radian: number) {
  const rcos = Math.cos(radian)
  const rsin = Math.sin(radian)

  return {
    x: x * rcos - y * rsin,
    y: y * rcos + x * rsin
  }
}
