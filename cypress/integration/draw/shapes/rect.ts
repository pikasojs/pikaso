/// <reference types="cypress" />
/// <reference path="../../../support/index.d.ts" />

describe('Shapes -> Rect', () => {
  beforeEach(() => {
    cy.reload()
  })

  it('should insert a rect', () => {
    cy.getEditor().then(editor => {
      editor.shapes.rect.insert({
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        fill: '#ccc'
      })

      expect(editor.board.getShapes().length).equal(1)
    })
  })

  it('should draw a rect', () => {
    cy.getEditor().then(editor => {
      editor.shapes.rect.draw({
        fill: '#ccc'
      })

      cy.draw([300, 300], [400, 400]).then(() => {
        expect(editor.board.getShapes().length).equal(1)
      })
    })
  })

  it('should select the rect after creation', () => {
    cy.getEditor().then(editor => {
      const rect = editor.shapes.rect.insert({
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        fill: '#ccc'
      })

      cy.mouseTrigger('mousedown', [120, 120], {
        delay: 1000
      }).then(() => {
        expect(editor.board.selection.transformer.attrs.visible).equal(true)

        expect(
          editor.board.selection.transformer.nodes().indexOf(rect.node)
        ).equal(0)
      })
    })
  })
})
