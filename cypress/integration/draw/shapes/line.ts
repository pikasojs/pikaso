/// <reference types="cypress" />
/// <reference path="../../../support/index.d.ts" />

describe('Shapes -> Line', () => {
  beforeEach(() => {
    cy.reload()
  })

  it('should insert an line', () => {
    cy.getEditor().then(editor => {
      expect(editor.board.getShapes().length).equal(0)

      editor.shapes.line.insert({
        stroke: 'red',
        points: [50, 50, 400, 400],
        strokeWidth: 15
      })

      expect(editor.board.getShapes().length).equal(1)
    })
  })

  it('should draw an line', () => {
    cy.getEditor().then(editor => {
      editor.shapes.line.draw({
        fill: '#ccc'
      })

      cy.draw([300, 300], [400, 400]).then(() => {
        expect(editor.board.getShapes().length).equal(1)
      })
    })
  })

  it('should select the line after creation', () => {
    cy.getEditor().then(editor => {
      const line = editor.shapes.line.insert({
        stroke: 'red',
        points: [50, 50, 400, 400],
        strokeWidth: 15
      })

      cy.mouseTrigger('mousedown', [200, 200], {
        delay: 1000
      }).then(() => {
        expect(editor.selection.transformer.attrs.visible).equal(true)

        expect(
          editor.board.selection.transformer.nodes().indexOf(line.node)
        ).equal(0)
      })
    })
  })
})
