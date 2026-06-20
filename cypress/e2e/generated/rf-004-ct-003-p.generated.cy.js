describe('RF-004 - OrangeHRM', () => {
  it('CT-003-P - Adicionar etapa técnica e entrevistador ao Workflow', () => {
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.visit('/web/index.php/recruitment/addJobVacancy?step=workflow');
    cy.contains('.oxd-button', /Add Stage|Adicionar Etapa/i).click();
    cy.get('.oxd-dialog-container input').first().type('Entrevista Técnica');
    cy.get('.oxd-dialog-container .oxd-autocomplete-text-input input').type('Amelia Brown');
    cy.contains('.oxd-autocomplete-option', 'Amelia Brown').click();
    cy.contains('.oxd-dialog-container button', /Add|Adicionar/i).click();
    cy.contains('.oxd-table-row, .orangehrm-workflow-stage', 'Entrevista Técnica').should('contain', 'Amelia Brown');
  });
});
