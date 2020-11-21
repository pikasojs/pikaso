/// <reference types="cypress" />
/// <reference path="../../../support/index.d.ts" />

describe('Shapes -> Triangle', () => {
  beforeEach(() => {
    cy.reload()
  })

  it('should draw a triangle', () => {
    cy.getEditor().then(editor => {
      editor.shapes.triangle.draw({
        fill: '#ccc'
      })

      cy.draw([300, 300], [400, 400]).then(() => {
        expect(editor.board.shapes.length).equal(1)
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

      cy.get('canvas')
        .trigger('mousedown', {
          clientX: 200,
          clientY: 200
        })
        .then(() => {
          expect(editor.board.selectionsTransformer.attrs.visible).equal(true)

          expect(
            editor.board.selectionsTransformer.nodes().indexOf(triangle.node)
          ).equal(0)
        })
    })
  })
})
