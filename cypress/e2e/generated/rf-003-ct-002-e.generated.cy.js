describe('RF-003 - OrangeHRM', () => {
  it('CT-002-E - Tratar falha ao carregar template indisponível', () => {
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.visit('/web/index.php/recruitment/viewJobVacancy');
    cy.contains('.oxd-button', 'Add').click();
    cy.contains('.oxd-button', /Use Template|Usar Modelo/i).click();
    cy.get('.oxd-dialog-container .oxd-select-text').click();
    cy.contains('.oxd-select-option', 'Legacy Recruitment').click();
    cy.contains('.oxd-dialog-container button', /Apply Template|Aplicar Modelo/i).click();
    cy.get('.oxd-alert, .oxd-toast').should('be.visible').and('contain.text', 'modelo');
  });
});
