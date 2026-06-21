describe('RF-012 - OrangeHRM', () => {
  it('CT-004-P - Cadastrar funcionário com dados básicos', () => {
    cy.visit('/web/index.php/auth/login');
    cy.location('pathname').then((pathname) => {
      if (pathname.includes('/auth/login')) {
        cy.get('input[name="username"]', { timeout: 20000 }).type('Admin');
        cy.get('input[name="password"]').type('admin123');
        cy.get('button[type="submit"]').click();
      }
    });
    cy.location('pathname', { timeout: 20000 }).should('include', '/dashboard');
    const employeeId = String(Date.now()).slice(-6);
    cy.visit('/web/index.php/pim/addEmployee');
    cy.get('input[name="firstName"]').type('Marina');
    cy.get('input[name="middleName"]').type('Beatriz');
    cy.get('input[name="lastName"]').type('Almeida');
    cy.contains('.oxd-label', 'Employee Id').parents('.oxd-input-group').find('input').clear().type(employeeId);
    cy.contains('button', 'Save').click();
    cy.url().should('include', '/pim/viewPersonalDetails/empNumber/');
  });
});
