describe('Work Orders', function() {
  before(function() {
    // reset and seed the database prior to every test
    cy.exec('yarn seed:test');
  });

  beforeEach(function() {
    cy.visit('/login');
    cy.get('input[name=username]').type('rballa');
    cy.get('input[name=password]').type(`test{enter}`);
  });

  it('Create a Work Order', function() {
    cy.visit('/work-orders');
    cy.get('[data-testid=addWorkOrder]').click();
    cy.get('input[name=name]').type('Summit Turn');
    cy.get('input[name=description]').type('Summit to Georgetown and Back');
    cy.wait(1000);
    cy.get('[data-testid=workOrderAdd-submit').click();
    cy.url().should('include', '/work-orders');
    cy.contains('Summit Turn');
  });
});
