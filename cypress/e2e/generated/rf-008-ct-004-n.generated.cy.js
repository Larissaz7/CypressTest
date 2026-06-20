describe('RF-008 - OrangeHRM', () => {
  it('CT-004-N - Bloquear regra de triagem sem ação automática', () => {
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.visit('/web/index.php/recruitment/addJobVacancy?step=smart-screening');
    cy.contains('.oxd-button', /Add Rule|Adicionar Regra/i).click();
    cy.get('.oxd-dialog-container .oxd-select-text').eq(0).click();
    cy.contains('.oxd-select-option', 'Possui experiência com Cypress?').click();
    cy.get('.oxd-dialog-container .oxd-select-text').eq(1).click();
    cy.contains('.oxd-select-option', 'Não').click();
    cy.contains('.oxd-dialog-container button', /Save Rule|Salvar Regra/i).click();
    cy.get('.oxd-dialog-container .oxd-input-field-error-message').should('be.visible');
  });
});
