import Konva from 'konva'

import { imageToDataUrl } from '../../utils/image-to-url'
import { createImageFromUrl } from '../../utils/create-image-from-url'

import { Board } from '../../Board'
import { Events } from '../../Events'
import { History } from '../../History'

import { Shape } from '../../Shape'

export class Background {
  /**
   *
   */
  public image: Shape

  /**
   *
   */
  public overlay: Shape

  /**
   *
   */
  private board: Board

  /**
   *
   */
  private events: Events

  /**
   *
   */
  private history: History

  constructor(board: Board, events: Events, history: History) {
    this.board = board
    this.events = events
    this.history = history

    const image = new Konva.Image()
    const overlay = new Konva.Rect()

    this.image = new Shape(board, events, history, image, {
      selectable: false
    })

    this.overlay = new Shape(board, events, history, overlay, {
      selectable: false
    })

    this.board.layer.add(image, overlay)
  }

  /**
   *
   */
  public get nodes() {
    return [this.image.node, this.overlay.node]
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
    this.history.create(
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

    this.board.layer.draw()
  }

  /**
   *
   * @param color
   */
  public fill(color: string) {
    this.history.create(this.board.layer, this.overlay.node)

    this.overlay.node.setAttrs({
      width: this.board.stage.width(),
      height: this.board.stage.height(),
      fill: color
    })

    this.board.layer.draw()
  }
}
