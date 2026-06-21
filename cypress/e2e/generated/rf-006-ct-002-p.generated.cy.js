describe('RF-006 - OrangeHRM', () => {
  it('CT-002-P - Cadastrar candidato manualmente', () => {
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
    cy.get('input[name="middleName"]').type('Beatriz');
    cy.get('input[name="lastName"]').type('Almeida');
    cy.get('input[placeholder="Type here"]').first().type('marina.qa@example.com');
    cy.get('input[placeholder="Type here"]').eq(1).type('85999990001');
    cy.get('input[placeholder="Enter comma seperated words..."]').type('cypress,qa');
    cy.contains('button', 'Save').click();
    cy.contains('.oxd-toast', 'Success').should('be.visible');
  });
});
