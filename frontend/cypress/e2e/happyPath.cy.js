/* eslint-disable cypress/unsafe-to-chain-command */
import 'cypress-file-upload';

describe('happy path', () => {
  it('first user should navigate to the home screen', () => {
    cy.visit('localhost:3000/');
    cy.url().should('include', 'localhost:3000/');
  })

  it('first user should register successfully', () => {
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
      .type('user1@unsw.edu.au');
    cy.get('input[id="login-password"]')
      .focus()
      .type('a');
    cy.get('input[id="login-confirm-password"]')
      .focus()
      .type('a');
    cy.get('button').contains('Register')
      .click();
  })

  it('first user creates a listing', () => {
    cy.get('.MuiAvatar-root')
      .click();
    cy.get('a').contains('Your listings')
      .click();
    cy.url().should('include', 'http://localhost:3000/listings/my');
    cy.get('button').contains('Create listing')
      .click();
    cy.get('input[placeholder="Name of listing"]')
      .focus()
      .type('Airbnb Mansion');
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

  it('first user updates a listing', () => {
    cy.get('button').contains('Edit')
      .click();
    cy.get('input[placeholder="Name of listing"]')
      .focus()
      .type(' (Renovated)');
    cy.get('div[id="thumbnail"]').click();
    cy.get('input[type="file"]').attachFile('../../happy-flow-image2.jpeg');
    cy.get('button').contains('Update listing')
      .click();
  })

  it('first user publishes the listing', () => {
    cy.get('button').contains('Go Live')
      .click()

    cy.get('label').contains('Start')
      .click()
      .type('2023-01-01');

    cy.get('label').contains('Finish')
      .click()
      .type('2023-01-30');

    cy.get('button').contains('Submit')
      .click();
  })

  it('first user unpublishes the listing', () => {
    cy.get('button').contains('Unpublish')
      .click()
  })

  it('first user should successfully logout', () => {
    cy.get('.MuiAvatar-root')
      .click();
    cy.get('#logout-tab')
      .click();
  })

  it('second user should register successfully', () => {
    cy.get('.MuiAvatar-root')
      .click();
    cy.get('a').contains('Sign up')
      .click();
    cy.url().should('include', 'http://localhost:3000/register');
    cy.get('input[id="login-name')
      .focus()
      .type('A');
    cy.get('input[id="login-email"')
      .focus()
      .type('user2@unsw.edu.au');
    cy.get('input[id="login-password"]')
      .focus()
      .type('a');
    cy.get('input[id="login-confirm-password"]')
      .focus()
      .type('a');
    cy.get('button').contains('Register')
      .click();
  })

  it('second user should create a listing', () => {
    cy.get('.MuiAvatar-root')
      .click();
    cy.get('a').contains('Your listings')
      .click();
    cy.url().should('include', 'http://localhost:3000/listings/my');
    cy.get('button').contains('Create listing')
      .click();
    cy.get('input[placeholder="Name of listing"]')
      .focus()
      .type('Your next holiday');
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

  it('second user publishes the listing', () => {
    cy.get('button').contains('Go Live')
      .click()

    cy.get('label').contains('Start')
      .click()
      .type('2023-01-01');

    cy.get('label').contains('Finish')
      .click()
      .type('2023-01-30');

    cy.get('button').contains('Submit')
      .click();
  })

  it('second user should successfully logout', () => {
    cy.get('.MuiAvatar-root')
      .click();
    cy.get('#logout-tab')
      .click();
  })

  it('first user should login successfully', () => {
    cy.get('.MuiAvatar-root')
      .click();
    cy.get('a').contains('Login')
      .click();
    cy.url().should('include', 'http://localhost:3000/login');
    cy.get('input[id="login-email"')
      .focus()
      .type('user1@unsw.edu.au');
    cy.get('input[id="login-password"]')
      .focus()
      .type('a');
    cy.get('button').contains('Login')
      .click();
  })

  it('first user should make a booking', () => {
    cy.get('.MuiAspectRatio-content > img')
      .click();
    cy.get('input[name="check-in"')
      .focus()
      .type('2023-01-05')
    cy.get('input[name="check-out"')
      .focus()
      .type('2023-01-10')
    cy.get('button').contains('RESERVE')
      .click()
  })

  it('first user should log out successfully', () => {
    cy.get('.MuiAvatar-root')
      .click();
    cy.get('a').contains('Logout')
      .click();
  })
})
