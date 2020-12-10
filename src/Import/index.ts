import Konva from 'konva'

import { omit } from '../utils/omit'

import { Board } from '../Board'
import { Shape } from '../Shape'

import type { JsonData, Shapes } from '../types'

/**
 * @internal
 */
export class Import {
  /**
   * Represents the [[Board]]
   */
  private readonly board: Board

  /**
   * Represents the [[Shapes]]
   */
  private readonly shapes: Shapes

  constructor(board: Board, shapes: Shapes) {
    this.board = board
    this.shapes = shapes
  }

  /**
   * Loads the given JSON object
   *
   * @param data The [[JsonData | data]]
   */
  public async json({ stage, layer, background, shapes }: JsonData) {
    this.board.background.overlay.setAttrs(background.overlay)

    if (background.image.attrs.url) {
      await this.board.background.setImageFromUrl(
        background.image.attrs.url as string
      )

      this.board.background.image.setAttrs(
        omit(background.image.attrs, ['url'])
      )
    }

    this.board.stage.setAttrs(stage.attrs)
    this.board.layer.setAttrs(layer.attrs)

    await Promise.all(
      shapes.map(async shape => {
        let instance: Shape | undefined

        switch (shape.className) {
          case 'Image':
            instance = await this.shapes.image.insert(
              shape.attrs.url as string,
              omit(shape.attrs, ['url'])
            )
            break

          case 'Label':
            instance = this.shapes.label.insert({
              container: shape.attrs as Konva.LabelConfig,
              tag: shape.children![0].attrs as Konva.TagConfig,
              text: shape.children![1].attrs as Konva.TextConfig
            })
            break

          case 'Line':
            instance = this.shapes.line.insert(shape.attrs as Konva.LineConfig)
            break

          case 'Arrow':
            instance = this.shapes.arrow.insert(
              shape.attrs as Konva.ArrowConfig
            )
            break

          case 'Circle':
            instance = this.shapes.circle.insert(
              shape.attrs as Konva.CircleConfig
            )
            break

          case 'Ellipse':
            instance = this.shapes.ellipse.insert(
              shape.attrs as Konva.EllipseConfig
            )
            break

          case 'RegularPolygon':
            instance = this.shapes.polygon.insert(
              shape.attrs as Konva.RegularPolygonConfig
            )
            break

          case 'Rect':
            instance = this.shapes.rect.insert(shape.attrs as Konva.RectConfig)
            break
        }

        if (Array.isArray(shape.filters)) {
          shape.filters.forEach((name: keyof typeof Konva.Filters) => {
            instance!.node.filters([
              ...(instance?.node.filters() || []),
              Konva.Filters[name]
            ])
          })

          instance!.node.cache()
        }
      })
    )

    this.board.stage.draw()
  }
}
