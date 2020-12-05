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

import type {
  Settings,
  EventListenerNames,
  ListenerCallback,
  Shapes
} from './types'

/**
 * This is the main class and entry point that creates a new editor instance
 * @see [[constructor]]
 */
export default class Pikaso {
  /**
   * Represents the board
   * @see [[Board | Board Class]]
   */
  public board: Board

  /**
   * Represents exporting
   * It lets export the active workstation to different formats
   * @see [[Export | Export Class]]
   */
  public export: Export

  /**
   * Represents shapes
   * @see [[Shapes | Shapes Interface]] for the supported shape types
   */
  public shapes: Shapes

  /**
   * Represents selection
   *
   * Shortcut to [[Board.selection]]
   * @see [[Selection | Selection Class]]
   */
  public selection: Selection

  /**
   * Represents board rotation
   * @see [[Rotation | Rotation Class]]
   */
  public rotation: Rotation

  /**
   * Represents cropping
   * @see [[Cropper | Cropper Class]]
   */
  public cropper: Cropper

  /**
   * Represents flipping
   * @see [[Flip | Flip Class]]
   */
  public flip: Flip

  /**
   * Represents free drawing
   * @see [[Pencil | Pencil Class]]
   */
  public pencil: Pencil

  /**
   * Represents the event manager
   *
   * This is also possible to Subscribe and Unsubscribe events
   * with [[on | on method]] and [[off | off method]] of the main class
   *
   * @see [[Events]]
   * @see list of listeneres: [[EventListenerNames]]
   */
  public events: Events

  /**
   * Represents the actions history
   * @see [[History | History Class]]
   */
  public history: History

  /**
   * Represents settings
   */
  private settings: Settings

  /**
   * It creates a new editor instance
   *
   * @param settings - The editor settings
   *
   * @example
   * ```ts
   * const editor = new Pikaso({
   *   container: document.getElementById('myDiv') as HTMLDivElement
   * })
   * ```
   * @public
   */
  constructor(settings: Settings) {
    if (!settings.container) {
      throw new Error('It needs to have a container element')
    }

    this.settings = settings

    this.init()
  }

  /**
   * @returns The Konva library
   */
  public get Konva() {
    return Konva
  }

  /**
   * Loads the background image from url
   * This method is a shortcut to [[Background.setImageFromFile]]
   *
   * @param file - The image file
   */
  public async loadFromFile(file: File) {
    await this.board.background.setImageFromFile(file)
  }

  /**
   * Loads the background image from url
   * This method is a shortcut to [[Background.setImageFromUrl]]
   *
   * @param url - The image url
   */
  public async loadFromUrl(url: string) {
    await this.board.background.setImageFromUrl(url)
  }

  /**
   * Resizes the board based on the new container size
   *
   * This method is a shortcut to [[Board.rescale]]
   *
   * @remarks
   * This method can be used with resize event of window to rescale the board
   *
   * @example
   *
   * ```ts
   * const editor = new Pikaso({
   *   container: document.getElementById('myDiv') as HTMLDivElement
   * })
   *
   * window.addEventListener('resize', () => {
   *  editor.board.rescale()
   * })
   * ```
   */
  public rescale() {
    this.board.rescale()
  }

  /**
   * Reverses the last action
   */
  public undo() {
    this.history.undo()
  }

  /**
   * Reverses the last [[undo]]
   */
  public redo() {
    this.history.redo()
  }

  /**
   * Subscribes to one or multiple events
   *
   * This method is a shortcut to [[Events.on]]
   */
  public on(
    name: EventListenerNames | EventListenerNames[],
    callback: ListenerCallback
  ) {
    this.events.on(name, callback)
  }

  /**
   * UnSubscribes from one or multiple events
   *
   * This method is a shortcut to [[Events.off]]
   */
  public off(
    name: EventListenerNames | EventListenerNames[],
    callback: ListenerCallback
  ) {
    this.events.off(name, callback)
  }

  /**
   * Resets everything and reinitializes the editor
   */
  public reset() {
    this.init()
    this.events.emit('history:reset')
  }

  /**
   * Initializes the editor
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
    this.pencil = new Pencil(board, events)

    this.shapes = {
      image: new Image(board),
      line: new Line(board, events),
      rect: new Rect(board, events),
      arrow: new Arrow(board, events),
      circle: new Circle(board, events),
      polygon: new Polygon(board, events),
      ellipse: new Ellipse(board, events),
      triangle: new Triangle(board, events),
      label: new Label(board, events, history)
    }

    this.board = board
    this.events = events
    this.history = history

    this.board.draw()
  }
}
