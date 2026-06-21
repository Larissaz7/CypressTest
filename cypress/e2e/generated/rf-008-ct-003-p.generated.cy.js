describe('RF-008 - OrangeHRM', () => {
  it('CT-003-P - Mover candidato para Shortlisted', () => {
    cy.visit('/web/index.php/auth/login');
    cy.location('pathname').then((pathname) => {
      if (pathname.includes('/auth/login')) {
        cy.get('input[name="username"]', { timeout: 20000 }).type('Admin');
        cy.get('input[name="password"]').type('admin123');
        cy.get('button[type="submit"]').click();
      }
    });
    cy.location('pathname', { timeout: 20000 }).should('include', '/dashboard');
    const suffix = Date.now();
    const candidateFirstName = `QA${suffix}`;
    const candidateEmail = `qa.${suffix}@example.com`;
    const vacancyName = `QA Shortlist ${suffix}`;
    cy.visit('/web/index.php/recruitment/addJobVacancy');
    cy.contains('.oxd-label', 'Vacancy Name').parents('.oxd-input-group').find('input').type(vacancyName);
    cy.contains('.oxd-label', 'Job Title').parents('.oxd-input-group').find('.oxd-select-text').click();
    cy.get('.oxd-select-option').eq(1).click();
    cy.intercept('GET', '**/api/v2/pim/employees*').as('hiringManagers');
    cy.get('input[placeholder="Type for hints..."]').type('a');
    cy.wait('@hiringManagers');
    cy.get('.oxd-autocomplete-option').should('not.contain', 'Searching....').first().click();
    cy.contains('button', 'Save').click();
    cy.location('pathname').should('match', /\/recruitment\/addJobVacancy\/\d+$/);
    cy.contains('.oxd-label', 'Vacancy Name').parents('.oxd-input-group').find('input').should('have.value', vacancyName);
    cy.visit('/web/index.php/recruitment/addCandidate');
    cy.get('input[name="firstName"]').type(candidateFirstName);
    cy.get('input[name="lastName"]').type('Cypress');
    cy.get('input[placeholder="Type here"]').first().type(candidateEmail);
    cy.contains('.oxd-label', 'Vacancy').parents('.oxd-input-group').find('.oxd-select-text').click();
    cy.contains('.oxd-select-option', vacancyName).click();
    cy.contains('button', 'Save').click();
    cy.contains('.oxd-toast', 'Success').should('be.visible');
    cy.contains('.oxd-button', 'Shortlist').click();
    cy.get('textarea').type('Perfil aderente a vaga');
    cy.contains('button', 'Save').click();
    cy.contains('.oxd-toast', 'Success').should('be.visible');
    cy.contains('.oxd-text', 'Shortlisted').should('be.visible');
  });
});
