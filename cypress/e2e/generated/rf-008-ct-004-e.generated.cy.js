describe('RF-008 - OrangeHRM', () => {
  it('CT-004-E - Tratar pergunta removida durante a configuração da regra', () => {
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.visit('/web/index.php/recruitment/addJobVacancy?step=smart-screening');
    cy.contains('.oxd-button', /Add Rule|Adicionar Regra/i).click();
    cy.get('.oxd-dialog-container .oxd-select-text').first().click();
    cy.contains('.oxd-select-option', 'Certificação ISTQB?').should('not.exist');
  });
});
