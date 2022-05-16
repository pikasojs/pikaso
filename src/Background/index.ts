import Konva from 'konva'

import { imageToDataUrl } from '../utils/image-to-url'
import { createImageFromUrl } from '../utils/create-image-from-url'

import { Board } from '../Board'

import { ImageModel } from '../shape/models/ImageModel'
import { RectModel } from '../shape/models/RectModel'

import type { BackgroundOptions } from '../types'

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

    const image = new Konva.Image({
      image: undefined
    })
    const overlay = new Konva.Rect()

    this.image = new ImageModel(board, image, {
      selectable: false,
      history: false
    })

    this.overlay = new RectModel(board, overlay, {
      selectable: false,
      history: false
    })
  }

  /**
   * Returns background nodes which includes image and overlay
   */
  public get nodes() {
    return [this.image.node, this.overlay.node]
  }

  /**
   * Returns current position of background
   */
  public getPosition() {
    return {
      x: this.image.node.x() || this.overlay.node.x(),
      y: this.image.node.y() || this.overlay.node.y()
    }
  }

  /**
   * Loads the background image from given file
   *
   * @param file The image file
   * @param options The background options
   */
  public async setImageFromFile(
    file: File,
    options?: Partial<BackgroundOptions>
  ) {
    const url = await imageToDataUrl(file)

    this.setImageFromUrl(url, options)
  }

  /**
   * Loads the background image from url
   *
   * @param url The image url
   * @param options The background options
   */
  public async setImageFromUrl(
    url: string,
    options: Partial<BackgroundOptions> = {
      size: 'resize'
    }
  ) {
    this.board.history.create(
      this.board.layer,
      [this.board.stage, this.image.node, this.overlay.node],
      this.board.rescale.bind(this)
    )

    const background = await createImageFromUrl(url)

    let width = background.width()
    let height = background.height()

    const ratios = {
      width: this.board.stage.width() / width,
      height: this.board.stage.height() / height
    }

    if (options.size === 'cover') {
      const ratio = Math.max(ratios.width, ratios.height)
      width *= ratio
      height *= ratio
    }

    if (options.size === 'contain') {
      const ratio = Math.min(ratios.width, ratios.height)
      width *= ratio
      height *= ratio
    }

    if (options.size === 'resize') {
      this.board.stage.setAttrs({
        width,
        height
      })
    }

    if (options.size === 'stretch') {
      width = this.board.stage.width()
      height = this.board.stage.height()
    }

    this.image.node.setAttrs({
      width,
      height,
      image: background.image(),
      x: options.x ?? background.x(),
      y: options.y ?? background.y()
    })

    this.overlay.node.setAttrs({
      width,
      height
    })
  }

  /**
   * Updates color of overlay
   *
   * @param color The given color in Hex or RGB
   */
  public fill(color: string) {
    this.board.history.create(this.board.layer, this.overlay.node)

    this.overlay.node.setAttrs({
      width: this.board.stage.width(),
      height: this.board.stage.height(),
      fill: color
    })
  }
}
