/// <reference types="cypress" />
/// <reference path="../../../support/index.d.ts" />

describe('Shapes -> Background', () => {
  beforeEach(() => {
    cy.reload()
  })

  it('should change the background color', () => {
    cy.getEditor().then(editor => {
      editor.board.background.fill('rgba(255, 0, 0, 0.5)')

      expect(editor.board.background.overlay.node.attrs.fill).equal(
        'rgba(255, 0, 0, 0.5)'
      )
    })
  })

  it('should change the background image', () => {
    cy.loadImage('cat.jpg').then(url => {
      cy.getEditor().then(editor => {
        editor.board.background.setImageFromUrl(url).then(() => {
          expect(editor.board.background.image.node.attrs.image.src).equal(url)
        })
      })
    })
  })
})
