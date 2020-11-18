/* eslint-disable @typescript-eslint/no-unused-vars */

/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    draw(
      from: [number, number],
      to: [number, number]
    ): Cypress.Chainable<Element>
    getEditor(): PromiseLike<import('../../src').default>
  }
}
