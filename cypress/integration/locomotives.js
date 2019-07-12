describe('My First Test', function() {
  it('Visits the Kitchen Sink', function() {
    cy.visit('http://localhost:3000/')
    cy.contains('Locomotives').click()
    cy.url().should('include', '/locomotives')
  })
})