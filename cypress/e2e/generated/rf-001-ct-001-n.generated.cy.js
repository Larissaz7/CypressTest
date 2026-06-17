describe('RF-001', () => {
  it('CT-001-N - Fluxo negativo - Usuario deve conseguir fazer login no OrangeHRM com credenciais validas.', () => {
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').should('be.visible').type('UsuarioInvalido');
    cy.get('input[name="password"]').should('be.visible').type('senhaErrada');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-alert-content').should('be.visible').and('contain', 'Invalid credentials');
  });
});
