import Konva from 'konva'

import { omit } from '../utils/omit'

import { Board } from '../Board'
import { ShapeModel } from '../shape/ShapeModel'

import type { JsonData, BaseShapes } from '../types'

/**
 * @internal
 */
export class Import {
  /**
   * Represents the [[Board]]
   */
  private readonly board: Board

  /**
   * Represents the [[ShapeModel | Shapes]]
   */
  private readonly shapes: BaseShapes

  constructor(board: Board, shapes: BaseShapes) {
    this.board = board
    this.shapes = shapes
  }

  /**
   * Loads the given JSON object
   *
   * @param data The [[JsonData | data]]
   */
  public async json({ stage, layer, background, shapes }: JsonData) {
    this.board.background.overlay.update(background.overlay)

    if (background.image.attrs.url) {
      await this.board.background.setImageFromUrl(
        background.image.attrs.url as string
      )

      this.board.background.image.update(omit(background.image.attrs, ['url']))
    }

    // update layer attributes
    this.board.layer.setAttrs(omit(layer.attrs, ['width', 'height']))

    // update stage attributes
    this.board.stage.setAttrs(stage.attrs)

    // create groups instances
    shapes.forEach(json => {
      if (json.className === 'Group') {
        this.board.groups.create(json.attrs.name, json.attrs)
      }
    })

    // create shape instances
    await Promise.all(
      shapes.map(async json => {
        let instance: ShapeModel | undefined

        switch (json.className) {
          case 'Image':
            instance = await this.shapes.image.insert(
              json.attrs.url as string,
              omit(json.attrs, ['url'])
            )
            break

          case 'Label':
            instance = this.shapes.label.insert({
              container: json.attrs as Konva.LabelConfig,
              tag: json.children![0].attrs as Konva.TagConfig,
              text: json.children![1].attrs as Konva.TextConfig
            })
            break

          case 'Line':
            instance = this.shapes.line.insert(json.attrs as Konva.LineConfig)
            break

          case 'Arrow':
            instance = this.shapes.arrow.insert(json.attrs as Konva.ArrowConfig)
            break

          case 'Circle':
            instance = this.shapes.circle.insert(
              json.attrs as Konva.CircleConfig
            )
            break

          case 'Ellipse':
            instance = this.shapes.ellipse.insert(
              json.attrs as Konva.EllipseConfig
            )
            break

          case 'RegularPolygon':
            instance = this.shapes.polygon.insert(
              json.attrs as Konva.RegularPolygonConfig
            )
            break

          case 'Rect':
            instance = this.shapes.rect.insert(json.attrs as Konva.RectConfig)
            break

          case 'Path':
            instance = this.shapes.svg.insert(json.attrs as Konva.PathConfig)
            break

          case 'Group':
            instance = this.board.groups.find(json.attrs.name)?.container
            break
        }

        if (instance) {
          instance.group = json.group
        }

        if (
          instance &&
          Array.isArray(json.filters) &&
          json.filters?.length > 0
        ) {
          json.filters.forEach((name: keyof typeof Konva.Filters) => {
            instance!.node.filters([
              ...(instance?.node.filters() || []),
              Konva.Filters[name]
            ])
          })

          instance.node.cache()
        }
      })
    )
  }
}
