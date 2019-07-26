describe('Register', function() {
  it('Visits the Register page', function() {
    cy.visit('http://localhost:3000/')
    cy.contains('Join').click()
    cy.url().should('include', '/register')
  })
});