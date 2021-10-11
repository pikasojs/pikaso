import Konva from 'konva'

import { ShapeModel } from '../../ShapeModel'

export class SvgModel extends ShapeModel<Konva.Path, Konva.PathConfig> {
  /**
   * @inheritdoc
   */
  public get type(): string {
    return 'svg'
  }

  /**
   * @inheritdoc
   * @override
   */
  public width() {
    return this.node.getClientRect().width
  }

  /**
   * @inheritdoc
   * @override
   */
  public height() {
    return this.node.getClientRect().height
  }

  /**
   * @inheritdoc
   * @override
   */
  public rotate(theta: number) {
    const rect = this.node.getClientRect()

    const center = {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2
    }

    this.node.rotation(theta)

    const newRect = this.node.getClientRect()

    // x = newCenter.x - center.x and y = newCenter.y - center.y
    const distance = {
      x: center.x - (newRect.x + newRect.width / 2),
      y: center.y - (newRect.y + newRect.height / 2)
    }

    this.node.setAttrs({
      x: this.node.x() + distance.x,
      y: this.node.y() + distance.y
    })

    this.board.events.emit('shape:rotate', {
      shapes: [this]
    })
  }
}
