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
  it('Create a Destination', function() {
    cy.visit('/destinations');
    cy.get('[data-testid=addDestination]').click();
    cy.get('input[name=name]').type('Summit');
    cy.wait(1000);
    cy.get('[data-testid=destinationAdd-submit').click();
    cy.url().should('include', '/destinations');
    cy.contains('Summit');
  });
  it('Create a Traffic Generator', function() {
    cy.visit('/traffic-generators');
    cy.get('[data-testid=addTrafficGenerator]').click();
    cy.get('input[name=name]').type('Merchandise House');
    cy.get('select[name=type]').select('industry');
    cy.get('select[name=destination_id]').select('Summit');
    cy.wait(1000);
    cy.get('[data-testid=trafficGeneratorAdd-submit').click();
    cy.url().should('include', '/traffic-generators');
    cy.contains('Merchandise House');
    cy.contains('industry');
  });
  it('Enter a Work Order', function() {
    cy.visit('/work-orders');
    cy.contains('a', 'Summit Turn').click();
    cy.get('select[name=destination_id]').select('Summit');
    cy.wait(1000);
    cy.get('[data-testid=workItemAdd-submit').click();
    cy.contains('Scheduled work at Summit');
    cy.contains('a', 'Add Task').click();
    cy.get('select[name=type]').select('Drop');
    cy.get('select[name=railcar_id]').select('BN');
    cy.get('select[name=traffic_generator_id]').select('Merchandise House');
    cy.wait(1000);
    cy.get('[data-testid=taskAdd-submit').click();
    cy.contains('drop off');
    cy.contains('BN 123');
    cy.contains('from Merchandise House');
    cy.get('[data-testid=workItemDelete').should('not.exist');
  });
  it('Deletes a Work Order', function() {
    cy.visit('/work-orders');
    cy.contains('a', 'Summit Turn').click();
    cy.get('[data-testid=taskDelete').click();
    cy.contains('button', 'Delete Task').click({
      force: true,
    });
    cy.contains('drop off').should('not.exist');
    cy.get('[data-testid=workItemDelete').click();
    cy.contains('button', 'Delete Destination').click({
      force: true,
    });
    cy.contains('Scheduled work at Summit').should('not.exist');
  });
});
