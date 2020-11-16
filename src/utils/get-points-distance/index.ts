import { Point } from '../../types'

/**
 *
 * @param p1
 * @param p2
 */
export function getPointsDistance(p1: Point, p2: Point) {
  return Math.sqrt(Math.abs(p1.x - p2.x) ** 2 + Math.abs(p1.y - p2.y) ** 2)
}
