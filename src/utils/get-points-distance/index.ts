import { Point } from '../../types'

/**
 * @returns The distance between two given points
 * @param p1 The first [[Point]]
 * @param p2 The second [[Point]]
 */
export function getPointsDistance(p1: Point, p2: Point) {
  return Math.sqrt(Math.abs(p1.x - p2.x) ** 2 + Math.abs(p1.y - p2.y) ** 2)
}
