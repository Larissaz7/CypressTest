describe('RF-002 - OrangeHRM', () => {
  it('CT-001-P - Cadastrar vaga ativa com sucesso', () => {
    cy.visit('/web/index.php/auth/login');
    cy.location('pathname').then((pathname) => {
      if (pathname.includes('/auth/login')) {
        cy.get('input[name="username"]', { timeout: 20000 }).type('Admin');
        cy.get('input[name="password"]').type('admin123');
        cy.get('button[type="submit"]').click();
      }
    });
    cy.location('pathname', { timeout: 20000 }).should('include', '/dashboard');
    const vacancyName = `QA Automation ${Date.now()}`;
    cy.visit('/web/index.php/recruitment/addJobVacancy');
    cy.contains('.oxd-label', 'Vacancy Name').parents('.oxd-input-group').find('input').type(vacancyName);
    cy.contains('.oxd-label', 'Job Title').parents('.oxd-input-group').find('.oxd-select-text').click();
    cy.contains('.oxd-select-option', 'Account Assistant').click();
    cy.intercept('GET', '**/api/v2/pim/employees*').as('hiringManagers');
    cy.get('input[placeholder="Type for hints..."]').type('a');
    cy.wait('@hiringManagers');
    cy.get('.oxd-autocomplete-option').should('not.contain', 'Searching....').first().click();
    cy.contains('.oxd-label', 'Number of Positions').parents('.oxd-input-group').find('input').clear().type('2');
    cy.get('textarea[placeholder="Type description here"]').type('Automação de testes Cypress');
    cy.contains('button', 'Save').click();
    cy.location('pathname').should('match', /\/recruitment\/addJobVacancy\/\d+$/);
    cy.contains('.oxd-label', 'Vacancy Name').parents('.oxd-input-group').find('input').should('have.value', vacancyName);
  });
});
