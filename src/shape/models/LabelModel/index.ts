import Konva from 'konva'

import { convertHtmlToText } from '../../../utils/html-to-text'

import { Board } from '../../../Board'
import { ShapeModel } from '../../ShapeModel'

import { DrawType, ShapeConfig, Shapes } from '../../../types'

export class LabelModel extends ShapeModel<Konva.Label, Konva.LabelConfig> {
  constructor(board: Board, node: Konva.Label, config: ShapeConfig = {}) {
    super(board, node, config)

    node.on('transform', this.transform.bind(this))
    node.on('dblclick', this.inlineEdit.bind(this))
  }

  /**
   * @inheritdoc
   */
  public get type(): keyof Shapes {
    return 'label'
  }

  /**
   * Returns the text node of the label
   */
  public get text() {
    return this.node.getText() as Konva.Text
  }

  /**
   * Returns the tag node of the label
   */
  public get tag() {
    return this.node.getTag() as Konva.Tag
  }

  /**
   * Updates attributes of the label's tag
   *
   * @param attributes The list of attributes
   * @param options The options of updading attributes
   */
  public updateTag(attributes: Partial<Konva.TagConfig>) {
    this.board.history.create(this.board.layer, this.tag)
    this.tag.setAttrs(attributes)

    this.board.draw()
  }

  /**
   * Updates attributes of the label's tag
   *
   * @param attributes The list of attributes
   * @param options The options of updading attributes
   */
  public updateText(attributes: Partial<Konva.TextConfig>) {
    this.board.history.create(this.board.layer, this.text)
    this.text.setAttrs(attributes)

    this.board.draw()
  }

  /**
   * Controls transforming the label
   * This function rescales the text node and label node
   * to avoid from stretching that
   */
  private transform() {
    if (this.board.selection.transformer.getActiveAnchor() === 'rotater') {
      return
    }

    this.text.setAttrs({
      width: this.node.width() * this.node.scaleX(),
      scaleX: this.node.scaleY()
    })

    this.node.scaleX(this.text.scaleY())
    this.tag.scaleX(this.node.scaleY())
  }

  /**
   * Enables inline editing of the label with double clicking on the node
   *
   * @param e The [[MouseEvent | Mouse Event]
   */
  private inlineEdit(e: Konva.KonvaEventObject<MouseEvent>) {
    if (this.node.isCached()) {
      return
    }

    this.board.setActiveDrawing(DrawType.Text)

    const position = e.target.absolutePosition()
    const textBeforeEdit = this.text.getAttr('text')

    // hide node
    this.node.hide()
    this.node?.draggable(false)

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
      width: `${this.text.width() * this.node.scaleX()}px`,
      minWidth: `${this.text.padding() * 2}px`,
      maxWidth: `${this.text.width() * this.node.scaleX()}px`,
      minHeight: `${this.text.height() * this.node.scaleY()}px`,
      fontSize: `${this.text.fontSize() * this.node.scaleY()}px`,
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
      transform: `${input.style.transform} rotateZ(${this.node.rotation()}deg)`
    })

    input.addEventListener('blur', (e: Event) => {
      input.parentNode?.removeChild(input)

      this.board.setActiveDrawing(null)

      const newText = convertHtmlToText((<HTMLSpanElement>e.target).innerHTML)

      if (newText !== textBeforeEdit) {
        this.board.history.create(this.board.layer, [], {
          undo: () => this.changeText(textBeforeEdit),
          redo: () => this.changeText(newText)
        })
      }

      // update label's text
      this.text.setText(newText)

      this.node.show()
      this.node.setAttrs({
        draggable: true,
        width: this.text.width()
      })

      // select node
      this.board.selection.add(this)

      this.board.draw()
    })
  }

  /**
   * Changes the text value of the label
   *
   * @param value The text value
   */
  private changeText(value: string) {
    this.text.setAttrs({
      text: value
    })

    this.node.setAttrs({
      width: this.text.width()
    })

    if (this.board.selection.isVisible) {
      this.board.selection.transformer.forceUpdate()
    }

    this.board.draw()

    this.board.events.emit('label:update-text', {
      shapes: [this],
      data: {
        text: value
      }
    })
  }

  /**
   * Focuses on the input to start editing that
   *
   * @param input The [[HTMLSpanElement]]
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
