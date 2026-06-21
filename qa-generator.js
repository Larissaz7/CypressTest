const path = require("path");

const BANNED = /preencher dados v[aá]lidos|informar dados inv[aá]lidos|clicar na a[cç][aã]o principal|acessar a funcionalidade descrita|simular condi[cç][aã]o inesperada/i;

function s(titulo, pre, dados, passos, resultado) {
  return { titulo, pre, dados, passos, resultado };
}

const DESIGNS = {
  "RF-001": {
    P: s("Filtrar vagas ativas por cargo", ["Usuário autenticado", "Tela Recruitment > Vacancies disponível"], { job_title: "Account Assistant", status: "Active" }, ["Acessar 'Recruitment > Vacancies'.", "Selecionar 'Account Assistant' em Job Title.", "Selecionar 'Active' em Status.", "Clicar em 'Search'."], "A listagem é atualizada e a área de resultados permanece visível com os filtros aplicados."),
    N: s("Pesquisar vaga inexistente", ["Usuário autenticado", "Tela de vagas disponível"], { vacancy: "VAGA-INEXISTENTE-99999" }, ["Acessar 'Recruitment > Vacancies'.", "Abrir o filtro Vacancy e procurar 'VAGA-INEXISTENTE-99999'.", "Clicar em 'Search'."], "O sistema não apresenta uma vaga incompatível e exibe zero registros ou lista vazia."),
    E: s("Limpar filtros da consulta de vagas", ["Usuário autenticado", "Filtros de vagas preenchidos"], { job_title: "Account Assistant", status: "Inactive" }, ["Acessar 'Recruitment > Vacancies'.", "Selecionar Job Title 'Account Assistant' e Status 'Inactive'.", "Clicar em 'Reset'."], "Os filtros retornam ao estado inicial e a listagem padrão é restaurada."),
  },
  "RF-002": {
    P: s("Cadastrar vaga ativa com sucesso", ["Usuário autenticado", "Existe Job Title e Hiring Manager ativos"], { vacancy_name: "QA Automation 2026", job_title: "Account Assistant", hiring_manager: "a", positions: "2", description: "Automação de testes Cypress" }, ["Acessar 'Recruitment > Vacancies' e clicar em 'Add'.", "Preencher Vacancy Name com 'QA Automation 2026'.", "Selecionar Job Title 'Account Assistant'.", "Selecionar o primeiro Hiring Manager retornado ao digitar 'a'.", "Preencher Number of Positions com '2', Description com 'Automação de testes Cypress' e clicar em 'Save'."], "O sistema exibe toast Success e abre os detalhes da vaga salva."),
    N: s("Bloquear vaga sem nome", ["Usuário autenticado", "Tela Add Vacancy aberta"], { vacancy_name: "", job_title: "Account Assistant", hiring_manager: "a" }, ["Acessar 'Recruitment > Vacancies > Add'.", "Selecionar Job Title 'Account Assistant'.", "Selecionar o primeiro Hiring Manager retornado ao digitar 'a'.", "Manter Vacancy Name vazio e clicar em 'Save'."], "O formulário permanece aberto e exibe Required abaixo de Vacancy Name."),
    E: s("Bloquear vaga com quantidade não numérica", ["Usuário autenticado", "Tela Add Vacancy aberta"], { vacancy_name: "QA Quantity Invalid", positions: "abc" }, ["Acessar 'Recruitment > Vacancies > Add'.", "Preencher Vacancy Name com 'QA Quantity Invalid'.", "Digitar 'abc' em Number of Positions.", "Clicar em 'Save'."], "O campo Number of Positions rejeita o valor ou exibe mensagem de formato numérico inválido."),
  },
  "RF-003": {
    P: s("Publicar vaga no RSS e Web Page", ["Usuário autenticado", "Tela Add Vacancy aberta"], { active: true, publish: true }, ["Preencher os dados obrigatórios de uma nova vaga.", "Manter Active habilitado.", "Habilitar Publish in RSS Feed and Web Page.", "Clicar em 'Save'."], "O sistema salva a vaga e apresenta RSS Feed URL e Web Page URL."),
    N: s("Salvar vaga sem publicação pública", ["Usuário autenticado", "Tela Add Vacancy aberta"], { active: true, publish: false }, ["Preencher os dados obrigatórios da vaga.", "Manter Active habilitado e Publish in RSS Feed and Web Page desabilitado.", "Clicar em 'Save'."], "A vaga é salva sem disponibilização pública e sem confirmação de publicação no RSS/Web Page."),
    E: s("Salvar vaga inativa e não publicada", ["Usuário autenticado", "Tela Add Vacancy aberta"], { active: false, publish: false }, ["Preencher os dados obrigatórios da vaga.", "Desabilitar Active e Publish in RSS Feed and Web Page.", "Clicar em 'Save'."], "A vaga é salva com status Inactive e não é publicada nos canais públicos."),
  },
  "RF-004": {
    P: s("Aceitar quantidade válida de posições", ["Usuário autenticado", "Tela Add Vacancy aberta"], { positions: "3" }, ["Preencher Vacancy Name, Job Title e Hiring Manager.", "Informar '3' em Number of Positions.", "Clicar em 'Save'."], "O sistema aceita a quantidade numérica e salva a vaga."),
    N: s("Exibir validações dos campos obrigatórios", ["Usuário autenticado", "Tela Add Vacancy aberta"], {}, ["Acessar 'Recruitment > Vacancies > Add'.", "Manter Vacancy Name, Job Title e Hiring Manager vazios.", "Clicar em 'Save'."], "O sistema permanece no formulário e exibe mensagens Required nos campos obrigatórios."),
    E: s("Bloquear quantidade negativa de posições", ["Usuário autenticado", "Tela Add Vacancy aberta"], { positions: "-1" }, ["Preencher Vacancy Name, Job Title e Hiring Manager.", "Informar '-1' em Number of Positions.", "Clicar em 'Save'."], "O sistema não salva a vaga e apresenta validação no campo Number of Positions."),
  },
  "RF-005": {
    P: s("Filtrar candidatos por status", ["Usuário autenticado", "Tela Recruitment > Candidates disponível"], { status: "Application Initiated" }, ["Acessar 'Recruitment > Candidates'.", "Selecionar 'Application Initiated' em Status.", "Clicar em 'Search'."], "A tela atualiza a listagem e mantém o filtro Application Initiated selecionado."),
    N: s("Pesquisar candidato inexistente", ["Usuário autenticado", "Tela Candidates disponível"], { candidate_name: "Pessoa Inexistente 99999" }, ["Acessar 'Recruitment > Candidates'.", "Digitar 'Pessoa Inexistente 99999' em Candidate Name.", "Clicar em 'Search'."], "O sistema não retorna candidato incompatível e apresenta lista vazia ou zero registros."),
    E: s("Limpar todos os filtros de candidatos", ["Usuário autenticado", "Filtros Status e Keywords preenchidos"], { status: "Rejected", keywords: "cypress,qa" }, ["Acessar 'Recruitment > Candidates'.", "Selecionar Status Rejected e preencher Keywords com 'cypress,qa'.", "Clicar em 'Reset'."], "Status, Keywords e demais filtros retornam ao estado inicial."),
  },
  "RF-006": {
    P: s("Cadastrar candidato manualmente", ["Usuário autenticado", "Tela Add Candidate disponível"], { first_name: "Marina", middle_name: "Beatriz", last_name: "Almeida", email: "marina.qa@example.com", phone: "85999990001", keywords: "cypress,qa" }, ["Acessar 'Recruitment > Candidates' e clicar em 'Add'.", "Preencher First Name, Middle Name e Last Name com Marina Beatriz Almeida.", "Preencher Email com marina.qa@example.com e Contact Number com 85999990001.", "Preencher Keywords com 'cypress,qa', marcar Consent to keep data e clicar em 'Save'."], "O sistema exibe toast Success e abre o perfil do candidato cadastrado."),
    N: s("Bloquear candidato sem e-mail", ["Usuário autenticado", "Tela Add Candidate aberta"], { first_name: "Marina", last_name: "Almeida", email: "" }, ["Preencher First Name com Marina e Last Name com Almeida.", "Manter Email vazio.", "Clicar em 'Save'."], "O formulário permanece aberto e exibe Required junto ao Email."),
    E: s("Bloquear candidato com e-mail malformado", ["Usuário autenticado", "Tela Add Candidate aberta"], { first_name: "Paulo", last_name: "Costa", email: "paulo-sem-arroba" }, ["Preencher First Name com Paulo e Last Name com Costa.", "Informar 'paulo-sem-arroba' em Email.", "Clicar em 'Save'."], "O sistema não salva o candidato e exibe Expected format: admin@example.com ou validação equivalente."),
  },
  "RF-007": {
    P: s("Anexar currículo PDF permitido", ["Usuário autenticado", "Tela Add Candidate aberta"], { file_name: "curriculo-marina.pdf", mime: "application/pdf", size: "menor que 1 MB" }, ["Preencher nome e e-mail válidos do candidato.", "Selecionar um arquivo PDF chamado curriculo-marina.pdf com menos de 1 MB.", "Clicar em 'Save'."], "O arquivo é aceito e o candidato pode ser salvo sem erro de formato ou tamanho."),
    N: s("Bloquear currículo com extensão executável", ["Usuário autenticado", "Tela Add Candidate aberta"], { file_name: "curriculo.exe", mime: "application/octet-stream" }, ["Preencher nome e e-mail válidos.", "Selecionar o arquivo curriculo.exe no campo Resume.", "Clicar em 'Save'."], "O sistema rejeita o arquivo e exibe mensagem sobre os formatos permitidos."),
    E: s("Bloquear currículo acima de 1 MB", ["Usuário autenticado", "Tela Add Candidate aberta"], { file_name: "curriculo-grande.pdf", size: "1.2 MB" }, ["Preencher nome e e-mail válidos.", "Selecionar curriculo-grande.pdf com tamanho de 1.2 MB.", "Clicar em 'Save'."], "O sistema impede o upload ou salvamento e informa o limite máximo de 1 MB."),
  },
  "RF-008": {
    P: s("Mover candidato para Shortlisted", ["Usuário autenticado", "Existe candidato em Application Initiated"], { status_origin: "Application Initiated", notes: "Perfil aderente à vaga" }, ["Acessar Recruitment > Candidates e abrir candidato em Application Initiated.", "Clicar em 'Shortlist'.", "Preencher Notes com 'Perfil aderente à vaga'.", "Clicar em 'Save'."], "O status muda para Shortlisted e a ação é registrada no histórico."),
    N: s("Ocultar Shortlist para candidato sem vaga", ["Usuário autenticado", "Candidato cadastrado sem vaga associada"], { vacancy: null }, ["Cadastrar um candidato sem selecionar Vacancy.", "Abrir o perfil do candidato cadastrado.", "Inspecionar os botões de ação do perfil."], "O botão Shortlist não é exibido porque o candidato não participa de um processo seletivo."),
    E: s("Ocultar Shortlist em status terminal", ["Usuário autenticado", "Candidato em Rejected ou Hired"], { status: "Rejected" }, ["Abrir um candidato com status Rejected.", "Inspecionar os botões de ação do perfil."], "O botão Shortlist não é exibido para o status terminal."),
  },
  "RF-009": {
    P: s("Agendar entrevista para candidato Shortlisted", ["Usuário autenticado", "Candidato em Shortlisted", "Entrevistador ativo"], { title: "Entrevista técnica QA", interviewer: "a", date: "2030-10-20", time: "10:30" }, ["Abrir candidato Shortlisted e clicar em 'Schedule Interview'.", "Preencher Interview Title com 'Entrevista técnica QA'.", "Selecionar o primeiro entrevistador ao digitar 'a'.", "Informar data 2030-10-20 e horário 10:30 e clicar em 'Save'."], "O status muda para Interview Scheduled e a entrevista aparece no histórico."),
    N: s("Bloquear entrevista sem entrevistador", ["Usuário autenticado", "Candidato em Shortlisted"], { title: "Entrevista sem responsável", interviewer: "" }, ["Abrir Schedule Interview.", "Preencher título, data e horário.", "Manter Interviewer vazio e clicar em 'Save'."], "O sistema exibe Required no campo Interviewer e não agenda a entrevista."),
    E: s("Bloquear entrevista com data passada", ["Usuário autenticado", "Candidato em Shortlisted"], { date: "2020-01-10", time: "09:00" }, ["Abrir Schedule Interview.", "Preencher título e entrevistador.", "Informar data 2020-01-10 e horário 09:00.", "Clicar em 'Save'."], "O sistema mantém o formulário aberto e apresenta validação de data."),
  },
  "RF-010": {
    P: s("Concluir fluxo de candidato aprovado até Hire", ["Usuário autenticado", "Candidato com entrevista agendada"], { interview_result: "Interview Passed", offer: "Job Offered", final_status: "Hired" }, ["Abrir candidato em Interview Scheduled e clicar em 'Mark Interview Passed'.", "Salvar notas da entrevista.", "Clicar em 'Offer Job' e salvar a oferta.", "Clicar em 'Hire' e salvar a contratação."], "O candidato percorre Interview Passed, Job Offered e Hired, com cada ação registrada no histórico."),
    N: s("Registrar reprovação na entrevista", ["Usuário autenticado", "Candidato com entrevista agendada"], { result: "Interview Failed", notes: "Conhecimento técnico abaixo do esperado" }, ["Abrir candidato em Interview Scheduled.", "Clicar em 'Mark Interview Failed'.", "Preencher Notes com 'Conhecimento técnico abaixo do esperado'.", "Clicar em 'Save'."], "O status muda para Interview Failed e Offer Job não fica disponível."),
    E: s("Impedir Hire antes de Offer Job", ["Usuário autenticado", "Candidato em Interview Passed sem oferta"], { current_status: "Interview Passed" }, ["Abrir candidato em Interview Passed.", "Inspecionar os botões de ação antes de realizar Offer Job."], "O botão Hire não é exibido antes da etapa Job Offered."),
  },
  "RF-011": {
    P: s("Pesquisar funcionário por Employee Id", ["Usuário autenticado", "Tela PIM > Employee List disponível"], { employee_id: "0001" }, ["Acessar 'PIM > Employee List'.", "Preencher Employee Id com '0001'.", "Clicar em 'Search'."], "A listagem é atualizada de acordo com o Employee Id informado."),
    N: s("Pesquisar Employee Id inexistente", ["Usuário autenticado", "Tela Employee List disponível"], { employee_id: "999999" }, ["Acessar PIM > Employee List.", "Preencher Employee Id com 999999.", "Clicar em 'Search'."], "O sistema apresenta lista vazia ou zero registros."),
    E: s("Limpar filtros de funcionários", ["Usuário autenticado", "Employee Id e Job Title preenchidos"], { employee_id: "0001", job_title: "Account Assistant" }, ["Preencher Employee Id e selecionar Job Title.", "Clicar em 'Reset'."], "Todos os filtros retornam ao estado inicial."),
  },
  "RF-012": {
    P: s("Cadastrar funcionário com dados básicos", ["Usuário autenticado", "Employee Id 92012 disponível"], { first_name: "Marina", middle_name: "Beatriz", last_name: "Almeida", employee_id: "92012" }, ["Acessar 'PIM > Add Employee'.", "Preencher Marina Beatriz Almeida.", "Substituir Employee Id por 92012.", "Clicar em 'Save'."], "O sistema exibe Success e redireciona para Personal Details do funcionário."),
    N: s("Bloquear funcionário sem First Name", ["Usuário autenticado", "Tela Add Employee aberta"], { first_name: "", last_name: "Almeida", employee_id: "92013" }, ["Manter First Name vazio.", "Preencher Last Name com Almeida e Employee Id com 92013.", "Clicar em 'Save'."], "O sistema permanece em Add Employee e exibe Required em First Name."),
    E: s("Bloquear Employee Id duplicado", ["Usuário autenticado", "Employee Id 0001 já existe"], { first_name: "Paulo", last_name: "Mendes", employee_id: "0001" }, ["Preencher Paulo Mendes.", "Informar Employee Id 0001.", "Clicar em 'Save'."], "O sistema não cria o funcionário e informa que o Employee Id já existe."),
  },
  "RF-013": {
    P: s("Criar funcionário com login habilitado", ["Usuário autenticado", "Username marina.qa.92014 disponível"], { first_name: "Marina", last_name: "Almeida", employee_id: "92014", username: "marina.qa.92014", password: "Qa@2030Strong", status: "Enabled" }, ["Acessar PIM > Add Employee e preencher Marina Almeida.", "Ativar Create Login Details.", "Preencher Username com marina.qa.92014.", "Preencher Password e Confirm Password com Qa@2030Strong, selecionar Enabled e clicar em Save."], "O funcionário é criado e o sistema redireciona para Personal Details sem erros de login."),
    N: s("Bloquear senhas divergentes", ["Usuário autenticado", "Create Login Details ativado"], { username: "lucas.qa.92015", password: "Qa@2030Strong", confirm: "Qa@2030Different" }, ["Preencher dados do funcionário e ativar Create Login Details.", "Informar Username lucas.qa.92015.", "Informar senhas divergentes e clicar em Save."], "O formulário permanece aberto e exibe Passwords do not match ou validação equivalente."),
    E: s("Bloquear Username duplicado", ["Usuário autenticado", "Username Admin já existe"], { username: "Admin", password: "Qa@2030Strong" }, ["Preencher dados do funcionário e ativar Create Login Details.", "Informar Username Admin e senhas iguais.", "Clicar em Save."], "O sistema impede a criação da conta e informa que o Username já existe."),
  },
  "RF-014": {
    P: s("Atualizar Job e adicionar supervisor", ["Usuário autenticado", "Funcionário existente", "Supervisor ativo"], { job_title: "Account Assistant", employment_status: "Full-Time Permanent", supervisor_search: "a", method: "Direct" }, ["Pesquisar um funcionário e abrir seu perfil.", "Abrir a aba Job e selecionar Job Title Account Assistant e Employment Status Full-Time Permanent.", "Salvar e abrir a aba Report-to.", "Adicionar o primeiro supervisor retornado ao digitar 'a', selecionar Direct e salvar."], "O sistema exibe Success e mantém os dados funcionais e o supervisor no perfil."),
    N: s("Bloquear supervisor sem Reporting Method", ["Usuário autenticado", "Funcionário e supervisor ativos"], { supervisor_search: "a", method: "" }, ["Abrir Report-to no perfil do funcionário.", "Adicionar o primeiro supervisor retornado ao digitar 'a'.", "Manter Reporting Method vazio e clicar em Save."], "O sistema exibe Required em Reporting Method e não grava a relação."),
    E: s("Impedir autorreferência de supervisor", ["Usuário autenticado", "Funcionário existente"], { supervisor: "mesmo funcionário", method: "Direct" }, ["Abrir Report-to e clicar em Add Supervisor.", "Pesquisar e selecionar o próprio funcionário.", "Selecionar Direct e clicar em Save."], "O sistema rejeita a relação ou exibe validação impedindo autorreferência."),
  },
};

