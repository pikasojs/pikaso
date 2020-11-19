/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('Shapes -> Circle', () => {
  beforeEach(() => {
    cy.reload()
  })

  it('should select the shape after creation', () => {
    cy.getEditor().then(editor => {
      expect(editor.selection.getShapes().length).eq(0)

      editor.shapes.circle.insert({
        name: 'circle',
        x: 250,
        y: 250,
        radius: 50,
        fill: '#ccc'
      })

      cy.get('canvas')
        .trigger('mousedown', {
          clientX: 220,
          clientY: 220
        })
        .then(() => {
          expect(editor.selection.getShapes().length).eq(1)
          expect(editor.selection.getTransformer().nodes().length).eq(1)
        })
    })
  })

  it('should select the shape with dragging zone', () => {
    cy.getEditor().then(editor => {
      expect(editor.selection.getShapes().length).eq(0)

      editor.shapes.circle.insert({
        name: 'circle',
        x: 250,
        y: 250,
        radius: 50,
        fill: '#ccc'
      })

      cy.draw([200, 200], [300, 300]).then(() => {
        expect(editor.selection.getShapes().length).eq(1)
        expect(editor.selection.getTransformer().nodes().length).eq(1)
      })
    })
  })

  it('should not select the shape when is outside of dragging zone', () => {
    cy.getEditor().then(editor => {
      expect(editor.selection.getShapes().length).eq(0)

      editor.shapes.circle.insert({
        name: 'circle',
        x: 250,
        y: 250,
        radius: 50,
        fill: '#ccc'
      })

      cy.draw([350, 350], [400, 400]).then(() => {
        expect(editor.selection.getShapes().length).eq(0)
        expect(editor.selection.getTransformer().nodes().length).eq(0)
      })
    })
  })

  it('should select multi shapes when are in dragging zone', () => {
    cy.getEditor().then(editor => {
      expect(editor.selection.getShapes().length).eq(0)

      editor.shapes.circle.insert({
        name: 'circle',
        x: 250,
        y: 250,
        radius: 30,
        fill: '#ccc'
      })

      editor.shapes.circle.insert({
        name: 'circle',
        x: 300,
        y: 300,
        radius: 30,
        fill: '#ccc'
      })

      cy.draw([500, 500], [100, 100]).then(() => {
        expect(editor.selection.getShapes().length).eq(2)
        expect(editor.selection.getTransformer().nodes().length).eq(2)
      })
    })
  })
})
