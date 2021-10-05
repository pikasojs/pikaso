import type { Point } from '../../types'

/**
 * @return The new x and y of the rotated rectangle
 *
 * 1- https://en.wikipedia.org/wiki/Rotation_matrix
 * 2- https://docs.google.com/document/d/1Xczn6P7GHjJMzoaoW0M4lE3UYJxw5JjwxC9zaGhWUTM
 * 3- https://iiif.io/api/annex/notes/rotation
 *
 * @param point The [[Point]]
 * @param angle The angle value
 */
export function getRotatedPoint(point: Point, angle: number) {
  const x = point.x * Math.cos(angle) + -point.y * Math.sin(angle)
  const y = point.x * Math.sin(angle) - -point.y * Math.cos(angle)

  return {
    x: Number(x.toFixed(8)),
    y: Number(y.toFixed(8))
  }
}
