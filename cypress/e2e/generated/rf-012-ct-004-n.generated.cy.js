describe('RF-012 - OrangeHRM', () => {
  it('CT-004-N - Bloquear funcionário sem First Name', () => {
    cy.visit('/web/index.php/auth/login');
    cy.location('pathname').then((pathname) => {
      if (pathname.includes('/auth/login')) {
        cy.get('input[name="username"]', { timeout: 20000 }).type('Admin');
        cy.get('input[name="password"]').type('admin123');
        cy.get('button[type="submit"]').click();
      }
    });
    cy.location('pathname', { timeout: 20000 }).should('include', '/dashboard');
    cy.visit('/web/index.php/pim/addEmployee');
    cy.get('input[name="lastName"]').type('Almeida');
    cy.contains('.oxd-label', 'Employee Id').parents('.oxd-input-group').find('input').clear().type('92013');
    cy.contains('button', 'Save').click();
    cy.get('.oxd-input-field-error-message').should('be.visible');
  });
});
