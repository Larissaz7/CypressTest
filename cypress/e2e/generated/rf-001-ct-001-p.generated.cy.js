describe('RF-001 - OrangeHRM', () => {
  it('CT-001-P - Criar vaga com informações básicas e avançar para Workflow', () => {
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.visit('/web/index.php/recruitment/viewJobVacancy');
    cy.contains('.oxd-button', 'Add').click();
    cy.get('.oxd-input-group').contains('Job Title').parent().find('.oxd-select-text').click();
    cy.contains('.oxd-select-option', 'QA Engineer').click();
    cy.get('.oxd-input-group').contains('Vacancy Name').parent().find('input').type('QA Engineer Pleno 2026');
    cy.get('.oxd-input-group').contains(/Number of Positions|Number of Vacancies/i).parent().find('input').clear().type('2');
    cy.get('.oxd-autocomplete-text-input input').type('Amelia Brown');
    cy.contains('.oxd-autocomplete-option', 'Amelia Brown').click();
    cy.get('.oxd-input-group').contains('Location').parent().find('.oxd-select-text').click();
    cy.contains('.oxd-select-option', 'São Paulo HQ').click();
    cy.get('textarea').type('Automação de testes web com Cypress e integração contínua');
    cy.contains('button', /Next|Avançar/i).click();
    cy.contains('.oxd-stepper-header, .orangehrm-wizard-header', 'Workflow').should('be.visible');
  });
});
