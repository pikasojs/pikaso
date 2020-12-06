/// <reference types="cypress" />
/// <reference path="../../../support/index.d.ts" />

describe('Shapes -> Polygon', () => {
  beforeEach(() => {
    cy.reload()
  })

  it('should insert a polygon', () => {
    cy.getEditor().then(editor => {
      editor.shapes.polygon.insert({
        x: 100,
        y: 100,
        radius: 10,
        sides: 4,
        fill: '#ccc'
      })

      expect(editor.board.getShapes().length).equal(1)
    })
  })

  it('should draw a polygon', () => {
    cy.getEditor().then(editor => {
      editor.shapes.polygon.draw({
        fill: '#ccc'
      })

      cy.draw([300, 300], [400, 400]).then(() => {
        expect(editor.board.getShapes().length).equal(1)
      })
    })
  })

  it('should select the polygon after creation', () => {
    cy.getEditor().then(editor => {
      const polygon = editor.shapes.polygon.insert({
        x: 200,
        y: 200,
        radius: 100,
        sides: 8,
        fill: '#ccc'
      })

      cy.mouseTrigger('mousedown', [200, 200], {
        delay: 1000
      }).then(() => {
        expect(editor.board.selection.transformer.attrs.visible).equal(true)

        expect(
          editor.board.selection.transformer.nodes().indexOf(polygon.node)
        ).equal(0)
      })
    })
  })
})
