/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('Rotation', () => {
  beforeEach(() => {
    cy.reload()
  })

  it('should transform rotate all the shapes in the board', () => {
    cy.loadImage('cat.jpg').then(url => {
      cy.getEditor().then(editor => {
        editor.shapes.rect.insert({
          x: 500,
          y: 500,
          width: 550,
          height: 400,
          fill: 'red'
        })

        editor.board.background.setImageFromUrl(url).then(() => {
          editor.rotation.transform(30)

          editor.board.getNodes().forEach(node => {
            expect(node.rotation()).equal(30)
            expect(Number(node.scale().x.toFixed(2))).equal(0.62)
            expect(Number(node.scale().y.toFixed(2))).equal(0.62)
          })
        })
      })
    })
  })

  it('should spin all the shapes in the board', () => {
    cy.loadImage('cat.jpg').then(url => {
      cy.getEditor().then(editor => {
        editor.shapes.rect.insert({
          x: 500,
          y: 500,
          width: 550,
          height: 400,
          fill: 'red'
        })

        editor.board.background.setImageFromUrl(url).then(() => {
          editor.rotation.straighten(30)

          editor.board.getNodes().forEach(node => {
            expect(node.rotation()).equal(30)
            expect(Number(node.scale().x.toFixed(2))).equal(1)
            expect(Number(node.scale().y.toFixed(2))).equal(1)
          })
        })
      })
    })
  })
})
