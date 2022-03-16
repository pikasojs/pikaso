/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('Crop', () => {
  beforeEach(() => {
    cy.reload()
  })

  it('should create a flexible-rect cropper and crop the board', () => {
    cy.getEditor().then(editor => {
      editor.shapes.circle.insert({
        x: 300,
        y: 200,
        radius: 150,
        fill: 'red'
      })
      editor.cropper.start({
        x: 0,
        y: 0,
        width: 300,
        height: 300
      })
      editor.cropper.crop()
      expect(editor.board.stage.attrs.width).equal(500)
      expect(editor.board.stage.attrs.height).equal(500)
    })
  })

  it('should create a fixed-rect cropper and crop the board', () => {
    cy.getEditor().then(editor => {
      editor.shapes.circle.insert({
        x: 300,
        y: 200,
        radius: 150,
        fill: 'red'
      })

      editor.cropper.start({
        x: 0,
        y: 0,
        width: 300,
        height: 300,
        fixed: true
      })

      editor.cropper.crop()

      expect(editor.board.stage.attrs.width).equal(500)
      expect(editor.board.stage.attrs.height).equal(500)
    })
  })

  it('should create a flexible-circular cropper and crop the board', () => {
    cy.getEditor().then(editor => {
      editor.shapes.circle.insert({
        x: 300,
        y: 200,
        radius: 150,
        fill: 'red'
      })

      editor.cropper.start({
        x: 0,
        y: 0,
        radius: 200,
        circular: true
      })

      editor.cropper.crop()

      expect(editor.board.stage.attrs.width).equal(500)
      expect(editor.board.stage.attrs.height).equal(500)
    })
  })

  it('should create a fixed-circular cropper and crop the board', () => {
    cy.getEditor().then(editor => {
      editor.shapes.circle.insert({
        x: 300,
        y: 200,
        radius: 150,
        fill: 'red'
      })

      editor.cropper.start({
        x: 0,
        y: 0,
        radius: 200,
        circular: true,
        fixed: true
      })

      editor.cropper.crop()

      expect(editor.board.stage.attrs.width).equal(500)
      expect(editor.board.stage.attrs.height).equal(500)
    })
  })
})
