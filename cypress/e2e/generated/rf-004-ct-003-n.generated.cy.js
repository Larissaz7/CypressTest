describe('RF-004 - OrangeHRM', () => {
  it('CT-003-N - Bloquear Workflow sem nenhuma etapa de recrutamento', () => {
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.visit('/web/index.php/recruitment/addJobVacancy?step=workflow');
    cy.get('.oxd-table-row .bi-trash').each(($button) => cy.wrap($button).click());
    cy.contains('button', /Next|Avançar/i).click();
    cy.get('.oxd-alert, .oxd-input-field-error-message').should('be.visible').and('contain.text', 'etapa');
  });
});
