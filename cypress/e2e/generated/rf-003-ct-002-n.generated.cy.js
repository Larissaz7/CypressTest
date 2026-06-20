describe('RF-003 - OrangeHRM', () => {
  it('CT-002-N - Bloquear aplicação sem selecionar um template', () => {
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.visit('/web/index.php/recruitment/viewJobVacancy');
    cy.contains('.oxd-button', 'Add').click();
    cy.contains('.oxd-button', /Use Template|Usar Modelo/i).click();
    cy.contains('.oxd-dialog-container button', /Apply Template|Aplicar Modelo/i).click();
    cy.get('.oxd-dialog-container .oxd-input-field-error-message').should('contain', 'Required');
  });
});
