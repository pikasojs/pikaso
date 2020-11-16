import Konva from 'konva'

import { Board } from './Board'
import { Events } from './Events'
import { History } from './History'

import { Flip } from './Flip'
import { Cropper } from './Cropper'
import { Rotation } from './Rotation'
import { Selection } from './Selection'
import { Pencil } from './Pencil'

import { Line } from './Shape/Line'
import { Rect } from './Shape/Rect'
import { Arrow } from './Shape/Arrow'
import { Label } from './Shape/Label'
import { Image } from './Shape/Image'
import { Circle } from './Shape/Circle'
import { Ellipse } from './Shape/Ellipse'
import { Polygon } from './Shape/Polygon'
import { Triangle } from './Shape/Triangle'

import type { Settings, Shapes } from './types'

export class Pikaso {
  /**
   *
   */
  public readonly board: Board

  /**
   *
   */
  public readonly shapes: Shapes

  /**
   *
   */
  public readonly selection: Selection

  /**
   *
   */
  public readonly rotation: Rotation

  /**
   *
   */
  public readonly cropper: Cropper

  /**
   *
   */
  public readonly flip: Flip

  /**
   *
   */
  public readonly pencil: Pencil

  /**
   *
   */
  private readonly settings: Settings

  /**
   *
   */
  private readonly events: Events

  /**
   *
   */
  private readonly history: History

  constructor(settings: Settings) {
    if (!settings.container) {
      throw new Error('Pikaso needs a container')
    }

    const history = new History()
    const events = new Events()
    const board = new Board(settings, events, history)

    this.rotation = new Rotation(board, events, history)
    this.cropper = new Cropper(board, events, history)
    this.flip = new Flip(board, events, history)
    this.pencil = new Pencil(board, events, history)
    this.selection = new Selection(board, events, history)

    this.shapes = {
      line: new Line(board, events, history),
      rect: new Rect(board, events, history),
      arrow: new Arrow(board, events, history),
      image: new Image(board, events, history),
      label: new Label(board, events, history),
      circle: new Circle(board, events, history),
      ellipse: new Ellipse(board, events, history),
      polygon: new Polygon(board, events, history),
      triangle: new Triangle(board, events, history)
    }

    this.board = board
    this.events = events
    this.history = history
    this.settings = settings

    this.board.layer.draw()
  }

  /**
   *
   */
  public get Konva() {
    return Konva
  }

  /**
   *
   */
  public async loadFromFile(file: File) {
    await this.board.setBackgroundImageFromFile(file)
  }

  /**
   *
   */
  public async loadFromUrl(url: string) {
    await this.board.setBackgroundImageFromUrl(url)
  }

  /**
   *
   */
  public rescale() {
    this.board.rescale()
  }

  /**
   *
   */
  public undo() {
    this.history.undo()
  }

  /**
   *
   */
  public redo() {
    this.history.redo()
  }
}
