import Konva from 'konva'

import { Board } from '../Board'
import { defaultTransformerSettings } from '../defaultSettings'
import { Dimensions, Nullable, Point } from '../types'

/**
 * This is a light implementation of [[LabelModel]] for internal use
 * The tag is mostly used to display measurements and sizes
 */
export class Tag {
  /**
   * Represents the main container that includes background and text nodes
   */
  public node: Konva.Label

  /**
   * Represents the [[Board]]
   */
  private board: Board

  /**
   * Represents the background node
   */
  private backgroundNode: Konva.Tag

  /**
   * Represents the text node
   */
  private textNode: Konva.Text

  /**
   * Creates a new tag object
   *
   * @param board The [[Board]]
   * @param defaultVisible Indicates whether a tag is visible by default or not
   */
  constructor(board: Board, defaultVisible = false) {
    this.board = board

    this.node = new Konva.Label()
    this.backgroundNode = new Konva.Tag(
      this.board.settings.measurement?.background
    )
    this.textNode = new Konva.Text({
      text: ' ',
      ...this.board.settings.measurement?.text
    })

    this.node.add(this.backgroundNode, this.textNode)

    if (defaultVisible === false) {
      this.hide()
    }

    this.board.layer.add(this.node)
  }

  /**
   * Updates the position of the tag
   */
  public set position(point: Point) {
    this.node.setAttrs({
      x: point.x,
      y: point.y
    })

    this.node.moveToTop()
  }

  /**
   * Updates the text value of the tag
   */
  public set text(value: string) {
    this.textNode.setAttr('text', value)
  }

  /**
   * Displays the tag node
   */
  public show(): void {
    if (this.node.isVisible()) {
      return
    }

    this.node.clearCache()
    this.node.show()
  }

  /**
   * Hides the tag node
   */
  public hide(): void {
    if (this.node.isVisible() === false) {
      return
    }

    this.node.hide()
    this.node.cache()
  }

  /**
   * Updates position and text of the tag
   * Based on the given shape, the position is calculated automatically
   *
   * @param node The target node
   */
  public measure(
    node: Nullable<Konva.Shape | Konva.Group | Konva.Transformer>,
    rect?: Dimensions & Point
  ): void {
    if (!node || !this.board.settings.measurement) {
      return
    }

    const margin = Math.max(
      this.board.settings.measurement.margin ?? 0,
      this.board.settings.transformer?.anchorSize ?? 0,
      defaultTransformerSettings.anchorSize ?? 0
    )

    const containerRect = rect ?? {
      x: node.x(),
      y: node.y(),
      width: node.width(),
      height: node.height()
    }

    this.text = `${containerRect.width.toFixed(
      0
    )} × ${containerRect.height.toFixed(0)}`

    let x = containerRect.x + containerRect.width / 2 - this.node.width() / 2
    let y = containerRect.y + containerRect.height + margin

    if (y + this.node.height() > this.board.getDimensions().height) {
      y =
        containerRect.y + containerRect.height - this.node.height() * 2 - margin
    }

    this.position = {
      x,
      y
    }

    if (this.node.isVisible() === false) {
      this.show()
    }
  }
}
