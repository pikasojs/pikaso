import Konva from 'konva'

/**
 * Rotates a node around its center
 *
 * @returns The rotated node around the center based on the given angle
 * @param node The node
 * @param theta The angle value
 */
export function rotateAroundCenter(
  node: Konva.Group | Konva.Shape | Konva.Layer | Konva.Stage,
  theta: number
) {
  const rect = node.getClientRect()

  const center = {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2
  }

  node.rotation(theta)

  const newRect = node.getClientRect()

  // x = newCenter.x - center.x and y = newCenter.y - center.y
  const distance = {
    x: center.x - (newRect.x + newRect.width / 2),
    y: center.y - (newRect.y + newRect.height / 2)
  }

  node.setAttrs({
    x: node.x() + distance.x,
    y: node.y() + distance.y
  })
}
