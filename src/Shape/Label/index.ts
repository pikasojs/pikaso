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

  constructor(board: Board, events: Events, history: History) {
    this.board = board
    this.events = events
    this.history = history
  }

  /**
   *
   */
  public async insert(config: Partial<Konva.LabelConfig> = {}) {
    const label = new Konva.Label({
      ...config,
      draggable: true
    })

    const tag = new Konva.Tag({
      fill: 'rgba(255, 99, 71, 0.95)',
      cornerRadius: 5
    })

    const text = new Konva.Text({
      text: 'Hello',
      fontFamily: 'Arial',
      fontSize: 60,
      padding: 15,
      fill: 'black',
      align: 'left'
    })

    label.add(tag).add(text)

    label.on('dblclick', (e: Konva.KonvaEventObject<MouseEvent>) =>
      this.inlineEdit(e, label, text, tag)
    )

    label.on('transform', () => {
      if (this.board.selection.transformer.getActiveAnchor() === 'rotater') {
        return
      }

      text.setAttrs({
        width: label.width() * label.scaleX(),
        scaleX: label.scaleY()
      })
    })

    return this.board.addShape(label, {
      centeredScaling: false,
      enabledAnchors: ['middle-left', 'middle-right']
    })
  }

  /**
   *
   */
  private inlineEdit(
    e: Konva.KonvaEventObject<MouseEvent>,
    labelNode: Konva.Label,
    textNode: Konva.Text,
    tagNode: Konva.Tag
  ) {
    const position = e.target.absolutePosition()

    textNode.hide()
    tagNode.hide()
    labelNode?.draggable(false)
    this.board.selection.transformer.hide()

    this.board.layer.draw()

    const input = document.createElement('span')
    this.board.container.getElementsByClassName('pikaso')[0].append(input)

    this.setInputFocus(input)

    input.setAttribute('contenteditable', '')
    input.setAttribute('role', 'textbox')
    input.innerText = textNode.text()

    Object.assign(input.style, {
      position: 'absolute',
      display: 'inline-block',
      left: `${position.x - textNode.padding()}px`,
      top: `${position.y - textNode.padding()}px`,
      width: `${textNode.width() * labelNode.scaleX()}px`,
      minWidth: `${textNode.padding() * 2}px`,
      maxWidth: `${textNode.width() * labelNode.scaleX()}px`,
      minHeight: `${textNode.height() * labelNode.scaleY()}px`,
      fontSize: `${textNode.fontSize() * labelNode.scaleY()}px`,
      border: 'none',
      padding: `${textNode.padding()}px`,
      margin: `${textNode.padding()}px`,
      overflow: 'hidden',
      background: tagNode.fill(),
      borderRadius: `${tagNode.cornerRadius()}px`,
      outline: 'none',
      resize: 'none',
      lineHeight: textNode.lineHeight(),
      fontFamily: textNode.fontFamily(),
      transformOrigin: 'left top',
      textAlign: textNode.align(),
      color: textNode.fill(),
      transform: `${input.style.transform} rotateZ(${labelNode.rotation()}deg)`
    })

    /**
     *
     */
    input.addEventListener('blur', (e: Event) => {
      input.parentNode?.removeChild(input)

      const text = convertHtmlToText((<HTMLSpanElement>e.target).innerHTML)
      textNode.text(text)
      labelNode.width(textNode.width())
      labelNode.draggable(true)

      this.board.selection.transformer.show()
      textNode.show()
      tagNode.show()

      this.board.layer.draw()
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
