describe('OrangeHRM - Testes de Login', () => {
  
  beforeEach(() => {
    // Como definimos a baseUrl, o '/' vai direto para o site
    cy.visit('/web/index.php/auth/login');
  });

  it('Deve realizar o login com sucesso usando credenciais válidas', () => {
    // Preenche o usuário (usando o atributo name do input)
    cy.get('input[name="username"]')
      .should('be.visible')
      .type('Admin');

    // Preenche a senha
    cy.get('input[name="password"]')
      .should('be.visible')
      .type('admin123');

    // Clica no botão de Submit
    cy.get('button[type="submit"]').click();

    // Validação: Verifica se fomos redirecionados para o Dashboard
    cy.url().should('include', '/web/index.php/dashboard/index');
    
    // Validação extra: Verifica se o cabeçalho do Dashboard está visível
    cy.get('.oxd-topbar-header-title').should('contain', 'Dashboard');
  });

  it('Deve exibir mensagem de erro ao inserir credenciais inválidas', () => {
    cy.get('input[name="username"]').type('UsuarioInvalido');
    cy.get('input[name="password"]').type('senhaErrada');
    cy.get('button[type="submit"]').click();

    // Validação: Verifica se o alerta de erro aparece na tela
    cy.get('.oxd-alert-content')
      .should('be.visible')
      .and('contain', 'Invalid credentials');
  });
});