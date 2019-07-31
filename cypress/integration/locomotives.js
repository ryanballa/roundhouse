describe('Locomotives', function () {
  before(function() {
    // reset and seed the database prior to every test
    // cy.exec('yarn seed:test')
  })

  beforeEach(function () {
    cy.visit('/login')
    cy.get('input[name=username]').type('rballa')
    cy.get('input[name=password]').type(`test{enter}`)
  })

  it('Create a new Locomotive', function() {
    cy.visit('/locomotives');
    cy.get('button').click() ;
    cy.get('input[name=engine_number]').type('1234');
    cy.get('input[name=road]').type('Rock Island');
    cy.get('input[name=purchased_on]').type('2019-10-30');
    cy.get('input[name=value]').type('250');
    cy.get('[data-testid=is_operational]').get('label').first().click();
    cy.get('[data-testid=is_dcc] label').get('label').first().click();
    cy.get('input[name=purchase_price]').type('130');
    cy.get('input[name=notes]').type('These are some notes.');
    cy.get('[data-testid=locomotiveAdd-form]').submit();
    cy.url().should('include', '/locomotives')
    cy.contains('Rock Island') 
  });

  it('Edits a Locomotive', function() {
    cy.visit('/locomotives');
    cy.contains('Rock Island').click();
    cy.wait(500);
    cy.get('input[name=road]').clear().type('Rock Island 1');
    cy.get('[data-testid=locomotiveAdd-form]').submit();
    cy.contains('Rock Island 1').click();
    cy.get('input[name=road]').clear().type('Rock Island');
    cy.get('[data-testid=locomotiveAdd-form]').submit();
  });

  it('Deletes a Locomotive', function() {
    cy.contains('Rock Island').click();
    cy.get('[data-testid=locomotiveEdit-form]')
    cy.get('[data-testid=locomotiveEdit-delete]').click()
    cy.get('[role=dialog]').get('button').contains('Delete Locomotive').click({force: true})
    cy.contains('Rock Island').should('not.exist');
  });
});