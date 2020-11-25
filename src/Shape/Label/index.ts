import Konva from 'konva'

import { convertHtmlToText } from '../../utils/html-to-text'

import { Board } from '../../Board'
import { Events } from '../../Events'
import { History } from '../../History'

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
  private label: Konva.Label

  /**
   *
   */
  private text: Konva.Text

  /**
   *
   */
  private tag: Konva.Tag

  constructor(board: Board, events: Events, history: History) {
    this.board = board
    this.events = events
    this.history = history
  }

  /**
   *
   */
  public async insert(config: Partial<Konva.LabelConfig> = {}) {
    this.label = new Konva.Label({
      ...config,
      draggable: true
    })

    this.tag = new Konva.Tag({
      fill: 'rgba(255, 99, 71, 0.95)',
      cornerRadius: 5
    })

    this.text = new Konva.Text({
      text: 'Hello',
      fontFamily: 'Arial',
      fontSize: 60,
      padding: 15,
      fill: 'black',
      align: 'left'
    })

    this.label.add(this.tag).add(this.text)

    this.label.on('dblclick', (e: Konva.KonvaEventObject<MouseEvent>) =>
      this.inlineEdit(e)
    )

    this.label.on('transform', () => {
      if (this.board.selection.transformer.getActiveAnchor() === 'rotater') {
        return
      }

      this.text.setAttrs({
        width: this.label.width() * this.label.scaleX(),
        scaleX: this.label.scaleY()
      })
    })

    return this.board.addShape(this.label, {
      centeredScaling: false,
      enabledAnchors: ['middle-left', 'middle-right']
    })
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

    this.board.layer.draw()
  }

  /**
   *
   */
  private inlineEdit(e: Konva.KonvaEventObject<MouseEvent>) {
    const position = e.target.absolutePosition()
    const textBeforeEdit = this.text.getAttr('text')

    this.text.hide()
    this.tag.hide()
    this.label?.draggable(false)
    this.board.selection.transformer.hide()

    this.board.layer.draw()

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

      const text = convertHtmlToText((<HTMLSpanElement>e.target).innerHTML)

      if (text !== textBeforeEdit) {
        this.history.create(this.board.layer, [], {
          undo: () => this.updateText(textBeforeEdit),
          redo: () => this.updateText(text)
        })
      }

      this.updateText(text)
      this.label.draggable(true)

      this.text.show()
      this.tag.show()
      this.board.selection.transformer.show()
      this.board.layer.batchDraw()
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
}
