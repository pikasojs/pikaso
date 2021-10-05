import Konva from 'konva'

import { convertDegreeToRadian } from '../utils/degree-to-radian'
import { rotateAroundCenter } from '../utils/rotate-around-center'
import { getRotatedPoint } from '../utils/get-rotated-point'

import { Board } from '../Board'

export class Rotation {
  /**
   * Represents the [[Board]]
   */
  private readonly board: Board

  /**
   * Rotates shapes and background
   *
   * @example
   * ```ts
   * editor.rotation.transform(30)
   * ```
   *
   * @example
   * ```ts
   * editor.rotation.straighten(-30)
   * ```
   *
   * @param board The [[Board]]
   */
  constructor(board: Board) {
    this.board = board
  }

  /**
   * Rotates the board with its shapes around their center
   * with scaling and transforming
   *
   * @param theta The rotation angle
   *
   * @example
   * ```ts
   * editor.rotation.transform(30)
   * ```
   */
  public transform(theta: number) {
    this.board.history.create(this.board.stage, [
      this.board.stage,
      ...this.board.getNodes()
    ])

    const radian = convertDegreeToRadian(Number(theta))

    const { width, height } = this.board.getDimensions()

    const rcos = Math.abs(Math.cos(radian))
    const rsin = Math.abs(Math.sin(radian))

    const scaledWidth = width * rcos + height * rsin
    const scaledHeight = height * rcos + width * rsin

    // stage's height is fixed and width is changing based on the ratio
    const stageHeight = height
    const stageWidth = (height / scaledHeight) * scaledWidth
    const stageScale = stageWidth / scaledWidth

    // find the new center point
    const center = getRotatedPoint(
      {
        x: (width * stageScale) / 2,
        y: (height * stageScale) / 2
      },
      radian
    )

    this.board.stage.setAttrs({
      width: stageWidth,
      height: stageHeight
    })

    this.board.background.nodes.forEach((node: Konva.Shape) => {
      node
        .scale({
          x: stageScale,
          y: stageScale
        })
        .rotation(Number(theta))
        .x(stageWidth / 2 - center.x)
        .y(stageHeight / 2 - center.y)
    })

    this.board.activeShapes.forEach(shape => {
      const scaleX = shape.node.attrs.originalScaleX ?? shape.node.scaleX()
      const scaleY = shape.node.attrs.originalScaleY ?? shape.node.scaleY()
      const x = shape.node.attrs.originalX ?? shape.node.x()
      const y = shape.node.attrs.originalY ?? shape.node.y()

      console.log(shape.node.attrs.originalX)

      const center = getRotatedPoint(
        {
          x,
          y
        },
        convertDegreeToRadian(theta)
      )

      shape.node.setAttrs({
        originalX: x,
        originalY: y,
        originalScaleX: scaleX,
        originalScaleY: scaleY,
        rotation: Number(theta),
        x: center.x * stageScale + this.board.background.getPosition().x,
        y: center.y * stageScale + this.board.background.getPosition().y,
        scaleX: scaleX * stageScale,
        scaleY: scaleY * stageScale
      })
    })

    this.board.events.emit('rotation:transform')
  }

  /**
   * Rotates the board with its shapes around their center without transforming
   * @param theta The rotation angle
   *
   * @example
   * ```
   * editor.rotation.straighten(30)
   * ```
   *
   * @example
   * ```
   * editor.rotation.straighten(-50)
   * ```
   */
  public straighten(theta: number) {
    this.board.background.nodes.forEach((node: Konva.Shape) => {
      rotateAroundCenter(node, theta)
    })

    this.board.activeShapes.forEach(shape => {
      shape.rotate(theta)
    })

    this.board.events.emit('rotation:straighten')
  }
}
