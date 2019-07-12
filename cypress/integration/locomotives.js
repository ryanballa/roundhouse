describe('Locomotives', function() {
  it('Visits the Locomotives page', function() {
    cy.visit('http://localhost:3000/')
    cy.contains('Locomotives').click()
    cy.url().should('include', '/locomotives')
  })
});