/// <reference types="cypress" />
/// <reference path="../../../support/index.d.ts" />

describe('Shapes -> Triangle', () => {
  beforeEach(() => {
    cy.reload()
  })

  it('should insert a triangle', () => {
    cy.getEditor().then(editor => {
      editor.shapes.triangle.insert({
        x: 100,
        y: 100,
        radius: 10,
        fill: '#ccc'
      })

      expect(editor.board.activeShapes.length).equal(1)
    })
  })

  it('should draw a triangle', () => {
    cy.getEditor().then(editor => {
      editor.shapes.triangle.draw({
        fill: '#ccc'
      })

      cy.draw([300, 300], [400, 400]).then(() => {
        expect(editor.board.activeShapes.length).equal(1)
      })
    })
  })

  it('should select the triangle after creation', () => {
    cy.getEditor().then(editor => {
      const triangle = editor.shapes.triangle.insert({
        x: 200,
        y: 200,
        radius: 100,
        fill: '#ccc'
      })

      cy.mouseTrigger('mousedown', [200, 200], {
        delay: 1000
      }).then(() => {
        expect(editor.board.selection.transformer.attrs.visible).equal(true)

        expect(
          editor.board.selection.transformer.nodes().indexOf(triangle.node)
        ).equal(0)
      })
    })
  })
})
