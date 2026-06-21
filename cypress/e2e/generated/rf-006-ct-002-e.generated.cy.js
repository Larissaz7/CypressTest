describe('RF-006 - OrangeHRM', () => {
  it('CT-002-E - Bloquear candidato com e-mail malformado', () => {
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
    cy.get('input[name="firstName"]').type('Paulo');
    cy.get('input[name="lastName"]').type('Costa');
    cy.get('input[placeholder="Type here"]').first().type('paulo-sem-arroba');
    cy.contains('button', 'Save').click();
    cy.get('.oxd-input-field-error-message, .oxd-toast').should('be.visible');
  });
});
