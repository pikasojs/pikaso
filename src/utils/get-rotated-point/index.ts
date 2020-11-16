import type { Point } from '../../types'

/**
 * returns new (x,y) of rotated rectangle
 *
 * 1- https://en.wikipedia.org/wiki/Rotation_matrix
 * 2- https://docs.google.com/document/d/1Xczn6P7GHjJMzoaoW0M4lE3UYJxw5JjwxC9zaGhWUTM
 * 3- https://iiif.io/api/annex/notes/rotation
 *
 * @param scale
 * @param angle
 */
export function getRotatedPoint(point: Point, angle: number) {
  return {
    x: point.x * Math.cos(angle) + -point.y * Math.sin(angle),
    y: point.x * Math.sin(angle) - -point.y * Math.cos(angle)
  }
}
