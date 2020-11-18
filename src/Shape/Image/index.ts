import Konva from 'konva'

import { imageToDataUrl } from '../../utils/image-to-url'
import { createImageFromUrl } from '../../utils/create-image-from-url'

import { Board } from '../../Board'
import { Events } from '../../Events'
import { History } from '../../History'

export class Image {
  /**
   *
   */
  private readonly board: Board

  /**
   *
   */
  private readonly events: Events

  /**
   *
   */
  private readonly history: History

  constructor(board: Board, events: Events, history: History) {
    this.board = board
    this.events = events
    this.history = history
  }

  /**
   *
   */
  public async insert(
    file: File | string,
    config: Partial<Konva.ImageConfig> = {}
  ) {
    const url = file instanceof File ? await imageToDataUrl(file) : file
    const image = await createImageFromUrl(url)

    const ratio = image.width() / image.height()

    const defaultHeight = this.board.stage.height() / 2
    const defaultWidth = defaultHeight * ratio

    image.setAttrs({
      width: defaultWidth,
      height: defaultHeight,
      x: (this.board.stage.width() - defaultWidth) / 2,
      y: (this.board.stage.height() - defaultHeight) / 2,
      rotation: this.board.stage.rotation() * -1,
      draggable: true,
      ...config
    })

    return this.board.addShape(image, {
      keepRatio: true
    })
  }
}
