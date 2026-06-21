describe('RF-002 - OrangeHRM', () => {
  it('CT-001-N - Bloquear vaga sem nome', () => {
    cy.visit('/web/index.php/auth/login');
    cy.location('pathname').then((pathname) => {
      if (pathname.includes('/auth/login')) {
        cy.get('input[name="username"]', { timeout: 20000 }).type('Admin');
        cy.get('input[name="password"]').type('admin123');
        cy.get('button[type="submit"]').click();
      }
    });
    cy.location('pathname', { timeout: 20000 }).should('include', '/dashboard');
    cy.visit('/web/index.php/recruitment/addJobVacancy');
    cy.contains('.oxd-label', 'Job Title').parents('.oxd-input-group').find('.oxd-select-text').click();
    cy.contains('.oxd-select-option', 'Account Assistant').click();
    cy.intercept('GET', '**/api/v2/pim/employees*').as('hiringManagers');
    cy.get('input[placeholder="Type for hints..."]').type('a');
    cy.wait('@hiringManagers');
    cy.get('.oxd-autocomplete-option').should('not.contain', 'Searching....').first().click();
    cy.contains('button', 'Save').click();
    cy.get('.oxd-input-field-error-message').should('be.visible');
  });
});
