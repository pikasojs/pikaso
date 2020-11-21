import Konva from 'konva'

import { convertDegreeToRadian } from '../degree-to-radian'
import { getRotateCenterPoint } from '../get-center-point'

export function rotateAroundCenter(
  node: Konva.Group | Konva.Shape | Konva.Layer | Konva.Stage,
  theta: number
) {
  const base = {
    x: (node.width() / 2) * -1,
    y: (node.height() / 2) * -1
  }

  const current = getRotateCenterPoint(
    base,
    convertDegreeToRadian(node.rotation())
  )
  const rotated = getRotateCenterPoint(base, convertDegreeToRadian(theta))

  const dx = rotated.x - current.x
  const dy = rotated.y - current.y

  node.x(node.x() + dx)
  node.y(node.y() + dy)
  node.rotation(theta)
}
