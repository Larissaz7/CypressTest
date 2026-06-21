describe('RF-006 - OrangeHRM', () => {
  it('CT-002-N - Bloquear candidato sem e-mail', () => {
    cy.visit('/web/index.php/auth/login');
    cy.location('pathname').then((pathname) => {
      if (pathname.includes('/auth/login')) {
        cy.get('input[name="username"]', { timeout: 20000 }).type('Admin');
        cy.get('input[name="password"]').type('admin123');
        cy.get('button[type="submit"]').click();
      }
    });
    cy.location('pathname', { timeout: 20000 }).should('include', '/dashboard');
    cy.visit('/web/index.php/recruitment/addCandidate');
    cy.get('input[name="firstName"]').type('Marina');
    cy.get('input[name="lastName"]').type('Almeida');
    cy.contains('button', 'Save').click();
    cy.get('.oxd-input-field-error-message, .oxd-toast').should('be.visible');
  });
});
