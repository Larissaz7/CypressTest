describe('OrangeHRM - Recruitment > Vacancies', () => {
  beforeEach(() => {
    // Logs in and confirms the dashboard was loaded.
    cy.visit('/web/index.php/auth/login');

    cy.get('input[name="username"]').should('be.visible').type('Admin');
    cy.get('input[name="password"]').should('be.visible').type('admin123');
    cy.get('button[type="submit"]').should('be.enabled').click();

    cy.url().should('include', '/web/index.php/dashboard/index');
    cy.contains('h6', 'Dashboard').should('be.visible');
  });

  it('deve cadastrar uma nova vaga com sucesso', () => {
    const vacancyName = `QA Automation Vacancy ${Date.now()}`;

    // Opens Recruitment and navigates to the Vacancies tab.
    cy.contains('.oxd-main-menu-item', 'Recruitment').should('be.visible').click();

    cy.url().should('include', '/web/index.php/recruitment');
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Vacancies')
      .should('be.visible')
      .click();

    cy.url().should('include', '/web/index.php/recruitment/viewJobVacancy');
    cy.contains('h5', 'Vacancies').should('be.visible');

    // Opens the vacancy creation form.
    cy.contains('button', 'Add').should('be.visible').click();

    cy.url().should('include', '/web/index.php/recruitment/addJobVacancy');
    cy.contains('h6', 'Add Vacancy').should('be.visible');

    // Fills the required vacancy details.
    cy.contains('label', 'Vacancy Name')
      .parents('.oxd-input-group')
      .find('input')
      .should('be.visible')
      .type(vacancyName);

    cy.contains('label', 'Job Title')
      .parents('.oxd-input-group')
      .find('.oxd-select-text')
      .should('be.visible')
      .click();

    cy.get('.oxd-select-dropdown')
      .should('be.visible')
      .find('[role="option"]')
      .should('have.length.greaterThan', 1)
      .eq(1)
      .click();

    cy.contains('label', 'Hiring Manager')
      .parents('.oxd-input-group')
      .find('input')
      .should('be.visible')
      .type('a');

    cy.get('.oxd-autocomplete-dropdown [role="option"]', { timeout: 10000 })
      .should('be.visible')
      .and(($options) => {
        expect($options.text()).not.to.include('No Records Found');
      })
      .first()
      .click();

    // Saves the vacancy and validates the success feedback.
    cy.contains('button', 'Save').should('be.enabled').click();

    cy.contains('.oxd-toast', 'Successfully Saved', { timeout: 10000 })
      .should('be.visible');

    // Confirms the created vacancy remains loaded on the form.
    cy.contains('label', 'Vacancy Name')
      .parents('.oxd-input-group')
      .find('input')
      .should('have.value', vacancyName);
  });
});
