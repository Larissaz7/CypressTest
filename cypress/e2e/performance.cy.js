describe('OrangeHRM - Módulo de Performance (Manage Reviews) - Completo', () => {

  const idUnico = Date.now().toString().slice(-4);
  const nomeFuncionario = 'Odis'; // Funcionário padrão da base demo
  const dataHoje = new Date().toISOString().split('T')[0]; // Data atual (AAAA-MM-DD)

  beforeEach(() => {
    // 1. Efetua o login administrativo
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    // 2. Navega até o módulo Performance > Manage Reviews
    cy.contains('.oxd-main-menu-item', 'Performance').click();
    cy.contains('.oxd-topbar-body-nav-tab', 'Manage Reviews').click();
    cy.contains('.oxd-topbar-body-nav-tab-link', 'Manage Reviews').click();
  });

  
  // CENÁRIOS POSITIVOS

  it('Deve criar uma nova revisão de desempenho com sucesso', () => {
    cy.contains('button', 'Add').click();
    
    cy.get('.oxd-autocomplete-text-input input').first().type(nomeFuncionario);
    cy.get('.oxd-autocomplete-dropdown', { timeout: 6000 }).contains(nomeFuncionario).click();

    cy.get('.oxd-autocomplete-text-input input').last().type('Admin');
    cy.get('.oxd-autocomplete-dropdown', { timeout: 6000 }).contains('Admin').click();

    cy.get('.oxd-date-input input').eq(0).clear().type(dataHoje);
    cy.get('.oxd-date-input input').eq(1).clear().type('2026-12-31');
    cy.get('.oxd-date-input input').eq(2).clear().type('2026-12-31');

    cy.get('h6').first().click(); // Fecha calendário
    cy.get('button[type="submit"]').click();

    cy.get('.oxd-toast-content', { timeout: 8000 }).should('be.visible').and('contain', 'Successfully Saved');
  });

  it('Deve pesquisar uma revisão de desempenho pelo nome do funcionário', () => {
    cy.get('.oxd-autocomplete-text-input input').first().type(nomeFuncionario);
    cy.get('.oxd-autocomplete-dropdown', { timeout: 5000 }).contains(nomeFuncionario).click();
    cy.get('button[type="submit"]').click({ force: true });

    cy.get('.oxd-table-body').should('be.visible').and('contain', nomeFuncionario);
  });


  // NOVOS CENÁRIOS NEGATIVOS

  it('Cenário Negativo 1: Deve impedir o salvamento com campos obrigatórios vazios', () => {
    cy.contains('button', 'Add').click();

    // Tenta clicar direto no botão de Submit sem preencher absolutamente nada
    cy.get('button[type="submit"]').click();

    // Validação: No OrangeHRM, campos obrigatórios vazios exibem a mensagem "Required" logo abaixo do input
    // Vamos garantir que a classe de erro de input do sistema aparece na tela
    cy.get('.oxd-input-group__message')
      .should('be.visible')
      .and('contain', 'Required');
    
    // Garante que a URL não mudou, ou seja, continuamos na página de cadastro
    cy.url().should('include', '/performance/manageReview');
  });

  it('Cenário Negativo 2: Deve exibir erro ao inserir um funcionário inexistente', () => {
    cy.contains('button', 'Add').click();

    // Digita um nome aleatório que sabidamente não existe no sistema
    cy.get('.oxd-autocomplete-text-input input').first().type('Funcionario Fantasma Inexistente');

    // Força o clique em salvar sem selecionar nada do dropdown
    cy.get('button[type="submit"]').click();

    // Validação: O OrangeHRM exibe uma mensagem de "Invalid" abaixo do campo de autocomplete
    cy.get('.oxd-input-group__message')
      .should('be.visible')
      .and('contain', 'Invalid');
  });

  it('Cenário Negativo 3: Deve validar inconsistência crônica de datas (Data Fim menor que Data Início)', () => {
    cy.contains('button', 'Add').click();

    // Preenche os campos obrigatórios de nome para isolar o erro nas datas
    cy.get('.oxd-autocomplete-text-input input').first().type(nomeFuncionario);
    cy.get('.oxd-autocomplete-dropdown', { timeout: 5000 }).contains(nomeFuncionario).click();

    // Insere uma Data de Início no futuro e uma Data de Término no passado
    cy.get('.oxd-date-input input').eq(0).clear().type('2026-12-31'); // From Date (Futuro)
    cy.get('.oxd-date-input input').eq(1).clear().type('2026-01-01'); // To Date (Passado)

    cy.get('h6').first().click(); // Fecha calendário flutuante
    cy.get('button[type="submit"]').click();

    // Validação: O sistema deve validar que a data final não pode ser anterior à inicial
    // Geralmente exibe uma mensagem como "Should be a valid date in correct format" ou "To date should be after From date"
    cy.get('.oxd-input-group__message')
      .should('be.visible')
      .and('not.contain', 'Required'); // Garante que o erro não é de campo vazio, mas sim de validação lógica
  });

  it('Cenário Negativo 4: Deve exibir mensagem de erro ao pesquisar por um termo sem resultados na listagem', () => {
    // Digita um nome bizarro no filtro de busca da listagem principal
    cy.get('.oxd-autocomplete-text-input input').first().type('Ninguem Com Esse Nome');
    
    // Como não há dropdown, clicamos direto em Search forçando a barra
    cy.get('button[type="submit"]').click({ force: true });

    // Validação: O sistema deve exibir um alerta na tela indicando que nenhum registro foi encontrado
    // No grid do OrangeHRM, aparece um Toast informativo ou uma linha de texto dizendo "No Records Found"
    cy.get('.orangehrm-horizontal-padding')
      .should('be.visible')
      .and('contain', 'No Records Found');
  });
});