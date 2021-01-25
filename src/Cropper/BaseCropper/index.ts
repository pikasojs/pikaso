import Konva from 'konva'

import { Board } from '../../Board'

import type {
  CircularCropperOptions,
  CropperOptions,
  RectangleCropperOptions
} from '../../types'

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

    this.options = <CropperOptions>this.createOptions(options)

    this.layer = new Konva.Layer()

    /**
     * creates the background to fade the underlay image
     */
    const background = new Konva.Rect({
      fill: this.options.overlay.color,
      opacity: this.options.overlay.opacity,
      width: this.board.stage.width(),
      height: this.board.stage.height()
    })

    /**
     * creates the overlay
     * it updates with cropzone moving to display the visible area
     */
    this.overlay = this.createOverlay()

    /**
     * creates the movable cropzone area
     */
    this.cropzone = this.createCropzone()

    this.layer.add(background, this.overlay, this.cropzone)
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
      dash: this.options.transformer.borderDash
    }

    if (this.options.circular) {
      group.add(
        new Konva.Circle({
          ...shapeOptions,
          radius: this.options.radius,
          stroke:
            this.options.circle?.borderStroke ??
            this.options.transformer.borderStroke,
          strokeWidth:
            this.options.circle?.borderStrokeWidth ??
            this.options.transformer.borderStrokeWidth,
          dash:
            this.options.circle?.borderDash ??
            this.options.transformer.borderDash
        })
      )
    } else {
      group.add(
        new Konva.Rect({
          ...shapeOptions,
          width: this.options.width,
          height: this.options.height,
          stroke: this.options.fixed
            ? this.options.transformer.borderStroke
            : undefined,
          strokeWidth: this.options.fixed
            ? this.options.transformer.borderStrokeWidth
            : undefined
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
    const { guides } = this.options

    const lineConfig = {
      stroke: guides.color,
      strokeWidth: guides.width,
      dash: guides.dash
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
      length: guides.count
    }).flatMap((_, index) => {
      const wx = width / (guides.count + 1)
      const x = wx + index * wx

      const wy = height / (guides.count + 1)
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
    return new Konva.Rect({
      x: 0,
      y: 0,
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
    const base: Partial<CropperOptions> = {
      ...this.board.settings.cropper,
      transformer: {
        ...this.board.settings.transformer,
        ...this.board.settings.cropper?.transformer,
        ...options.transformer
      },
      ...options
    }

    // console.log(this.board.settings.cropper?.transformer)

    if (options.circular) {
      return {
        circular: true,
        ...base,
        ...this.getCircularCropperOptions(base as CircularCropperOptions)
      }
    }

    return {
      circular: false,
      ...base,
      ...this.getRectangularCropperOptions(base as RectangleCropperOptions)
    }
  }

  /**
   * Calculates options of circular cropper
   *
   * @returns The calculated options
   * @param options The circular cropper options
   */
  private getCircularCropperOptions(
    options: Partial<CircularCropperOptions>
  ): Partial<CircularCropperOptions> {
    const borderWidth = options.transformer?.borderStrokeWidth!

    const defaultRadius =
      (Math.min(this.board.stage.width(), this.board.stage.height()) -
        borderWidth * 2) /
      2

    const baseX = options.x ?? -1
    const baseY = options.y ?? -1

    return {
      radius: options.radius ?? defaultRadius / options.marginRatio!,
      x:
        baseX >= Math.max(baseX, borderWidth)
          ? baseX
          : this.board.stage.width() / 2,
      y:
        baseY >= Math.max(baseY, borderWidth)
          ? baseY
          : this.board.stage.height() / 2
    }
  }

  /**
   * Calculates options of rectangular cropper
   *
   * @returns The calculated options
   * @param options The rectangular cropper options
   */
  private getRectangularCropperOptions(
    options: Partial<RectangleCropperOptions>
  ): Partial<RectangleCropperOptions> {
    const borderWidth = options.transformer?.borderStrokeWidth!

    const borderSize = options.fixed
      ? borderWidth * 2
      : options.transformer?.anchorSize! * 2

    const aspectRatio =
      options.aspectRatio ||
      this.board.stage.width() / this.board.stage.height()

    let width =
      options.width ||
      (this.board.stage.width() - borderSize) / options.marginRatio!

    let height = options.height || width / aspectRatio

    if (height > this.board.stage.height() - borderSize) {
      height = this.board.stage.height() - borderSize
      width = height * aspectRatio
    }

    const baseX = options.x ?? -1
    const baseY = options.y ?? -1

    return {
      aspectRatio,
      width,
      height,
      x:
        baseX >= 0
          ? Math.max(baseX, borderWidth)
          : (this.board.stage.width() - width) / 2,
      y:
        baseY >= 0
          ? Math.max(baseY, borderWidth)
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
