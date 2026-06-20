describe('RF-001 - OrangeHRM', () => {
  it('CT-001-E - Bloquear criação com número de posições igual a zero', () => {
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.visit('/web/index.php/recruitment/viewJobVacancy');
    cy.contains('.oxd-button', 'Add').click();
    cy.get('.oxd-input-group').contains('Job Title').parent().find('.oxd-select-text').click();
    cy.contains('.oxd-select-option', 'QA Engineer').click();
    cy.get('.oxd-input-group').contains('Vacancy Name').parent().find('input').type('QA Engineer Sem Posição');
    cy.get('.oxd-input-group').contains(/Number of Positions|Number of Vacancies/i).parent().find('input').clear().type('0');
    cy.get('.oxd-autocomplete-text-input input').type('Amelia Brown');
    cy.contains('.oxd-autocomplete-option', 'Amelia Brown').click();
    cy.get('.oxd-input-group').contains('Location').parent().find('.oxd-select-text').click();
    cy.contains('.oxd-select-option', 'São Paulo HQ').click();
    cy.contains('button', /Next|Avançar/i).click();
    cy.get('.oxd-input-field-error-message').should('be.visible');
    cy.contains('.oxd-stepper-header, .orangehrm-wizard-header', /Vacancy Info|Vaga Info/i).should('be.visible');
  });
});
