describe('RF-001', () => {
  it('CT-001-P - Fluxo positivo - Usuario deve conseguir fazer login no OrangeHRM com credenciais validas.', () => {
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').should('be.visible').type('Admin');
    cy.get('input[name="password"]').should('be.visible').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/web/index.php/dashboard/index');
    cy.get('.oxd-topbar-header-title').should('contain', 'Dashboard');
  });
});
