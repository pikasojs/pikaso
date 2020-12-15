import Konva from 'konva'

import { imageToDataUrl } from '../utils/image-to-url'
import { createImageFromUrl } from '../utils/create-image-from-url'

import { Board } from '../Board'

import { ImageModel } from '../shape/models/ImageModel'
import { RectModel } from '../shape/models/RectModel'

export class Background {
  /**
   * Represents the background [[Image | image]]
   */
  public image: ImageModel

  /**
   * Represents the background [[Rect | overlay]]
   */
  public overlay: RectModel

  /**
   * Represents the [[Board]]
   */
  private board: Board

  /**
   * Creates a new background image and overlay
   *
   * @param board The [[Board]]
   */
  constructor(board: Board) {
    this.board = board

    const image = new Konva.Image()
    const overlay = new Konva.Rect()

    this.image = new ImageModel(board, image, {
      selectable: false
    })

    this.overlay = new RectModel(board, overlay, {
      selectable: false
    })
  }

  /**
   *
   */
  public get nodes() {
    return [this.image.node, this.overlay.node]
  }

  /**
   *
   */
  public getPosition() {
    return {
      x: this.image.node.x() || this.overlay.node.x(),
      y: this.image.node.y() || this.overlay.node.y()
    }
  }

  /**
   *
   * @param file
   */
  public async setImageFromFile(file: File) {
    const url = await imageToDataUrl(file)

    this.setImageFromUrl(url)
  }

  /**
   *
   */
  public async setImageFromUrl(url: string) {
    this.board.history.create(
      this.board.layer,
      [this.board.stage, this.image.node, this.overlay.node],
      this.board.rescale.bind(this)
    )

    const background = await createImageFromUrl(url)

    this.board.stage.setAttrs({
      width: background.width(),
      height: background.height()
    })

    this.image.node.setAttrs({
      width: background.width(),
      height: background.height(),
      image: background.image()
    })

    this.overlay.node.setAttrs({
      width: background.width(),
      height: background.height()
    })

    this.board.draw()
  }

  /**
   *
   * @param color
   */
  public fill(color: string) {
    this.board.history.create(this.board.layer, this.overlay.node)

    this.overlay.node.setAttrs({
      width: this.board.stage.width(),
      height: this.board.stage.height(),
      fill: color
    })

    this.board.draw()
  }
}
