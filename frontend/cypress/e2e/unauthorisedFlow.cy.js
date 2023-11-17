/* eslint-disable cypress/unsafe-to-chain-command */
import 'cypress-file-upload';

describe('unauthorisedToAuthorised - happy path', () => {
  it('landing screen', () => {
    cy.visit('http://localhost:3000');
    cy.url().should('include', 'http://localhost:3000');
  })
  it('register', () => {
    cy.get('svg')
      .click();
    cy.get('a').contains('Sign up')
      .click();
    cy.url().should('include', 'http://localhost:3000/register');
    cy.get('input[id="login-name')
      .focus()
      .type('A');
    cy.get('input[id="login-email"')
      .focus()
      .type('a@unsw.edu.au');
    cy.get('input[id="login-password"]')
      .focus()
      .type('a');
    cy.get('input[id="login-confirm-password"]')
      .focus()
      .type('a');
    cy.get('button').contains('Register')
      .click();
  })
  it('creates a listing', () => {
    cy.get('svg')
      .click();
    cy.get('a').contains('Your listings')
      .click();
    cy.url().should('include', 'http://localhost:3000/listings/my');
    cy.get('button').contains('Create listing')
      .click();
    cy.get('input[placeholder="Name of listing"]')
      .focus()
      .type('Happy Flow');
    cy.get('input[placeholder="Listing address"]')
      .focus()
      .type('1 Happy Flow');
    cy.get('input[placeholder="City or suburb"]')
      .focus()
      .type('Sydney');
    cy.get('input[placeholder="Amount"')
      .focus()
      .type('100');
    cy.get('a').contains('House')
      .click();
    cy.get('a').contains('Wifi')
      .click();
    cy.get('input[type="file"]').attachFile('../../happy-flow-image.jpeg');
    cy.get('button').contains('Create new listing')
      .click();
  })
  it('puts the listing up live', () => {
    cy.get('button').contains('Go Live')
      .click()
    cy.get('label').contains('Start')
      .click()
      .type('2023-01-01');
    cy.get('label').contains('Finish')
      .click()
      .type('2023-01-03');
    cy.get('button').contains('Submit')
      .click();
  })
  it('exploring site to simulate human interaction', () => {
    cy.get('button').contains('View reservations')
      .click();
    cy.url().should('include', 'http://localhost:3000/listings/reservations')
    cy.get('img[id="logo"]')
      .click();
    cy.get('p').contains('Happy Flow')
      .click();
    cy.url().should('include', 'http://localhost:3000/listing')
    cy.get('svg[data-testid="PersonIcon"]')
      .click();
    cy.get('a').contains('Your listings')
      .click();
  })
  it('try to book own listing', () => {
    cy.get('img[id="logo"]')
      .click();
    cy.get('p').contains('Happy Flow')
      .click();
    cy.get('label').contains('CHECK-IN').next()
      .click()
      .type('2023-01-02');
    cy.get('label').contains('CHECK-OUT').next()
      .click()
      .type('2023-01-04');
    cy.get('button[type="submit"]').contains('RESERVE')
      .click();
  })
  it('remove listing', () => {
    cy.get('svg[data-testid="PersonIcon"]')
      .click();
    cy.get('a').contains('Your listings')
      .click();
    cy.get('button').contains('Performance')
      .click();
    cy.get('button').contains('My Listings')
      .click();
    cy.get('button').contains('Unpublish')
      .click();
    cy.get('img[id="logo"]')
      .click();
    cy.get('svg[data-testid="PersonIcon"]')
      .click();
    cy.get('a').contains('Your listings')
      .click();
    cy.get('button').contains('Delete')
      .click()
    cy.get('svg[data-testid="PersonIcon"]')
      .click();
    cy.get('a').contains('Log out')
      .click();
  })
});
