/// <reference types="cypress" />
import { Pikaso } from '../../../src/index.all'

export function getEditor() {
  return cy.document().then(async doc => {
    Object.assign(doc.body.style, {
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    })

    let element = document.getElementById('frame')

    if (!element) {
      element = doc.createElement('div')

      Object.assign(element.style, {
        width: '600px',
        height: '500px',
        border: '1px dashed #ccc',
        background: '#f4f4f4'
      })

      element.setAttribute('id', 'frame')
      doc.body.appendChild(element)
    }

    const editor = new Pikaso({
      container: element as HTMLDivElement
    })

    return editor
  })
}
