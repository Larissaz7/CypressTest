describe('OrangeHRM - Módulo de Recruitment (Recrutamento)', () => {
  
  const idUnico = Date.now().toString().slice(-4);
  const nomeCandidato = `Candidato_${idUnico}`;
  const sobrenomeCandidato = 'QA';
  const emailCandidato = `qa_${idUnico}@teste.com`;

  beforeEach(() => {
    // 1. Faz o login
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    // 2. Navega até o menu Recruitment
    cy.contains('.oxd-main-menu-item', 'Recruitment').click();
    cy.url().should('include', '/recruitment/viewCandidates');
  });

  it('Deve adicionar um novo candidato preenchendo os campos obrigatórios', () => {
    // Clica no botão "Add" para abrir o formulário
    cy.contains('button', 'Add').click();
    cy.url().should('include', '/addCandidate');

    // Preenche Nome e Sobrenome
    cy.get('input[name="firstName"]').type(nomeCandidato);
    cy.get('input[name="lastName"]').type(sobrenomeCandidato);

    // Lidar com o Dropdown de Vacancy (Vaga)
    // Clica no componente para abrir as opções e seleciona uma existente (ex: "Senior QA Lead")
    cy.get('.oxd-select-text').click();
    cy.get('.oxd-select-dropdown')
      .should('be.visible')
      .contains('QA') // Busca uma vaga que contenha "QA" no nome
      .click();

    // Preenche o e-mail
    cy.get('input[placeholder="Type here"]').first().type(emailCandidato);

    // Clica em Salvar
    cy.get('button[type="submit"]').click();

    // Validações
    cy.get('.oxd-toast-content', { timeout: 8000 })
      .should('be.visible')
      .and('contain', 'Successfully Saved');

    // Verifica se a página mudou para o perfil do candidato cadastrado (Application Stage)
    cy.contains('h6', 'Application Stage').should('be.visible');
    cy.get('.oxd-text--h6').should('contain', `${nomeCandidato} ${sobrenomeCandidato}`);
  });

  it('Deve buscar um candidato pelo nome na listagem', () => {
    // O OrangeHRM usa um campo de autocomplete para o nome do candidato
    // Digitamos parte do nome que criamos no teste anterior
    cy.get('.oxd-autocomplete-text-input input')
      .first()
      .type(nomeCandidato);

    // Espera o autocomplete do sistema carregar e clica na opção sugerida
    cy.get('.oxd-autocomplete-dropdown', { timeout: 5000 })
      .should('be.visible')
      .contains(nomeCandidato)
      .click();

    // Clica no botão "Search"
    cy.get('button[type="submit"]').click({ force: true });

    // Valida se o candidato aparece na tabela de resultados
    cy.get('.oxd-table-body')
      .should('be.visible')
      .and('contain', nomeCandidato)
      .and('contain', sobrenomeCandidato);
  });
});