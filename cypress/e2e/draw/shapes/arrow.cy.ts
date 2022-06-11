/// <reference types="cypress" />
/// <reference path="../../../support/index.d.ts" />

describe('Shapes -> Arrow', () => {
  beforeEach(() => {
    cy.reload()
  })

  it('should insert an arrow', () => {
    cy.getEditor().then(editor => {
      expect(editor.board.activeShapes.length).equal(0)

      editor.shapes.arrow.insert({
        stroke: 'red',
        points: [50, 50, 400, 400],
        strokeWidth: 15
      })

      expect(editor.board.activeShapes.length).equal(1)
    })
  })

  it('should draw an arrow', () => {
    cy.getEditor().then(editor => {
      editor.shapes.arrow.draw({
        fill: '#ccc'
      })

      cy.draw([300, 300], [400, 400]).then(() => {
        expect(editor.board.activeShapes.length).equal(1)
      })
    })
  })

  it('should select the arrow after creation', () => {
    cy.getEditor().then(editor => {
      const arrow = editor.shapes.arrow.insert({
        stroke: 'red',
        points: [50, 50, 400, 400],
        strokeWidth: 15
      })

      cy.mouseTrigger('mousedown', [200, 200], {
        delay: 1000
      }).then(() => {
        expect(editor.selection.transformer.attrs.visible).equal(true)

        expect(
          editor.board.selection.transformer.nodes().indexOf(arrow.node)
        ).equal(0)
      })
    })
  })
})
