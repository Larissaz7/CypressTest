describe('RF-002 - OrangeHRM', () => {
  it('CT-001-E - Bloquear vaga com quantidade não numérica', () => {
    cy.visit('/web/index.php/auth/login');
    cy.location('pathname').then((pathname) => {
      if (pathname.includes('/auth/login')) {
        cy.get('input[name="username"]', { timeout: 20000 }).type('Admin');
        cy.get('input[name="password"]').type('admin123');
        cy.get('button[type="submit"]').click();
      }
    });
    cy.location('pathname', { timeout: 20000 }).should('include', '/dashboard');
    cy.visit('/web/index.php/recruitment/addJobVacancy');
    cy.contains('.oxd-label', 'Vacancy Name').parents('.oxd-input-group').find('input').type('QA Quantity Invalid');
    cy.contains('.oxd-label', 'Number of Positions').parents('.oxd-input-group').find('input').clear().type('abc');
    cy.contains('button', 'Save').click();
    cy.get('.oxd-input-field-error-message').should('be.visible');
  });
});
