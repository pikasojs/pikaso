/// <reference types="cypress" />

export function draw(from: [number, number], to: [number, number]) {
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
