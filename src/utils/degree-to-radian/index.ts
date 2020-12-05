/**
 * Returns the converted unit from degree to radian
 *
 * @returns the converted unit from degree to radian
 * @param degree The angle in degree unit
 */
export function convertDegreeToRadian(degree: number) {
  return (degree * Math.PI) / 180
}
