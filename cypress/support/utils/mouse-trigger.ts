/// <reference types="cypress" />

export function mouseTrigger(
  name: 'mousedown' | 'mousemove' | 'mouseup',
  point: [number, number],
  options = {
    delay: 0
  }
) {
  return cy.wait(options.delay).then(() => {
    return cy.get('canvas').trigger(name, {
      clientX: point[0],
      clientY: point[1],
      force: true
    })
  })
}
