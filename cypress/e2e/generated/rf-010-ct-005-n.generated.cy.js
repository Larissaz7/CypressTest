describe('RF-010 - OrangeHRM', () => {
  it('CT-005-N - Bloquear publicação de vaga com configuração incompleta', () => {
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.visit('/web/index.php/recruitment/viewJobVacancy');
    cy.contains('.oxd-table-row', 'Backend Incompleta').find('.bi-pencil-fill, .bi-eye-fill').first().click();
    cy.contains('.orangehrm-tabs-item, .oxd-tab', /Publish|Job Posting|Divulgação/i).click();
    cy.contains('.oxd-checkbox-wrapper', 'Career Portal').click();
    cy.contains('.oxd-button', /Publish Vacancy|Publicar Vaga/i).click();
    cy.get('.oxd-alert, .oxd-toast').should('be.visible').and('contain.text', 'Workflow');
    cy.contains('.oxd-text', /Draft|Rascunho/i).should('be.visible');
  });
});
