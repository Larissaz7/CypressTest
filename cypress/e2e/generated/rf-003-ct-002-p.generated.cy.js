describe('RF-003 - OrangeHRM', () => {
  it('CT-002-P - Criar vaga a partir do template QA Automation', () => {
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.visit('/web/index.php/recruitment/viewJobVacancy');
    cy.contains('.oxd-button', 'Add').click();
    cy.contains('.oxd-button', /Use Template|Usar Modelo/i).click();
    cy.get('.oxd-dialog-container .oxd-select-text').click();
    cy.contains('.oxd-select-option', 'QA Automation Standard').click();
    cy.contains('.oxd-dialog-container button', /Apply Template|Aplicar Modelo/i).click();
    cy.contains('.oxd-text', 'QA Automation Standard').should('be.visible');
    cy.contains('.oxd-stepper-header, .orangehrm-wizard-header', 'Workflow').should('be.visible');
  });
});
