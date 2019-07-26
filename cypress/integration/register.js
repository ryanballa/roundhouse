describe('Register', function() {
  it('Visits the Register page', function() {
    cy.visit('/')
    cy.contains('Join').click()
    cy.url().should('include', '/register')
  })
});