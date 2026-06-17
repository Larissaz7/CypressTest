describe('RF-001', () => {
  it('CT-001-E - Caso de excecao - Usuario deve conseguir fazer login no OrangeHRM com credenciais validas.', () => {
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').should('be.visible').clear();
    cy.get('input[name="password"]').should('be.visible').clear();
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-input-field-error-message').should('be.visible');
  });
});
