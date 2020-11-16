import Konva from 'konva'

import type { Dimensions } from '../../types'

export function getContainerTransform(
  container: HTMLDivElement,
  stage: Konva.Stage,
  size: Dimensions
) {
  let scale =
    container.clientWidth < container.clientHeight
      ? stage.width() / size.width
      : stage.height() / size.height

  if (scale * stage.width() > container.clientWidth) {
    scale = container.clientWidth / stage.width()
  }

  if (scale * stage.height() > container.clientHeight) {
    scale = container.clientHeight / stage.height()
  }

  return `translate(-50%, -50%) scale(${scale.toFixed(6)})`
}
