describe('RF-008 - OrangeHRM', () => {
  it('CT-003-N - Ocultar Shortlist para candidato sem vaga', () => {
    cy.visit('/web/index.php/auth/login');
    cy.location('pathname').then((pathname) => {
      if (pathname.includes('/auth/login')) {
        cy.get('input[name="username"]', { timeout: 20000 }).type('Admin');
        cy.get('input[name="password"]').type('admin123');
        cy.get('button[type="submit"]').click();
      }
    });
    cy.location('pathname', { timeout: 20000 }).should('include', '/dashboard');
    const suffix = Date.now();
    const candidateFirstName = `QA${suffix}`;
    const candidateEmail = `qa.${suffix}@example.com`;
    cy.visit('/web/index.php/recruitment/addCandidate');
    cy.get('input[name="firstName"]').type(candidateFirstName);
    cy.get('input[name="lastName"]').type('Cypress');
    cy.get('input[placeholder="Type here"]').first().type(candidateEmail);
    cy.contains('button', 'Save').click();
    cy.contains('.oxd-toast', 'Success').should('be.visible');
    cy.contains('.oxd-button', 'Shortlist').should('not.exist');
  });
});
