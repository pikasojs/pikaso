/// <reference types="cypress" />
/// <reference path="../../../support/index.d.ts" />

describe('Shapes -> Circle', () => {
  beforeEach(() => {
    cy.reload()
  })

  it('should insert a circle', () => {
    cy.getEditor().then(editor => {
      expect(editor.board.shapes.length).equal(0)

      editor.shapes.circle.insert({
        x: 50,
        y: 50,
        radius: 20,
        fill: 'red'
      })

      expect(editor.board.shapes.length).equal(1)
    })
  })

  it('should draw a circle', () => {
    cy.getEditor().then(editor => {
      editor.shapes.circle.draw({
        fill: '#ccc'
      })

      cy.draw([300, 300], [400, 400]).then(() => {
        expect(editor.board.shapes.length).equal(1)
      })
    })
  })

  it('should select the circle after creation', () => {
    cy.getEditor().then(editor => {
      const circle = editor.shapes.circle.insert({
        x: 200,
        y: 200,
        radius: 100,
        fill: '#ccc'
      })

      cy.mouseTrigger('mousedown', [200, 200], {
        delay: 1000
      }).then(() => {
        expect(editor.selection.transformer.attrs.visible).equal(true)

        expect(
          editor.board.selection.transformer.nodes().indexOf(circle.node)
        ).equal(0)
      })
    })
  })
})
