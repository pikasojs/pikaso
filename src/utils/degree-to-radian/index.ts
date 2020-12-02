/**
 * Returns the converted unit from degree to radian
 *
 * @param degree - the angle in degree unit
 * @returns the converted unit from degree to radian
 *
 * @public
 */
export function convertDegreeToRadian(degree: number) {
  return (degree * Math.PI) / 180
}
