import Konva from 'konva'

import { imageToDataUrl } from '../../../utils/image-to-url'
import { createImageFromUrl } from '../../../utils/create-image-from-url'
import { isBrowser } from '../../../utils/detect-environment'

import { Board } from '../../../Board'
import { ImageModel } from '../../models/ImageModel'

export class ImageDrawer {
  /**
   * Represents the [[Board]]
   */
  private board: Board

  /**
   * Creates a new image builder component
   *
   * @param board The [[Board]
   */
  constructor(board: Board) {
    this.board = board
  }

  /**
   * Inserts a new image into the board
   *
   * @param image The image [[File]]
   * @param config The image node configuration
   */
  public async insert(
    image: File | Konva.Image | string,
    config: Partial<Konva.ImageConfig> = {}
  ): Promise<ImageModel> {
    let imageInstance: Konva.Image

    if (image instanceof Konva.Image) {
      imageInstance = image
    } else {
      const url =
        isBrowser() && image instanceof File
          ? await imageToDataUrl(image)
          : image

      imageInstance = await createImageFromUrl(url as string)
    }

    const ratio = imageInstance.width() / imageInstance.height()
    const defaultHeight = this.board.stage.height() / 2
    const defaultWidth = defaultHeight * ratio

    imageInstance.setAttrs({
      width: defaultWidth,
      height: defaultHeight,
      x: (this.board.stage.width() - defaultWidth) / 2,
      y: (this.board.stage.height() - defaultHeight) / 2,
      rotation: this.board.stage.rotation() * -1,
      draggable: this.board.settings.selection?.interactive,
      ...config
    })

    return new ImageModel(this.board, imageInstance, {
      transformer: {
        keepRatio: true
      }
    })
  }
}
