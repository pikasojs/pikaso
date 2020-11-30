import Konva from 'konva'

import { Board } from './Board'
import { Events } from './Events'
import { History } from './History'
import { Export } from './Export'

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

export { Konva }
export default class Pikaso {
  /**
   *
   */
  public board: Board

  /**
   *
   */
  public export: Export

  /**
   *
   */
  public shapes: Shapes

  /**
   *
   */
  public selection: Selection

  /**
   *
   */
  public rotation: Rotation

  /**
   *
   */
  public cropper: Cropper

  /**
   *
   */
  public flip: Flip

  /**
   *
   */
  public pencil: Pencil

  /**
   *
   */
  public events: Events

  /**
   *
   */
  public history: History

  /**
   *
   */
  private settings: Settings

  constructor(settings: Settings) {
    if (!settings.container) {
      throw new Error('Pikaso needs a container')
    }

    this.settings = settings

    this.init()
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
    await this.board.background.setImageFromFile(file)
  }

  /**
   *
   */
  public async loadFromUrl(url: string) {
    await this.board.background.setImageFromUrl(url)
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

  /**
   *
   */
  public on(...args: Parameters<this['events']['on']>) {
    this.events.on.call(this.events, ...args)
  }

  /**
   *
   */
  public off(...args: Parameters<this['events']['off']>) {
    this.events.off.call(this.events, ...args)
  }

  /**
   *
   */
  public reset() {
    this.init()
    this.events.emit('history:reset')
  }

  /**
   *
   */
  private init() {
    const events = new Events()
    const history = new History(events)
    const board = new Board(this.settings, events, history)

    this.selection = board.selection

    this.export = new Export(board)
    this.rotation = new Rotation(board, events, history)
    this.cropper = new Cropper(board, events, history)
    this.flip = new Flip(board, events, history)
    this.pencil = new Pencil(board, events, history)

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

    this.board.layer.draw()
  }
}
