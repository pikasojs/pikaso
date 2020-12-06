/* eslint-disable @typescript-eslint/no-unused-vars */

/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    draw(
      from: [number, number],
      to: [number, number]
    ): Cypress.Chainable<Element>
    mouseTrigger(
      name: 'mousedown' | 'mousemove' | 'mouseup',
      point: [number, number],
      options?: {
        delay: number
      }
    ): Cypress.Chainable<Element>
    loadAsset(
      fileName: string,
      encoding: Encodings,
      options?: Partial<Cypress.Loggable & Cypress.Timeoutable>
    ): Cypress.Chainable<string>
    loadImage(fileName: string, mimeType?: string): Cypress.Chainable<string>
    getEditor(): PromiseLike<import('../../src').default>
  }
}
