import Konva from 'konva'

import { convertHtmlToText } from '../../../utils/html-to-text'

import { Board } from '../../../Board'
import { ShapeModel } from '../../ShapeModel'

import { rotateAroundCenter } from '../../../utils/rotate-around-center'
import { DrawType, ShapeConfig, Shapes } from '../../../types'

export class LabelModel extends ShapeModel<Konva.Label, Konva.LabelConfig> {
  /**
   * Represents whether the label is editing (inline edit) or not
   */
  private isEditingEnabled = false

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
   * Returns the label is in inline editing mode or not
   */
  public get isEditing() {
    return this.isEditingEnabled
  }

  /**
   * Returns the text node of the label
   */
  public get textNode() {
    return this.node.getText() as Konva.Text
  }

  /**
   * Returns the tag node of the label
   */
  public get tagNode() {
    return this.node.getTag() as Konva.Tag
  }

  /**
   * @inheritdoc
   * @override
   */
  public rotate(theta: number) {
    rotateAroundCenter(this.node, theta)

    this.board.events.emit('shape:rotate', {
      shapes: [this]
    })
  }

  /**
   * Updates attributes of the label's tag
   *
   * @param attributes The list of attributes
   * @param options The options of updading attributes
   */
  public updateTag(attributes: Partial<Konva.TagConfig>) {
    this.board.history.create(this.board.layer, this.tagNode)
    this.tagNode.setAttrs(attributes)
  }

  /**
   * Updates attributes of the label's tag
   *
   * @param attributes The list of attributes
   * @param options The options of updading attributes
   */
  public updateText(attributes: Partial<Konva.TextConfig>) {
    this.board.history.create(this.board.layer, this.textNode)
    this.textNode.setAttrs(attributes)

    this.updateTransformer()
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

    this.textNode.setAttrs({
      width: this.node.width() * this.node.scaleX(),
      scaleX: this.node.scaleY()
    })

    this.node.scaleX(this.textNode.scaleY())
    this.tagNode.scaleX(this.node.scaleY())
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

    e.cancelBubble = true
    this.isEditingEnabled = true
    this.board.setActiveDrawing(DrawType.Text)

    const position = e.target.absolutePosition()
    const textBeforeEdit = this.textNode.getAttr('text')

    // hide node
    this.node.hide()
    this.node?.draggable(false)

    // deselect all selected nodes
    this.board.selection.deselectAll()

    const input = document.createElement('span')
    this.board.container
      .getElementsByClassName(this.board.settings.containerClassName!)[0]
      .append(input)

    this.setInputFocus(input)

    input.setAttribute('contenteditable', '')
    input.setAttribute('role', 'textbox')
    input.innerText = this.textNode.getAttr('text')

    Object.assign(input.style, {
      position: 'absolute',
      display: 'inline-block',
      left: `${position.x - this.textNode.padding()}px`,
      top: `${position.y - this.textNode.padding()}px`,
      width: `${this.textNode.width() * this.node.scaleX()}px`,
      minWidth: `${this.textNode.padding() * 2}px`,
      maxWidth: `${this.textNode.width() * this.node.scaleX()}px`,
      minHeight: `${this.textNode.height() * this.node.scaleY()}px`,
      fontSize: `${this.textNode.fontSize() * this.node.scaleY()}px`,
      border: 'none',
      padding: `${this.textNode.padding()}px`,
      margin: `${this.textNode.padding()}px`,
      overflow: 'hidden',
      background: this.tagNode.fill(),
      borderRadius: `${this.tagNode.cornerRadius()}px`,
      outline: 'none',
      resize: 'none',
      lineHeight: this.textNode.lineHeight(),
      fontFamily: this.textNode.fontFamily(),
      transformOrigin: 'left top',
      textAlign: this.textNode.align(),
      color: this.textNode.fill(),
      transform: `${input.style.transform} rotateZ(${this.node.rotation()}deg)`
    })

    input.addEventListener('blur', (e: Event) => {
      this.isEditingEnabled = false

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
      this.textNode.setText(newText)

      this.node.show()
      this.node.setAttrs({
        draggable: this.board.settings.selection?.interactive,
        width: this.textNode.width()
      })

      // select node
      this.board.selection.add(this)
    })
  }

  /**
   * Changes the text value of the label
   *
   * @param value The text value
   */
  private changeText(value: string) {
    this.textNode.setAttrs({
      text: value
    })

    this.updateTransformer()

    this.board.events.emit('label:update-text', {
      shapes: [this],
      data: {
        text: value
      }
    })
  }

  /**
   * updates transformer after changing text
   */
  private updateTransformer() {
    if (this.board.selection.isVisible) {
      this.board.selection.transformer.forceUpdate()
    }
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
