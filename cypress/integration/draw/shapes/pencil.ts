/// <reference types="cypress" />
/// <reference path="../../../support/index.d.ts" />

describe('Shapes -> Pencil', () => {
  beforeEach(() => {
    cy.reload()
  })

  it('should free draw a line', () => {
    cy.getEditor().then(editor => {
      editor.shapes.pencil.draw({
        stroke: 'red',
        strokeWidth: 10
      })

      return cy
        .get('canvas')
        .trigger('mousedown', {
          clientX: 100,
          clientY: 100
        })
        .trigger('mousemove', {
          clientX: 110,
          clientY: 110
        })
        .trigger('mousemove', {
          clientX: 100,
          clientY: 210
        })
        .trigger('mousemove', {
          clientX: 500,
          clientY: 300
        })
        .trigger('mouseup', { force: true })
        .then(() => {
          expect(editor.board.shapes.length).equal(1)
        })
    })
  })

  it('should select the free drawn line', () => {
    cy.getEditor().then(editor => {
      editor.shapes.pencil.draw({
        stroke: 'red',
        strokeWidth: 15
      })

      cy.draw([100, 100], [500, 500]).then(() => {
        cy.mouseTrigger('mousedown', [200, 200], {
          delay: 1000
        }).then(() => {
          expect(editor.selection.transformer.attrs.visible).equal(true)
        })
      })
    })
  })
})
