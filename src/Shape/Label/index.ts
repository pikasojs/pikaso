import Konva from 'konva'

import { convertHtmlToText } from '../../utils/html-to-text'

import { DrawType } from '../../types'

import { Board } from '../../Board'
import { Events } from '../../Events'
import { History } from '../../History'
import { Shape } from '..'

export class Label {
  /**
   *
   */
  private readonly board: Board

  /**
   *
   */
  private readonly events: Events

  /**
   *
   */
  private readonly history: History

  /**
   *
   */
  private shape: Shape

  /**
   *
   */
  private label: Konva.Label

  constructor(board: Board, events: Events, history: History) {
    this.board = board
    this.events = events
    this.history = history
  }

  /**
   *
   */
  public get text() {
    return this.label.getText() as Konva.Text
  }

  /**
   *
   */
  public get tag() {
    return this.label.getTag() as Konva.Tag
  }

  /**
   *
   */
  public insert(config: {
    container: Konva.LabelConfig
    text: Konva.TextConfig
    tag?: Konva.TagConfig
  }) {
    this.label = new Konva.Label({
      ...config.container,
      draggable: true
    })

    const text = new Konva.Text(config.text)
    const tag = new Konva.Tag(config.tag)

    text.setAttr('height', 'auto')

    this.label.add(tag).add(text)

    this.label.on('dblclick', this.inlineEdit.bind(this))
    this.label.on('transform', this.transform.bind(this))

    this.shape = this.board.addShape(this.label, {
      centeredScaling: false,
      enabledAnchors: ['middle-left', 'middle-right']
    })

    return this.shape
  }

  /**
   *
   * @param value
   */
  public updateText(value: string) {
    this.text.setAttrs({
      text: value
    })

    this.label.setAttrs({
      width: this.text.width()
    })

    if (this.board.selection.isVisible) {
      this.board.selection.transformer.forceUpdate()
    }

    this.board.layer.draw()

    this.events.emit('label:update-text', {
      shapes: [this.shape],
      data: {
        text: value
      }
    })
  }

  /**
   *
   */
  private inlineEdit(e: Konva.KonvaEventObject<MouseEvent>) {
    if (this.label.isCached()) {
      return
    }

    this.board.setActiveDrawing(DrawType.Text)

    const position = e.target.absolutePosition()
    const textBeforeEdit = this.text.getAttr('text')

    // hide node
    this.label.hide()
    this.label?.draggable(false)

    // deselect all selected nodes
    this.board.selection.deselectAll()

    this.board.draw()

    const input = document.createElement('span')
    this.board.container.getElementsByClassName('pikaso')[0].append(input)

    this.setInputFocus(input)

    input.setAttribute('contenteditable', '')
    input.setAttribute('role', 'textbox')
    input.innerText = this.text.getAttr('text')

    Object.assign(input.style, {
      position: 'absolute',
      display: 'inline-block',
      left: `${position.x - this.text.padding()}px`,
      top: `${position.y - this.text.padding()}px`,
      width: `${this.text.width() * this.label.scaleX()}px`,
      minWidth: `${this.text.padding() * 2}px`,
      maxWidth: `${this.text.width() * this.label.scaleX()}px`,
      minHeight: `${this.text.height() * this.label.scaleY()}px`,
      fontSize: `${this.text.fontSize() * this.label.scaleY()}px`,
      border: 'none',
      padding: `${this.text.padding()}px`,
      margin: `${this.text.padding()}px`,
      overflow: 'hidden',
      background: this.tag.fill(),
      borderRadius: `${this.tag.cornerRadius()}px`,
      outline: 'none',
      resize: 'none',
      lineHeight: this.text.lineHeight(),
      fontFamily: this.text.fontFamily(),
      transformOrigin: 'left top',
      textAlign: this.text.align(),
      color: this.text.fill(),
      transform: `${input.style.transform} rotateZ(${this.label.rotation()}deg)`
    })

    /**
     *
     */
    input.addEventListener('blur', (e: Event) => {
      input.parentNode?.removeChild(input)

      this.board.setActiveDrawing(null)

      const newText = convertHtmlToText((<HTMLSpanElement>e.target).innerHTML)

      if (newText !== textBeforeEdit) {
        this.history.create(this.board.layer, [], {
          undo: () => this.updateText(textBeforeEdit),
          redo: () => this.updateText(newText)
        })
      }

      // update label's text
      this.text.setText(newText)

      this.label.show()
      this.label.setAttrs({
        draggable: true,
        width: this.text.width()
      })

      // select node
      this.board.selection.add(this.shape)

      this.board.draw()
    })
  }

  /**
   *
   * @param input
   */
  private async setInputFocus(input: HTMLSpanElement) {
    await new Promise(resolve => setTimeout(resolve, 50))

    const range = document.createRange()
    range.selectNodeContents(input)
    range.collapse(false)

    const selection = window.getSelection()!
    selection.removeAllRanges()
    selection.addRange(range)
  }

  /**
   *
   */
  private transform() {
    if (this.board.selection.transformer.getActiveAnchor() === 'rotater') {
      return
    }

    this.text.setAttrs({
      width: this.label.width() * this.label.scaleX(),
      scaleX: this.label.scaleY()
    })

    this.label.scaleX(this.text.scaleY())
    this.tag.scaleX(this.label.scaleY())
  }
}
