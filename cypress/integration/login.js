describe('Login', function() {
  it('Visits the Login page', function() {
    cy.visit('http://localhost:3000/login')
    cy.contains('#username')
  })
});