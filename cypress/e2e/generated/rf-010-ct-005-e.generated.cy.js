describe('RF-010 - OrangeHRM', () => {
  it('CT-005-E - Publicar localmente quando a integração externa falhar', () => {
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.visit('/web/index.php/recruitment/viewJobVacancy');
    cy.contains('.oxd-table-row', 'QA Engineer Pleno 2026').find('.bi-pencil-fill, .bi-eye-fill').first().click();
    cy.contains('.orangehrm-tabs-item, .oxd-tab', /Publish|Job Posting|Divulgação/i).click();
    cy.contains('.oxd-checkbox-wrapper', 'Career Portal').click();
    cy.contains('.oxd-checkbox-wrapper', 'LinkedIn').click();
    cy.contains('.oxd-button', /Publish Vacancy|Publicar Vaga/i).click();
    cy.contains('.oxd-dialog-container button', /Confirm|Confirmar/i).click();
    cy.contains('.oxd-text', /Active|Ativa/i).should('be.visible');
    cy.get('.oxd-alert, .oxd-toast').should('be.visible').and('contain.text', 'extern');
  });
});
