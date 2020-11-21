/// <reference types="cypress" />

export function loadAsset(
  fileName: string,
  encoding: Cypress.Encodings,
  options?: Partial<Cypress.Loggable & Cypress.Timeoutable>
) {
  return cy.readFile(`${__dirname}/../../assets/${fileName}`, encoding, options)
}
