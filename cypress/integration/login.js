describe('Login', function() {
  it('Visits the Login page', function() {
    cy.visit('/login')
    cy.get('input[name=username]').type('rballa')

    // {enter} causes the form to submit
    cy.get('input[name=password]').type(`test{enter}`)

    cy.url().should('include', '/locomotives')
  })
});