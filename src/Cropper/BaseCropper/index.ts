import Konva from 'konva'

import { Board } from '../../Board'

import type { CropperOptions } from '../../types'

/**
 * @internal
 */
export abstract class BaseCropper {
  /**
   * Represents the [[Board]]
   */
  public readonly board: Board

  /**
   * Represents the [[Board.layer]]
   */
  public readonly layer: Konva.Layer

  /**
   * Represents the overlay that fades the background
   */
  public readonly overlay: Konva.Shape

  /**
   * Represents the crop zone that demonstrates the cropping area
   */
  public cropzone: Konva.Group

  /**
   * Represents the cropping options
   */
  public readonly options: CropperOptions

  constructor(board: Board, options: Partial<CropperOptions>) {
    this.board = board

    this.options = this.createOptions(options)

    this.layer = new Konva.Layer()
    this.overlay = this.createOverlay()
    this.cropzone = this.createCropzone()

    this.layer.add(this.overlay, this.cropzone)
  }

  /**
   * Returns the array of mouse events and their relevent cursor names
   */
  protected getCursorEvents() {
    return [
      {
        name: 'mouseout',
        cursor: 'default'
      },
      {
        name: 'mouseover',
        cursor: 'grab'
      },
      {
        name: 'dragmove',
        cursor: 'grabbing'
      },
      {
        name: 'dragend',
        cursor: 'default'
      }
    ]
  }

  /**
   * Creates the cropzone node
   */
  private createCropzone() {
    const group = new Konva.Group({
      x: this.options.x,
      y: this.options.y
    })

    const shapeOptions = {
      x: 0,
      y: 0,
      fill: 'transparent',
      dash: this.options.borderDash
    }

    if (this.options.circular) {
      group.add(
        new Konva.Circle({
          ...shapeOptions,
          radius: this.options.radius,
          stroke: this.options.circleBorderColor || this.options.borderColor,
          strokeWidth:
            this.options.circleBorderWidth || this.options.borderWidth,
          dash: this.options.circleBorderDash || this.options.borderDash
        })
      )
    } else {
      group.add(
        new Konva.Rect({
          ...shapeOptions,
          width: this.options.width,
          height: this.options.height,
          stroke: this.options.fixed ? this.options.borderColor : undefined,
          strokeWidth: this.options.fixed ? this.options.borderWidth : undefined
        })
      )
    }

    if (this.options.guides) {
      group.add(...this.createGuideLines())
    }

    this.getCursorEvents().forEach(({ name, cursor }) => {
      group.on(name, () => {
        this.board.stage.container().style.cursor = cursor
      })
    })

    return group
  }

  /**
   * Creates the guide lines of the cropzone
   */
  private createGuideLines() {
    const { guidesCount, guidesColor, guidesWidth, guidesDash } = this.options

    const lineConfig = {
      stroke: guidesColor,
      strokeWidth: guidesWidth,
      dash: guidesDash
    }

    if (this.options.circular) {
      return [
        new Konva.Line({
          points: [-this.options.radius, 0, this.options.radius, 0],
          ...lineConfig
        }),
        new Konva.Line({
          points: [0, -this.options.radius, 0, this.options.radius],
          ...lineConfig
        })
      ]
    }

    const { width, height } = this.options

    return Array.from({
      length: this.options.guidesCount
    }).flatMap((_, index) => {
      const wx = width / (guidesCount + 1)
      const x = wx + index * wx

      const wy = height / (guidesCount + 1)
      const y = wy + index * wy

      return [
        new Konva.Line({
          points: [x, 0, x, height],
          ...lineConfig
        }),
        new Konva.Line({
          points: [0, y, width, y],
          ...lineConfig
        })
      ]
    })
  }

  /**
   * Create the overlay node
   */
  private createOverlay() {
    return new Konva.Shape({
      x: 0,
      y: 0,
      opacity: this.options.overlayOpacity,
      width: this.board.stage.width(),
      height: this.board.stage.height()
    })
  }

  /**
   * Normalizes the cropping options
   *
   * @param options The [[CropperOptions]]
   */
  private createOptions(options: Partial<CropperOptions>) {
    const base = {
      circular: false,
      x: -1,
      y: -1,
      width: 0,
      height: 0,
      radius: 0,
      overlayOpacity: 0.5,
      borderWidth: 3,
      borderColor: '#fff',
      overlayColor: '#000',
      borderDash: options.fixed ? [0, 0] : [15, 10],
      keepRatio: true,
      fixed: false,
      aspectRatio: 1,
      anchorSize: 15,
      minWidth: 100,
      minHeight: 100,
      anchorColor: '#fff',
      anchorBorderColor: '#fff',
      anchorBorderWidth: 1,
      marginRatio: options.fixed ? 1 : 1.3,
      guides: true,
      guidesCount: 3,
      guidesColor: '#fff',
      guidesWidth: 1,
      guidesDash: [15, 10],
      circleBorderColor: '#fff',
      circleBorderWidth: 3,
      circleBorderDash: [0, 0],
      ...options
    }

    const borderSize = base.fixed ? base.borderWidth * 2 : base.anchorSize * 2

    if (options.circular) {
      const defaultRadius =
        (Math.min(this.board.stage.width(), this.board.stage.height()) -
          base.borderWidth * 2) /
        2

      const radius = options.radius || defaultRadius / base.marginRatio

      return {
        ...base,
        circular: true,
        radius,
        x:
          base.x >= Math.max(base.x, base.borderWidth)
            ? base.x
            : this.board.stage.width() / 2,
        y:
          base.y >= Math.max(base.y, base.borderWidth)
            ? base.y
            : this.board.stage.height() / 2
      }
    }

    const aspectRatio =
      base.aspectRatio || this.board.stage.width() / this.board.stage.height()

    let width =
      base.width || (this.board.stage.width() - borderSize) / base.marginRatio

    let height = base.height || width / aspectRatio

    if (height > this.board.stage.height() - borderSize) {
      height = this.board.stage.height() - borderSize
      width = height * aspectRatio
    }

    return {
      ...base,
      circular: false,
      aspectRatio,
      width,
      height,
      x:
        base.x >= 0
          ? Math.max(base.x, base.borderWidth)
          : (this.board.stage.width() - width) / 2,
      y:
        base.y >= 0
          ? Math.max(base.y, base.borderWidth)
          : (this.board.stage.height() - height) / 2
    }
  }

  /**
   * Setups the cropzone
   *
   * @virtual
   */
  protected abstract setupCropzone(): void

  /**
   * Setups the overlay
   *
   * @virtual
   */
  protected abstract setupOverlay(): void
}
