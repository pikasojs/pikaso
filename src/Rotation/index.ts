import Konva from 'konva'

import { convertDegreeToRadian } from '../utils/degree-to-radian'
import { rotateAroundCenter } from '../utils/rotate-around-center'

import { Board } from '../Board'
import { History } from '../History'
import { Events } from '../Events'

import { getRotatedPoint } from '../utils/get-rotated-point'

export class Rotation {
  /**
   *
   */
  private readonly board: Board

  /**
   *
   */
  private readonly history: History

  /**
   *
   */
  private events: Events

  constructor(board: Board, events: Events, history: History) {
    this.board = board
    this.events = events
    this.history = history
  }

  /**
   * rotates the image around its center with scaling and transforming
   *
   * Or you can use:
   * ```typescript
   * instance.rotation.transform(30)
   * ```
   * @param theta - the rotation angle
   */
  public transform(theta: number) {
    this.history.create(this.board.stage, [
      this.history.getNodeState(this.board.stage),
      ...this.board.getBackgroundNodes().map(this.history.getNodeState),
      ...this.board
        .getShapes()
        .map(shape => this.history.getNodeState(shape.node))
    ])

    const radian = convertDegreeToRadian(theta)

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

    this.board.getBackgroundNodes().forEach((node: Konva.Shape) => {
      node
        .scale({
          x: stageScale,
          y: stageScale
        })
        .rotation(theta)
        .x(stageWidth / 2 - center.x)
        .y(stageHeight / 2 - center.y)
    })

    this.board.getShapes().forEach(shape => {
      if (shape.node.rotation() === theta) {
        return
      }

      const center = getRotatedPoint(
        {
          x: shape.node.x(),
          y: shape.node.y()
        },
        convertDegreeToRadian(theta)
      )

      shape.node.setAttrs({
        rotation: shape.node.rotation() + theta,
        x: center.x * stageScale + this.board.getPosition().x,
        y: center.y * stageScale + this.board.getPosition().y,
        scale: {
          x: shape.node.scaleX() * stageScale,
          y: shape.node.scaleY() * stageScale
        }
      })
    })

    this.board.layer.batchDraw()

    // this.events.emit('rotation:transformed', {})
  }

  /**
   * rotates the image around its center without transforming
   * @param theta - the rotation angle
   */
  public straighten(theta: number) {
    this.board.getBackgroundNodes().forEach((node: Konva.Shape) => {
      rotateAroundCenter(node, theta)
    })

    this.board.getShapes().forEach(shape => {
      rotateAroundCenter(shape.node, theta)
    })

    this.board.layer.batchDraw()
  }
}
