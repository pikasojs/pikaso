/// <reference types="cypress" />
/// <reference path="../../../support/index.d.ts" />

describe('Shapes -> Ellipse', () => {
  beforeEach(() => {
    cy.reload()
  })

  it('should insert a ellipse', () => {
    cy.getEditor().then(editor => {
      expect(editor.board.activeShapes.length).equal(0)

      editor.shapes.ellipse.insert({
        x: 50,
        y: 50,
        radiusX: 20,
        radiusY: 30,
        fill: 'red'
      })

      expect(editor.board.activeShapes.length).equal(1)
    })
  })

  it('should draw a ellipse', () => {
    cy.getEditor().then(editor => {
      editor.shapes.ellipse.draw({
        fill: '#ccc'
      })

      cy.draw([300, 300], [400, 400]).then(() => {
        expect(editor.board.activeShapes.length).equal(1)
      })
    })
  })

  it('should select the ellipse after creation', () => {
    cy.getEditor().then(editor => {
      const ellipse = editor.shapes.ellipse.insert({
        x: 200,
        y: 200,
        radiusX: 100,
        radiusY: 50,
        fill: '#ccc'
      })

      cy.mouseTrigger('mousedown', [200, 200], {
        delay: 1000
      }).then(() => {
        expect(editor.selection.transformer.attrs.visible).equal(true)
        expect(
          editor.board.selection.transformer.nodes().indexOf(ellipse.node)
        ).equal(0)
      })
    })
  })
})
