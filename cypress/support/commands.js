import Pikaso from '../../src'

function draw(from, to) {
  return cy
    .get('canvas')
    .trigger('mousedown', {
      clientX: from[0],
      clientY: from[1]
    })
    .trigger('mousemove', {
      clientX: to[0],
      clientY: to[1]
    })
    .trigger('mouseup', { force: true })
}

function getEditor() {
  return cy.document().then(doc => {
    Object.assign(doc.body.style, {
      margin: 0,
      padding: 0
    })

    let element = document.getElementById('frame')

    if (!element) {
      element = doc.createElement('div')

      Object.assign(element.style, {
        width: '600px',
        height: '500px',
        border: '1px dashed #ccc'
      })

      element.setAttribute('id', 'frame')
      doc.body.appendChild(element)
    }

    const editor = new Pikaso({
      container: element
    })

    return editor
  })
}

Cypress.Commands.add('getEditor', getEditor)
Cypress.Commands.add('draw', draw)
