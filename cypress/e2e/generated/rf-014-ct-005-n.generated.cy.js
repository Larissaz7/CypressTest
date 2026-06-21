describe('RF-014 - OrangeHRM', () => {
  it('CT-005-N - Bloquear supervisor sem Reporting Method', () => {
    cy.visit('/web/index.php/auth/login');
    cy.location('pathname').then((pathname) => {
      if (pathname.includes('/auth/login')) {
        cy.get('input[name="username"]', { timeout: 20000 }).type('Admin');
        cy.get('input[name="password"]').type('admin123');
        cy.get('button[type="submit"]').click();
      }
    });
    cy.location('pathname', { timeout: 20000 }).should('include', '/dashboard');
    cy.visit('/web/index.php/pim/viewEmployeeList');
    cy.get('.oxd-table-body .oxd-table-row').first().find('.bi-pencil-fill').click();
    cy.contains('.orangehrm-tabs-item', 'Job').click();
    cy.contains('.orangehrm-tabs-item', 'Report-to').click();
    cy.contains('button', 'Add').first().click();
    cy.contains('button', 'Save').click();
    cy.get('.oxd-input-field-error-message, .oxd-toast').should('be.visible');
  });
});