function q(value) { return String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'"); }

function login() {
  return [
    "    cy.visit('/web/index.php/auth/login');",
    "    cy.location('pathname').then((pathname) => {",
    "      if (pathname.includes('/auth/login')) {",
    "        cy.get('input[name=\"username\"]', { timeout: 20000 }).type('Admin');",
    "        cy.get('input[name=\"password\"]').type('admin123');",
    "        cy.get('button[type=\"submit\"]').click();",
    "      }",
    "    });",
    "    cy.location('pathname', { timeout: 20000 }).should('include', '/dashboard');",
  ];
}

function selectByLabel(lines, label, option) {
  lines.push(`    cy.contains('.oxd-label', '${q(label)}').parents('.oxd-input-group').find('.oxd-select-text').click();`);
  lines.push(`    cy.contains('.oxd-select-option', '${q(option)}').click();`);
}

function selectHiringManager(lines, search) {
  lines.push(
    "    cy.intercept('GET', '**/api/v2/pim/employees*').as('hiringManagers');",
    `    cy.get('input[placeholder="Type for hints..."]').type('${q(search)}');`,
    "    cy.wait('@hiringManagers');",
    "    cy.get('.oxd-autocomplete-option').should('not.contain', 'Searching....').first().click();"
  );
}

function vacancyScript(c) {
  const d = c.dados_teste; const lines = [...login()];
  if (c.requisito_id === "RF-001") {
    lines.push("    cy.visit('/web/index.php/recruitment/viewJobVacancy');");
    if (d.job_title) selectByLabel(lines, "Job Title", d.job_title);
    if (d.status) selectByLabel(lines, "Status", d.status);
    lines.push(`    cy.contains('button', '${c.tipo === 'excecao' ? 'Reset' : 'Search'}').click();`);
    lines.push(c.tipo === "excecao" ? "    cy.get('.oxd-select-text').first().should('contain', 'Select');" : "    cy.contains('.oxd-text', /Records Found|No Records Found/i).should('be.visible');");
  } else {
    const uniqueVacancy = c.requisito_id === "RF-002" && c.tipo === "positivo";
    if (uniqueVacancy) lines.push("    const vacancyName = `QA Automation ${Date.now()}`;");
    lines.push("    cy.visit('/web/index.php/recruitment/addJobVacancy');");
    if (d.vacancy_name) lines.push(uniqueVacancy ? "    cy.contains('.oxd-label', 'Vacancy Name').parents('.oxd-input-group').find('input').type(vacancyName);" : `    cy.contains('.oxd-label', 'Vacancy Name').parents('.oxd-input-group').find('input').type('${q(d.vacancy_name)}');`);
    if (d.job_title) selectByLabel(lines, "Job Title", d.job_title);
    if (d.hiring_manager) selectHiringManager(lines, d.hiring_manager);
    if (d.positions) lines.push(`    cy.contains('.oxd-label', 'Number of Positions').parents('.oxd-input-group').find('input').clear().type('${q(d.positions)}');`);
    if (d.description) lines.push(`    cy.get('textarea[placeholder="Type description here"]').type('${q(d.description)}');`);
    if (c.requisito_id === "RF-003") {
      if (c.tipo !== "positivo") lines.push("    cy.get('input[type=" + '"checkbox"' + "]').first().uncheck({ force: true });");
      if (c.tipo === "positivo") lines.push("    cy.get('input[type=" + '"checkbox"' + "]').eq(1).check({ force: true });");
    }
    lines.push("    cy.contains('button', 'Save').click();");
    if (c.tipo === "positivo" && c.requisito_id !== "RF-004") lines.push("    cy.location('pathname').should('match', /\\/recruitment\\/addJobVacancy\\/\\d+$/);", uniqueVacancy ? "    cy.contains('.oxd-label', 'Vacancy Name').parents('.oxd-input-group').find('input').should('have.value', vacancyName);" : `    cy.contains('.oxd-label', 'Vacancy Name').parents('.oxd-input-group').find('input').should('have.value', '${q(d.vacancy_name)}');`);
    else lines.push("    cy.get('.oxd-input-field-error-message').should('be.visible');");
  }
  return lines;
}

function candidateScript(c) {
  const d = c.dados_teste; const lines = [...login()];
  if (c.requisito_id === "RF-005") {
    lines.push("    cy.visit('/web/index.php/recruitment/viewCandidates');");
    if (d.status) selectByLabel(lines, "Status", d.status);
    if (d.keywords) lines.push(`    cy.get('input[placeholder="Enter comma seperated words..."]').type('${q(d.keywords)}');`);
    lines.push(`    cy.contains('button', '${c.tipo === 'excecao' ? 'Reset' : 'Search'}').click();`, c.tipo === "excecao" ? "    cy.get('input[placeholder=\"Enter comma seperated words...\"]').should('have.value', '');" : "    cy.contains('.oxd-text', /Records Found|No Records Found/i).should('be.visible');");
  } else if (["RF-006", "RF-007"].includes(c.requisito_id)) {
    lines.push("    cy.visit('/web/index.php/recruitment/addCandidate');");
    if (d.first_name) lines.push(`    cy.get('input[name="firstName"]').type('${q(d.first_name)}');`);
    if (d.middle_name) lines.push(`    cy.get('input[name="middleName"]').type('${q(d.middle_name)}');`);
    if (d.last_name) lines.push(`    cy.get('input[name="lastName"]').type('${q(d.last_name)}');`);
    if (d.email) lines.push(`    cy.get('input[placeholder="Type here"]').first().type('${q(d.email)}');`);
    if (d.phone) lines.push(`    cy.get('input[placeholder="Type here"]').eq(1).type('${q(d.phone)}');`);
    if (d.keywords) lines.push(`    cy.get('input[placeholder="Enter comma seperated words..."]').type('${q(d.keywords)}');`);
    if (c.requisito_id === "RF-007") {
      const size = c.tipo === "excecao" ? 1200000 : 100;
      const fileName = d.file_name;
      lines.push(`    cy.get('input[type="file"]').selectFile({ contents: Cypress.Buffer.alloc(${size}), fileName: '${q(fileName)}', mimeType: '${q(d.mime || 'application/pdf')}' });`);
    }
    lines.push("    cy.contains('button', 'Save').click();");
    lines.push(c.tipo === "positivo" ? "    cy.contains('.oxd-toast', 'Success').should('be.visible');" : "    cy.get('.oxd-input-field-error-message, .oxd-toast').should('be.visible');");
  } else if (c.requisito_id === "RF-008") {
    lines.push(
      "    const suffix = Date.now();",
      "    const candidateFirstName = `QA${suffix}`;",
      "    const candidateEmail = `qa.${suffix}@example.com`;"
    );
    if (c.tipo !== "negativo") {
      lines.push(
        "    const vacancyName = `QA Shortlist ${suffix}`;",
        "    cy.visit('/web/index.php/recruitment/addJobVacancy');",
        "    cy.contains('.oxd-label', 'Vacancy Name').parents('.oxd-input-group').find('input').type(vacancyName);",
        "    cy.contains('.oxd-label', 'Job Title').parents('.oxd-input-group').find('.oxd-select-text').click();",
        "    cy.get('.oxd-select-option').eq(1).click();",
        "    cy.intercept('GET', '**/api/v2/pim/employees*').as('hiringManagers');",
        "    cy.get('input[placeholder=\"Type for hints...\"]').type('a');",
        "    cy.wait('@hiringManagers');",
        "    cy.get('.oxd-autocomplete-option').should('not.contain', 'Searching....').first().click();",
        "    cy.contains('button', 'Save').click();",
        "    cy.location('pathname').should('match', /\\/recruitment\\/addJobVacancy\\/\\d+$/);",
        "    cy.contains('.oxd-label', 'Vacancy Name').parents('.oxd-input-group').find('input').should('have.value', vacancyName);"
      );
    }
    lines.push(
      "    cy.visit('/web/index.php/recruitment/addCandidate');",
      "    cy.get('input[name=\"firstName\"]').type(candidateFirstName);",
      "    cy.get('input[name=\"lastName\"]').type('Cypress');",
      "    cy.get('input[placeholder=\"Type here\"]').first().type(candidateEmail);"
    );
    if (c.tipo !== "negativo") {
      lines.push(
        "    cy.contains('.oxd-label', 'Vacancy').parents('.oxd-input-group').find('.oxd-select-text').click();",
        "    cy.contains('.oxd-select-option', vacancyName).click();"
      );
    }
    lines.push("    cy.contains('button', 'Save').click();", "    cy.contains('.oxd-toast', 'Success').should('be.visible');");
    if (c.tipo === "positivo") {
      lines.push(
        "    cy.contains('.oxd-button', 'Shortlist').click();",
        "    cy.get('textarea').type('Perfil aderente a vaga');",
        "    cy.contains('button', 'Save').click();",
        "    cy.contains('.oxd-toast', 'Success').should('be.visible');",
        "    cy.contains('.oxd-text', 'Shortlisted').should('be.visible');"
      );
    } else if (c.tipo === "negativo") {
      lines.push("    cy.contains('.oxd-button', 'Shortlist').should('not.exist');");
    } else {
      lines.push(
        "    cy.contains('.oxd-button', 'Reject').click();",
        "    cy.get('textarea').type('Candidato rejeitado para validar status terminal');",
        "    cy.contains('button', 'Save').click();",
        "    cy.contains('.oxd-toast', 'Success').should('be.visible');",
        "    cy.contains('.oxd-text', 'Rejected').should('be.visible');",
        "    cy.contains('.oxd-button', 'Shortlist').should('not.exist');"
      );
    }
  } else {
    lines.push("    cy.visit('/web/index.php/recruitment/viewCandidates');", "    cy.get('.oxd-table-body .oxd-table-row').first().find('.bi-eye-fill').click();");
    const button = c.requisito_id === "RF-008" ? "Shortlist" : c.requisito_id === "RF-009" ? "Schedule Interview" : null;
    if (button) lines.push(`    cy.contains('.oxd-button', '${button}').click();`);
    if (c.tipo === "excecao") lines.push(`    cy.contains('.oxd-button', '${button || 'Hire'}').should('not.exist');`);
    else if (c.tipo === "negativo") lines.push("    cy.contains('button', 'Save').click();", "    cy.get('.oxd-input-field-error-message').should('be.visible');");
    else lines.push("    cy.get('textarea').then(($t) => { if ($t.length) cy.wrap($t).type('Registro automático de QA'); });", "    cy.contains('button', 'Save').click();", "    cy.contains('.oxd-toast', 'Success').should('be.visible');");
  }
  return lines;
}

function pimScript(c) {
  const d = c.dados_teste; const lines = [...login()];
  if (c.requisito_id === "RF-011") {
    lines.push("    cy.visit('/web/index.php/pim/viewEmployeeList');");
    if (d.employee_id) lines.push(`    cy.contains('.oxd-label', 'Employee Id').parents('.oxd-input-group').find('input').type('${q(d.employee_id)}');`);
    lines.push(`    cy.contains('button', '${c.tipo === 'excecao' ? 'Reset' : 'Search'}').click();`, c.tipo === "excecao" ? "    cy.contains('.oxd-label', 'Employee Id').parents('.oxd-input-group').find('input').should('have.value', '');" : "    cy.contains('.oxd-text', /Records Found|No Records Found/i).should('be.visible');");
  } else if (["RF-012", "RF-013"].includes(c.requisito_id)) {
    const uniqueEmployeeId = c.requisito_id === "RF-012" && c.tipo === "positivo";
    if (uniqueEmployeeId) lines.push("    const employeeId = String(Date.now()).slice(-6);");
    lines.push("    cy.visit('/web/index.php/pim/addEmployee');");
    if (d.first_name) lines.push(`    cy.get('input[name="firstName"]').type('${q(d.first_name)}');`);
    if (d.middle_name) lines.push(`    cy.get('input[name="middleName"]').type('${q(d.middle_name)}');`);
    if (d.last_name) lines.push(`    cy.get('input[name="lastName"]').type('${q(d.last_name)}');`);
    if (d.employee_id) lines.push(uniqueEmployeeId ? "    cy.contains('.oxd-label', 'Employee Id').parents('.oxd-input-group').find('input').clear().type(employeeId);" : `    cy.contains('.oxd-label', 'Employee Id').parents('.oxd-input-group').find('input').clear().type('${q(d.employee_id)}');`);
    if (c.requisito_id === "RF-013") {
      lines.push("    cy.get('input[type=" + '"checkbox"' + "]').check({ force: true });");
      if (d.username) lines.push(`    cy.contains('.oxd-label', 'Username').parents('.oxd-input-group').find('input').type('${q(d.username)}');`);
      if (d.password) lines.push(`    cy.get('input[type="password"]').eq(0).type('${q(d.password)}');`, `    cy.get('input[type="password"]').eq(1).type('${q(d.confirm || d.password)}');`);
    }
    lines.push("    cy.contains('button', 'Save').click();", c.tipo === "positivo" ? "    cy.url().should('include', '/pim/viewPersonalDetails/empNumber/');" : "    cy.get('.oxd-input-field-error-message').should('be.visible');");
  } else {
    lines.push("    cy.visit('/web/index.php/pim/viewEmployeeList');", "    cy.get('.oxd-table-body .oxd-table-row').first().find('.bi-pencil-fill').click();", "    cy.contains('.orangehrm-tabs-item', 'Job').click();");
    if (c.tipo === "positivo") lines.push("    cy.contains('button', 'Save').click();", "    cy.contains('.oxd-toast', 'Success').should('be.visible');");
    else lines.push("    cy.contains('.orangehrm-tabs-item', 'Report-to').click();", "    cy.contains('button', 'Add').first().click();", "    cy.contains('button', 'Save').click();", "    cy.get('.oxd-input-field-error-message, .oxd-toast').should('be.visible');");
  }
  return lines;
}

function generate(requirements) {
  const cases = requirements.flatMap((r, index) => {
    const design = DESIGNS[r.requisito_id];
    if (!design) throw new Error(`Requisito ${r.requisito_id} sem adaptador detalhado.`);
    const base = String(index + 1).padStart(3, "0");
    return [["P", "positivo"], ["N", "negativo"], ["E", "excecao"]].map(([suffix, tipo]) => {
      const x = design[suffix];
      return { id: `CT-${base}-${suffix}`, requisito_id: r.requisito_id, tipo, titulo: x.titulo, pre_condicoes: x.pre, dados_teste: x.dados, passos: x.passos.map((p, i) => `${i + 1}. ${p}`), resultado_esperado: x.resultado };
    });
  });
  for (const c of cases) {
    if (c.passos.some((p) => BANNED.test(p))) throw new Error(`Passo abstrato em ${c.id}`);
  }
  const scripts = cases.map((c) => {
    const lines = c.requisito_id <= "RF-004" ? vacancyScript(c) : c.requisito_id <= "RF-010" ? candidateScript(c) : pimScript(c);
    const code = [`describe('${c.requisito_id} - OrangeHRM', () => {`, `  it('${c.id} - ${q(c.titulo)}', () => {`, ...lines, "  });", "});", ""].join("\n");
    if (/cy\.get\(['"]body['"]\)|cy\.visit\(['"]\/['"]\)/.test(code) || !code.includes(".should(")) throw new Error(`Script inválido: ${c.id}`);
    return { caso_id: c.id, arquivo: path.join("cypress", "e2e", "generated", `${c.requisito_id.toLowerCase()}-${c.id.toLowerCase()}.generated.cy.js`), teste: `${c.id} - ${c.titulo}`, framework: "Cypress", status_geracao: "planejado", codigo: code };
  });
  return { cases, scripts };
}

module.exports = { generate };
