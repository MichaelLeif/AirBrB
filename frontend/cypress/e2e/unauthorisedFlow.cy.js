describe('unauthorised - happy path', () => {
  it('passes', () => {
    cy.visit('https://localhost:5000');
    cy.url().should('include', 'https://localhost:5000');
  })
});
