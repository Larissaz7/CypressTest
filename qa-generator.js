const path = require("path");

const BANNED_STEP_PATTERNS = [
  /preencher dados v[aá]lidos/i,
  /informar dados inv[aá]lidos/i,
  /clicar na a[cç][aã]o principal/i,
  /acessar a funcionalidade descrita/i,
  /simular condi[cç][aã]o inesperada/i,
];

const USERS = {
  recruiter: { username: "Admin", password: "admin123", role: "Recrutador" },
  hr: { username: "Admin", password: "admin123", role: "RH/Administrador" },
};

const catalog = {
  "RF-001": {
    positive: {
      title: "Criar vaga com informações básicas e avançar para Workflow",
      pre: ["Usuário autenticado como Recrutador", "O cargo QA Engineer, a localização São Paulo HQ e a gerente Amelia Brown estão ativos"],
      data: { cargo: "QA Engineer", nome_vaga: "QA Engineer Pleno 2026", numero_vagas: "2", hiring_manager: "Amelia Brown", localizacao: "São Paulo HQ", descricao: "Automação de testes web com Cypress e integração contínua" },
      steps: [
        "Acessar o menu 'Recruitment', abrir 'Vacancies' e clicar em 'Add'.",
        "No seletor 'Job Title', escolher 'QA Engineer'.",
        "Preencher 'Vacancy Name' com 'QA Engineer Pleno 2026' e 'Number of Positions' com '2'.",
        "No campo 'Hiring Manager', digitar 'Amelia Brown' e selecionar a sugestão correspondente.",
        "Selecionar 'São Paulo HQ' em 'Location' e preencher 'Description' com 'Automação de testes web com Cypress e integração contínua'.",
        "Clicar no botão 'Next'.",
      ],
      expected: "O sistema salva o rascunho, destaca o passo 'Workflow' como ativo e exibe a etapa 2 do assistente sem mensagens de validação.",
    },
    negative: {
      title: "Bloquear avanço com campos obrigatórios da vaga vazios",
      pre: ["Usuário autenticado como Recrutador", "Usuário está no passo Vaga Info"],
      data: { numero_vagas: "2", localizacao: "São Paulo HQ", descricao: "Vaga sem dados obrigatórios para validação" },
      steps: [
        "Acessar 'Recruitment > Vacancies' e clicar em 'Add'.",
        "Manter 'Job Title', 'Vacancy Name' e 'Hiring Manager' sem preenchimento.",
        "Preencher 'Number of Positions' com '2', selecionar 'São Paulo HQ' e informar a descrição 'Vaga sem dados obrigatórios para validação'.",
        "Clicar no botão 'Next'.",
      ],
      expected: "O assistente permanece em 'Vaga Info', os três campos obrigatórios são marcados como inválidos e mensagens 'Required' ficam visíveis.",
    },
    exception: {
      title: "Bloquear criação com número de posições igual a zero",
      pre: ["Usuário autenticado como Recrutador", "O cargo QA Engineer e Amelia Brown estão ativos"],
      data: { cargo: "QA Engineer", nome_vaga: "QA Engineer Sem Posição", numero_vagas: "0", hiring_manager: "Amelia Brown", localizacao: "São Paulo HQ" },
      steps: [
        "Acessar 'Recruitment > Vacancies' e clicar em 'Add'.",
        "Selecionar 'QA Engineer' e preencher 'Vacancy Name' com 'QA Engineer Sem Posição'.",
        "Preencher 'Number of Positions' com '0', selecionar Amelia Brown como Hiring Manager e São Paulo HQ como Location.",
        "Clicar em 'Next'.",
      ],
      expected: "O sistema não avança para Workflow e exibe uma validação junto ao número de posições informando que o valor deve ser maior que zero.",
    },
  },
  "RF-003": {
    positive: {
      title: "Criar vaga a partir do template QA Automation",
      pre: ["Usuário autenticado como Recrutador", "O template QA Automation Standard está ativo"],
      data: { template: "QA Automation Standard", nome_vaga: "QA Automation Template 2026" },
      steps: [
        "Acessar 'Recruitment > Vacancies' e clicar em 'Add'.",
        "Clicar na opção 'Use Template'.",
        "Abrir a lista de templates e selecionar 'QA Automation Standard'.",
        "Confirmar a aplicação do modelo no botão 'Apply Template'.",
        "Preencher o nome da vaga com 'QA Automation Template 2026' e avançar pelo assistente.",
      ],
      expected: "O sistema preenche Workflow, formulário e Smart Screening, exibe o template 'QA Automation Standard' como aplicado e mantém os dados ao navegar entre as etapas.",
    },
    negative: {
      title: "Bloquear aplicação sem selecionar um template",
      pre: ["Usuário autenticado como Recrutador", "Existem templates ativos"],
      data: {},
      steps: [
        "Acessar o assistente de criação em 'Recruitment > Vacancies > Add'.",
        "Clicar em 'Use Template'.",
        "Manter o seletor de template na opção inicial 'Select'.",
        "Clicar em 'Apply Template'.",
      ],
      expected: "O modal permanece aberto, o seletor é marcado como inválido e uma mensagem 'Required' é exibida abaixo da lista de templates.",
    },
    exception: {
      title: "Tratar falha ao carregar template indisponível",
      pre: ["Usuário autenticado como Recrutador", "O template Legacy Recruitment está listado, mas foi inativado no servidor"],
      data: { template: "Legacy Recruitment" },
      steps: [
        "Acessar 'Recruitment > Vacancies > Add' e clicar em 'Use Template'.",
        "Selecionar 'Legacy Recruitment' na lista de templates.",
        "Clicar em 'Apply Template'.",
      ],
      expected: "O sistema mantém o usuário no modal e exibe um alerta informando que não foi possível carregar o modelo, sem preencher as etapas do assistente.",
    },
  },
  "RF-004": {
    positive: {
      title: "Adicionar etapa técnica e entrevistador ao Workflow",
      pre: ["Usuário autenticado como Recrutador", "O passo Vaga Info foi salvo", "Amelia Brown está ativa"],
      data: { etapa: "Entrevista Técnica", entrevistador: "Amelia Brown", duracao_dias: "3" },
      steps: [
        "No passo 2 'Workflow' do assistente de vagas, clicar em 'Add Stage'.",
        "Preencher o nome da etapa com 'Entrevista Técnica' e a duração com '3' dias.",
        "No campo de entrevistadores, digitar 'Amelia Brown' e selecionar a colaboradora sugerida.",
        "Clicar em 'Add' para inserir a etapa no funil.",
        "Confirmar que 'Entrevista Técnica' aparece no funil e clicar em 'Next'.",
      ],
      expected: "O sistema mantém a etapa Entrevista Técnica com Amelia Brown associada e abre o passo seguinte do assistente.",
    },
    negative: {
      title: "Bloquear Workflow sem nenhuma etapa de recrutamento",
      pre: ["Usuário autenticado como Recrutador", "O passo Vaga Info foi salvo", "O Workflow está vazio"],
      data: {},
      steps: [
        "Acessar o passo 2 'Workflow' da vaga em criação.",
        "Remover todas as etapas opcionais existentes usando o ícone de lixeira de cada etapa.",
        "Clicar em 'Next' sem adicionar uma etapa válida.",
      ],
      expected: "O assistente permanece em Workflow e exibe um alerta informando que pelo menos uma etapa deve ser configurada.",
    },
    exception: {
      title: "Impedir associação de entrevistador inativo",
      pre: ["Usuário autenticado como Recrutador", "O passo Vaga Info foi salvo", "Carlos Inativo está desabilitado no PIM"],
      data: { etapa: "Entrevista Técnica", entrevistador: "Carlos Inativo" },
      steps: [
        "No passo Workflow, clicar em 'Add Stage' e preencher o nome 'Entrevista Técnica'.",
        "No campo de entrevistadores, digitar 'Carlos Inativo'.",
        "Aguardar a lista de sugestões do autocomplete.",
      ],
      expected: "O colaborador Carlos Inativo não aparece nas sugestões e não pode ser associado à etapa.",
    },
  },
  "RF-008": {
    positive: {
      title: "Salvar regra de Smart Screening para reprovação automática",
      pre: ["Usuário autenticado como Recrutador", "A vaga possui a pergunta 'Possui experiência com Cypress?' no formulário"],
      data: { pergunta: "Possui experiência com Cypress?", resposta: "Não", acao: "Reject Candidate" },
      steps: [
        "Acessar o passo 4 'Smart Screening' da vaga em edição.",
        "Clicar em 'Add Rule'.",
        "Selecionar a pergunta 'Possui experiência com Cypress?'.",
        "Selecionar a resposta esperada 'Não' e a ação automática 'Reject Candidate'.",
        "Clicar em 'Save Rule'.",
      ],
      expected: "O sistema fecha o formulário da regra, exibe a notificação 'Regra salva com sucesso' e mostra a regra na tabela de triagem.",
    },
    negative: {
      title: "Bloquear regra de triagem sem ação automática",
      pre: ["Usuário autenticado como Recrutador", "A pergunta 'Possui experiência com Cypress?' existe"],
      data: { pergunta: "Possui experiência com Cypress?", resposta: "Não", acao: "" },
      steps: [
        "Acessar o passo 'Smart Screening' e clicar em 'Add Rule'.",
        "Selecionar a pergunta 'Possui experiência com Cypress?' e a resposta 'Não'.",
        "Manter o campo 'Automatic Action' sem seleção.",
        "Clicar em 'Save Rule'.",
      ],
      expected: "O formulário permanece aberto, o seletor de ação é destacado e uma mensagem de parâmetros incompletos é exibida.",
    },
    exception: {
      title: "Tratar pergunta removida durante a configuração da regra",
      pre: ["Usuário autenticado como Recrutador", "A pergunta 'Certificação ISTQB?' foi removida do formulário após abrir a triagem"],
      data: { pergunta: "Certificação ISTQB?", resposta: "Não", acao: "Reject Candidate" },
      steps: [
        "Acessar o passo 'Smart Screening' e clicar em 'Add Rule'.",
        "Abrir a lista 'Form Question' e procurar por 'Certificação ISTQB?'.",
        "Verificar as opções disponíveis para seleção.",
      ],
      expected: "A pergunta removida não aparece na lista e nenhuma regra pode ser criada com essa referência.",
    },
  },
  "RF-010": {
    positive: {
      title: "Publicar vaga nos canais interno e externo",
      pre: ["Usuário autenticado como Recrutador", "A vaga QA Engineer Pleno 2026 está em Draft e com configuração completa"],
      data: { vaga: "QA Engineer Pleno 2026", canais: ["Career Portal", "LinkedIn"] },
      steps: [
        "Acessar 'Recruitment > Vacancies' e abrir a vaga 'QA Engineer Pleno 2026'.",
        "Abrir a aba 'Publish' ou 'Job Posting'.",
        "Marcar os canais 'Career Portal' e 'LinkedIn'.",
        "Clicar em 'Publish Vacancy' e confirmar a publicação no modal.",
      ],
      expected: "O sistema exibe notificação de sucesso, altera o status para Active e mostra uma URL pública de candidatura copiável.",
    },
    negative: {
      title: "Bloquear publicação de vaga com configuração incompleta",
      pre: ["Usuário autenticado como Recrutador", "A vaga Backend Incompleta está em Draft e não possui Workflow"],
      data: { vaga: "Backend Incompleta", etapa_ausente: "Workflow" },
      steps: [
        "Acessar 'Recruitment > Vacancies' e abrir a vaga 'Backend Incompleta'.",
        "Abrir a aba de publicação.",
        "Selecionar 'Career Portal' e clicar em 'Publish Vacancy'.",
      ],
      expected: "A vaga permanece em Draft e o sistema exibe um alerta indicando que a etapa Workflow deve ser concluída antes da publicação.",
    },
    exception: {
      title: "Publicar localmente quando a integração externa falhar",
      pre: ["Usuário autenticado como Recrutador", "A vaga QA Engineer Pleno 2026 está completa", "A integração LinkedIn retorna erro de autenticação"],
      data: { vaga: "QA Engineer Pleno 2026", canal_interno: "Career Portal", canal_externo: "LinkedIn", erro_externo: "401 Unauthorized" },
      steps: [
        "Abrir a aba de publicação da vaga QA Engineer Pleno 2026.",
        "Selecionar Career Portal e LinkedIn.",
        "Clicar em 'Publish Vacancy' e confirmar a ação.",
      ],
      expected: "A vaga fica Active no portal interno, a URL pública é exibida e um aviso informa que alguns canais externos não foram integrados.",
    },
  },
  "RF-011": {
    positive: {
      title: "Mover candidato inscrito para Shortlist com sucesso",
      pre: ["Usuário autenticado como Recrutador", "Existe a candidata Ana Martins na vaga QA Engineer com status Application Initiated"],
      data: { candidato: "Ana Martins", vaga: "QA Engineer", status_origem: "Application Initiated", status_alvo: "Shortlisted", notas: "Candidata atende aos requisitos iniciais da vaga" },
      steps: [
        "Acessar o menu 'Recruitment' e abrir a aba 'Candidates'.",
        "No campo 'Candidate Name', digitar 'Ana Martins' e selecionar a candidata sugerida.",
        "Clicar em 'Search' e, na linha de Ana Martins, clicar no ícone de visualização.",
        "No perfil da candidata, clicar no botão 'Shortlist'.",
        "Preencher 'Notes' com 'Candidata atende aos requisitos iniciais da vaga' e clicar em 'Save'.",
      ],
      expected: "O formulário é fechado, o status 'Shortlisted' fica visível no perfil e o botão 'Schedule Interview' é habilitado.",
    },
    negative: {
      title: "Impedir Shortlist para candidato rejeitado",
      pre: ["Usuário autenticado como Recrutador", "Existe o candidato Bruno Lima com status Rejected"],
      data: { candidato: "Bruno Lima", status_atual: "Rejected" },
      steps: [
        "Acessar 'Recruitment > Candidates'.",
        "Selecionar 'Rejected' no filtro 'Status' e clicar em 'Search'.",
        "Abrir os detalhes do candidato Bruno Lima pelo ícone de visualização.",
        "Inspecionar a área de ações disponível no topo do perfil.",
      ],
      expected: "O status 'Rejected' permanece visível e o botão 'Shortlist' não é exibido na área de ações.",
    },
    exception: {
      title: "Impedir retorno de candidato contratado para Shortlist",
      pre: ["Usuário autenticado como Recrutador", "Existe a candidata Carla Souza com status Hired"],
      data: { candidato: "Carla Souza", status_atual: "Hired" },
      steps: [
        "Acessar 'Recruitment > Candidates'.",
        "Selecionar 'Hired' no filtro 'Status' e clicar em 'Search'.",
        "Abrir os detalhes da candidata Carla Souza.",
        "Verificar as ações de mudança de etapa disponíveis no perfil.",
      ],
      expected: "O status 'Hired' permanece visível e nenhuma ação 'Shortlist' é apresentada ao recrutador.",
    },
  },
  "RF-012": {
    positive: {
      title: "Agendar entrevista para candidato em Shortlist",
      pre: ["Usuário autenticado como Recrutador", "Ana Martins está Shortlisted", "O colaborador Amelia Brown está ativo"],
      data: { candidato: "Ana Martins", titulo: "Entrevista técnica QA", entrevistador: "Amelia Brown", data: "2030-10-20", horario: "10:30" },
      steps: [
        "Acessar 'Recruitment > Candidates' e localizar Ana Martins.",
        "Abrir o perfil e clicar em 'Schedule Interview'.",
        "Preencher 'Interview Title' com 'Entrevista técnica QA'.",
        "No campo 'Interviewer', digitar 'Amelia Brown' e selecionar a colaboradora sugerida.",
        "Informar a data '2030-10-20', o horário '10:30' e clicar em 'Save'.",
      ],
      expected: "O sistema exibe uma notificação de sucesso e o status 'Interview Scheduled' no perfil da candidata.",
    },
    negative: {
      title: "Bloquear entrevista sem entrevistador",
      pre: ["Usuário autenticado como Recrutador", "Ana Martins está Shortlisted"],
      data: { candidato: "Ana Martins", titulo: "Entrevista sem responsável", data: "2030-10-20", horario: "11:00" },
      steps: [
        "Acessar o perfil de Ana Martins em 'Recruitment > Candidates'.",
        "Clicar em 'Schedule Interview'.",
        "Preencher 'Interview Title' com 'Entrevista sem responsável', data '2030-10-20' e horário '11:00'.",
        "Manter o campo 'Interviewer' vazio e clicar em 'Save'.",
      ],
      expected: "O formulário permanece aberto, o campo 'Interviewer' é destacado e a mensagem 'Required' fica visível.",
    },
    exception: {
      title: "Bloquear entrevista com data passada",
      pre: ["Usuário autenticado como Recrutador", "Ana Martins está Shortlisted", "Amelia Brown está ativa"],
      data: { candidato: "Ana Martins", titulo: "Entrevista retroativa", entrevistador: "Amelia Brown", data: "2020-01-10", horario: "09:00" },
      steps: [
        "Abrir o perfil de Ana Martins e clicar em 'Schedule Interview'.",
        "Preencher o título 'Entrevista retroativa' e selecionar Amelia Brown como entrevistadora.",
        "Informar a data passada '2020-01-10' e o horário '09:00'.",
        "Clicar em 'Save'.",
      ],
      expected: "O sistema mantém o formulário aberto e exibe uma validação de data inválida junto ao campo de data.",
    },
  },
  "RF-013": {
    positive: {
      title: "Registrar aprovação e feedback da entrevista",
      pre: ["Usuário autenticado como Recrutador", "Ana Martins está com Interview Scheduled"],
      data: { candidato: "Ana Martins", feedback: "Demonstrou domínio de Cypress e boas práticas de automação", resultado: "Interview Passed" },
      steps: [
        "Acessar 'Recruitment > Candidates' e abrir o perfil de Ana Martins.",
        "Clicar em 'Mark Interview Passed'.",
        "Preencher 'Notes' com 'Demonstrou domínio de Cypress e boas práticas de automação'.",
        "Clicar em 'Save'.",
      ],
      expected: "O sistema exibe notificação de sucesso, fecha o formulário e mostra o status 'Interview Passed'.",
    },
    negative: {
      title: "Bloquear conclusão da entrevista sem feedback",
      pre: ["Usuário autenticado como Recrutador", "Ana Martins está com Interview Scheduled"],
      data: { candidato: "Ana Martins", feedback: "", resultado: "Interview Passed" },
      steps: [
        "Abrir o perfil de Ana Martins em 'Recruitment > Candidates'.",
        "Clicar em 'Mark Interview Passed'.",
        "Manter o campo 'Notes' vazio e clicar em 'Save'.",
      ],
      expected: "O formulário permanece aberto e uma mensagem 'Required' é exibida junto ao campo de feedback.",
    },
    exception: {
      title: "Registrar reprovação da entrevista com justificativa",
      pre: ["Usuário autenticado como Recrutador", "Bruno Lima está com Interview Scheduled"],
      data: { candidato: "Bruno Lima", feedback: "Não demonstrou experiência mínima em automação", resultado: "Interview Failed" },
      steps: [
        "Acessar o perfil de Bruno Lima em 'Recruitment > Candidates'.",
        "Clicar em 'Mark Interview Failed'.",
        "Preencher 'Notes' com 'Não demonstrou experiência mínima em automação'.",
        "Clicar em 'Save'.",
      ],
      expected: "O sistema exibe notificação de sucesso e altera o status do candidato para 'Interview Failed' ou 'Rejected'.",
    },
  },
  "RF-014": {
    positive: {
      title: "Enviar proposta de emprego com documento anexado",
      pre: ["Usuário autenticado como Recrutador", "Ana Martins está com Interview Passed"],
      data: { candidato: "Ana Martins", salario: "7500", moeda: "BRL", documento: "proposta-ana-martins.pdf" },
      steps: [
        "Abrir o perfil de Ana Martins em 'Recruitment > Candidates'.",
        "Clicar em 'Offer Job'.",
        "Informar o salário '7500' e selecionar a moeda 'BRL'.",
        "Anexar o arquivo 'proposta-ana-martins.pdf' no campo de documento da oferta.",
        "Clicar em 'Save'.",
      ],
      expected: "O sistema exibe uma notificação de sucesso e mostra o status 'Job Offered' no perfil da candidata.",
    },
    negative: {
      title: "Bloquear proposta sem documento formal",
      pre: ["Usuário autenticado como Recrutador", "Ana Martins está com Interview Passed"],
      data: { candidato: "Ana Martins", salario: "7500", moeda: "BRL" },
      steps: [
        "Abrir o perfil de Ana Martins e clicar em 'Offer Job'.",
        "Informar o salário '7500' e selecionar a moeda 'BRL'.",
        "Manter o campo de anexo vazio e clicar em 'Save'.",
      ],
      expected: "O formulário permanece aberto e o campo de documento exibe a mensagem 'Required'.",
    },
    exception: {
      title: "Bloquear proposta para candidato sem aprovação final",
      pre: ["Usuário autenticado como Recrutador", "Bruno Lima está com Interview Scheduled"],
      data: { candidato: "Bruno Lima", status_atual: "Interview Scheduled" },
      steps: [
        "Acessar 'Recruitment > Candidates' e abrir o perfil de Bruno Lima.",
        "Confirmar que o status exibido é 'Interview Scheduled'.",
        "Inspecionar os botões de ação disponíveis no perfil.",
      ],
      expected: "O botão 'Offer Job' não é exibido enquanto o candidato não estiver com status 'Interview Passed'.",
    },
  },
  "RF-015": {
    positive: {
      title: "Contratar candidato com proposta aceita",
      pre: ["Usuário autenticado como Recrutador", "Ana Martins está com Job Offered", "A vaga QA Engineer possui posição disponível"],
      data: { candidato: "Ana Martins", vaga: "QA Engineer" },
      steps: [
        "Abrir o perfil de Ana Martins em 'Recruitment > Candidates'.",
        "Confirmar o status 'Job Offered'.",
        "Clicar no botão 'Hire'.",
        "Preencher as observações com 'Proposta aceita pela candidata' e clicar em 'Save'.",
      ],
      expected: "O sistema exibe notificação de sucesso, mostra o status 'Hired' e disponibiliza a continuidade do cadastro no PIM.",
    },
    negative: {
      title: "Impedir contratação antes da proposta",
      pre: ["Usuário autenticado como Recrutador", "Bruno Lima está com Interview Passed, sem Job Offered"],
      data: { candidato: "Bruno Lima", status_atual: "Interview Passed" },
      steps: [
        "Abrir o perfil de Bruno Lima em 'Recruitment > Candidates'.",
        "Confirmar o status 'Interview Passed'.",
        "Inspecionar os botões de ação disponíveis.",
      ],
      expected: "O botão 'Hire' não é exibido antes de o candidato receber uma proposta de emprego.",
    },
    exception: {
      title: "Bloquear contratação quando não há posições disponíveis",
      pre: ["Usuário autenticado como Recrutador", "Carla Souza está com Job Offered", "A vaga QA Engineer não possui posições disponíveis"],
      data: { candidato: "Carla Souza", vaga: "QA Engineer", vagas_disponiveis: 0 },
      steps: [
        "Abrir o perfil de Carla Souza em 'Recruitment > Candidates'.",
        "Clicar em 'Hire'.",
        "Confirmar a tentativa de contratação no formulário apresentado.",
      ],
      expected: "O sistema não altera o status e exibe um alerta informando que não há posições disponíveis na vaga.",
    },
  },
  "RF-016": {
    positive: {
      title: "Cadastrar novo funcionário com dados obrigatórios",
      pre: ["Usuário autenticado como RH/Administrador", "O Employee Id 91016 está disponível"],
      data: { first_name: "Marina", middle_name: "Beatriz", last_name: "Almeida", employee_id: "91016" },
      steps: [
        "Acessar o menu 'PIM' e clicar em 'Add Employee'.",
        "Preencher 'First Name' com 'Marina', 'Middle Name' com 'Beatriz' e 'Last Name' com 'Almeida'.",
        "Substituir o valor de 'Employee Id' por '91016'.",
        "Clicar em 'Save'.",
      ],
      expected: "O sistema exibe notificação de sucesso e redireciona para a tela 'Personal Details' do novo funcionário.",
    },
    negative: {
      title: "Bloquear cadastro sem nome e sobrenome",
      pre: ["Usuário autenticado como RH/Administrador"],
      data: { first_name: "", last_name: "", employee_id: "91017" },
      steps: [
        "Acessar 'PIM > Add Employee'.",
        "Manter 'First Name' e 'Last Name' vazios e preencher 'Employee Id' com '91017'.",
        "Clicar em 'Save'.",
      ],
      expected: "A tela permanece em 'Add Employee' e mensagens 'Required' são exibidas nos campos First Name e Last Name.",
    },
    exception: {
      title: "Bloquear cadastro com Employee Id duplicado",
      pre: ["Usuário autenticado como RH/Administrador", "Já existe um funcionário com Employee Id 0001"],
      data: { first_name: "Paulo", last_name: "Mendes", employee_id: "0001" },
      steps: [
        "Acessar 'PIM > Add Employee'.",
        "Preencher 'First Name' com 'Paulo' e 'Last Name' com 'Mendes'.",
        "Informar '0001' no campo 'Employee Id' e clicar em 'Save'.",
      ],
      expected: "O cadastro não é concluído e uma mensagem de identificador já existente é exibida junto ao Employee Id.",
    },
  },
  "RF-017": {
    positive: {
      title: "Cadastrar funcionário com credenciais de login",
      pre: ["Usuário autenticado como RH/Administrador", "O username marina.almeida.qa está disponível"],
      data: { first_name: "Marina", last_name: "Almeida", employee_id: "91018", username: "marina.almeida.qa", password: "Qa@2030Strong" },
      steps: [
        "Acessar 'PIM > Add Employee' e preencher Marina Almeida com Employee Id 91018.",
        "Ativar a opção 'Create Login Details'.",
        "Preencher 'Username' com 'marina.almeida.qa', 'Password' e 'Confirm Password' com 'Qa@2030Strong'.",
        "Selecionar o status 'Enabled' e clicar em 'Save'.",
      ],
      expected: "O sistema exibe notificação de sucesso e redireciona para os detalhes de Marina Almeida sem mensagens de validação.",
    },
    negative: {
      title: "Bloquear criação quando as senhas não coincidem",
      pre: ["Usuário autenticado como RH/Administrador"],
      data: { first_name: "Lucas", last_name: "Freitas", employee_id: "91019", username: "lucas.freitas.qa", password: "Qa@2030Strong", confirm_password: "Qa@2030Different" },
      steps: [
        "Acessar 'PIM > Add Employee', preencher Lucas Freitas e ativar 'Create Login Details'.",
        "Preencher 'Username' com 'lucas.freitas.qa'.",
        "Preencher 'Password' com 'Qa@2030Strong' e 'Confirm Password' com 'Qa@2030Different'.",
        "Clicar em 'Save'.",
      ],
      expected: "O formulário permanece aberto e uma mensagem de incompatibilidade é exibida no campo Confirm Password.",
    },
    exception: {
      title: "Bloquear criação com username já cadastrado",
      pre: ["Usuário autenticado como RH/Administrador", "O username Admin já existe"],
      data: { first_name: "Rafael", last_name: "Costa", employee_id: "91020", username: "Admin", password: "Qa@2030Strong" },
      steps: [
        "Acessar 'PIM > Add Employee', preencher Rafael Costa e ativar 'Create Login Details'.",
        "Preencher 'Username' com 'Admin' e informar uma senha válida nos dois campos de senha.",
        "Clicar em 'Save'.",
      ],
      expected: "O sistema bloqueia o cadastro e exibe uma mensagem informando que o username já existe.",
    },
  },
  "RF-018": {
    positive: {
      title: "Vincular funcionário à estrutura organizacional",
      pre: ["Usuário autenticado como RH/Administrador", "Marina Almeida está cadastrada e ativa"],
      data: { funcionario: "Marina Almeida", job_title: "QA Engineer", employment_status: "Full-Time Permanent", job_category: "Professionals", sub_unit: "Quality Assurance" },
      steps: [
        "Acessar 'PIM > Employee List' e buscar Marina Almeida.",
        "Abrir o perfil e clicar na aba 'Job'.",
        "Selecionar 'QA Engineer' em Job Title, 'Full-Time Permanent' em Employment Status, 'Professionals' em Job Category e 'Quality Assurance' em Sub Unit.",
        "Clicar em 'Save'.",
      ],
      expected: "O sistema exibe notificação de sucesso e mantém os quatro valores selecionados na aba Job.",
    },
    negative: {
      title: "Impedir gravação de cargo indisponível",
      pre: ["Usuário autenticado como RH/Administrador", "Marina Almeida está cadastrada", "O cargo Legacy QA foi inativado"],
      data: { funcionario: "Marina Almeida", job_title: "Legacy QA" },
      steps: [
        "Abrir a aba 'Job' do perfil de Marina Almeida.",
        "Abrir a lista 'Job Title' e procurar por 'Legacy QA'.",
        "Verificar as opções retornadas pelo seletor.",
      ],
      expected: "O cargo inativo 'Legacy QA' não aparece entre as opções selecionáveis de Job Title.",
    },
    exception: {
      title: "Impedir gravação de subunidade indisponível",
      pre: ["Usuário autenticado como RH/Administrador", "Marina Almeida está cadastrada", "A subunidade Old QA Lab foi inativada"],
      data: { funcionario: "Marina Almeida", sub_unit: "Old QA Lab" },
      steps: [
        "Abrir a aba 'Job' do perfil de Marina Almeida.",
        "Abrir a lista 'Sub Unit' e procurar por 'Old QA Lab'.",
        "Verificar as opções apresentadas.",
      ],
      expected: "A subunidade inativa 'Old QA Lab' não aparece entre as opções selecionáveis de Sub Unit.",
    },
  },
  "RF-019": {
    positive: {
      title: "Atribuir supervisor direto ao funcionário",
      pre: ["Usuário autenticado como RH/Administrador", "Marina Almeida e Amelia Brown estão ativas"],
      data: { funcionario: "Marina Almeida", supervisor: "Amelia Brown", metodo: "Direct" },
      steps: [
        "Acessar 'PIM > Employee List' e abrir o perfil de Marina Almeida.",
        "Abrir a seção 'Report-to' e clicar em 'Add' na tabela Assigned Supervisors.",
        "No campo 'Name', digitar 'Amelia Brown' e selecionar a sugestão correspondente.",
        "Selecionar 'Direct' em Reporting Method e clicar em 'Save'.",
      ],
      expected: "O sistema exibe notificação de sucesso e Amelia Brown aparece na tabela Assigned Supervisors com método Direct.",
    },
    negative: {
      title: "Bloquear supervisor sem método de reporte",
      pre: ["Usuário autenticado como RH/Administrador", "Marina Almeida e Amelia Brown estão ativas"],
      data: { funcionario: "Marina Almeida", supervisor: "Amelia Brown", metodo: "" },
      steps: [
        "Abrir 'Report-to' no perfil de Marina Almeida e clicar em 'Add' em Assigned Supervisors.",
        "Selecionar Amelia Brown no campo 'Name'.",
        "Manter 'Reporting Method' vazio e clicar em 'Save'.",
      ],
      expected: "O formulário permanece aberto e uma mensagem 'Required' é exibida para Reporting Method.",
    },
    exception: {
      title: "Impedir funcionário de ser supervisor de si mesmo",
      pre: ["Usuário autenticado como RH/Administrador", "Marina Almeida está ativa"],
      data: { funcionario: "Marina Almeida", supervisor: "Marina Almeida", metodo: "Direct" },
      steps: [
        "Abrir 'Report-to' no perfil de Marina Almeida e clicar em 'Add' em Assigned Supervisors.",
        "Pesquisar e selecionar 'Marina Almeida' no campo de supervisor.",
        "Selecionar 'Direct' em Reporting Method e clicar em 'Save'.",
      ],
      expected: "O sistema não grava a relação e exibe uma mensagem de validação informando que o funcionário não pode supervisionar a si mesmo.",
    },
  },
};

function loginLines() {
  return [
    "    cy.visit('/web/index.php/auth/login');",
    "    cy.get('input[name=\"username\"]').type('Admin');",
    "    cy.get('input[name=\"password\"]').type('admin123');",
    "    cy.get('button[type=\"submit\"]').click();",
    "    cy.url().should('include', '/dashboard');",
  ];
}

function quoted(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function vacancyScript(c) {
  const d = c.dados_teste;
  const lines = [...loginLines()];

  if (c.requisito_id === "RF-001") {
    lines.push("    cy.visit('/web/index.php/recruitment/viewJobVacancy');", "    cy.contains('.oxd-button', 'Add').click();");
    if (d.cargo) {
      lines.push("    cy.get('.oxd-input-group').contains('Job Title').parent().find('.oxd-select-text').click();", `    cy.contains('.oxd-select-option', '${quoted(d.cargo)}').click();`);
    }
    if (d.nome_vaga) lines.push(`    cy.get('.oxd-input-group').contains('Vacancy Name').parent().find('input').type('${quoted(d.nome_vaga)}');`);
    if (d.numero_vagas) lines.push(`    cy.get('.oxd-input-group').contains(/Number of Positions|Number of Vacancies/i).parent().find('input').clear().type('${quoted(d.numero_vagas)}');`);
    if (d.hiring_manager) lines.push(`    cy.get('.oxd-autocomplete-text-input input').type('${quoted(d.hiring_manager)}');`, `    cy.contains('.oxd-autocomplete-option', '${quoted(d.hiring_manager)}').click();`);
    if (d.localizacao) lines.push("    cy.get('.oxd-input-group').contains('Location').parent().find('.oxd-select-text').click();", `    cy.contains('.oxd-select-option', '${quoted(d.localizacao)}').click();`);
    if (d.descricao) lines.push(`    cy.get('textarea').type('${quoted(d.descricao)}');`);
    lines.push("    cy.contains('button', /Next|Avançar/i).click();");
    if (c.tipo === "positivo") lines.push("    cy.contains('.oxd-stepper-header, .orangehrm-wizard-header', 'Workflow').should('be.visible');");
    else lines.push("    cy.get('.oxd-input-field-error-message').should('be.visible');", "    cy.contains('.oxd-stepper-header, .orangehrm-wizard-header', /Vacancy Info|Vaga Info/i).should('be.visible');");
    return lines;
  }

  if (c.requisito_id === "RF-003") {
    lines.push("    cy.visit('/web/index.php/recruitment/viewJobVacancy');", "    cy.contains('.oxd-button', 'Add').click();", "    cy.contains('.oxd-button', /Use Template|Usar Modelo/i).click();");
    if (d.template) lines.push("    cy.get('.oxd-dialog-container .oxd-select-text').click();", `    cy.contains('.oxd-select-option', '${quoted(d.template)}').click();`);
    lines.push("    cy.contains('.oxd-dialog-container button', /Apply Template|Aplicar Modelo/i).click();");
    if (c.tipo === "positivo") lines.push(`    cy.contains('.oxd-text', '${quoted(d.template)}').should('be.visible');`, "    cy.contains('.oxd-stepper-header, .orangehrm-wizard-header', 'Workflow').should('be.visible');");
    else if (c.tipo === "negativo") lines.push("    cy.get('.oxd-dialog-container .oxd-input-field-error-message').should('contain', 'Required');");
    else lines.push("    cy.get('.oxd-alert, .oxd-toast').should('be.visible').and('contain.text', 'modelo');");
    return lines;
  }

  if (c.requisito_id === "RF-004") {
    lines.push("    cy.visit('/web/index.php/recruitment/addJobVacancy?step=workflow');");
    if (c.tipo === "negativo") {
      lines.push("    cy.get('.oxd-table-row .bi-trash').each(($button) => cy.wrap($button).click());", "    cy.contains('button', /Next|Avançar/i).click();", "    cy.get('.oxd-alert, .oxd-input-field-error-message').should('be.visible').and('contain.text', 'etapa');");
    } else {
      lines.push("    cy.contains('.oxd-button', /Add Stage|Adicionar Etapa/i).click();", `    cy.get('.oxd-dialog-container input').first().type('${quoted(d.etapa)}');`);
      if (d.entrevistador) lines.push(`    cy.get('.oxd-dialog-container .oxd-autocomplete-text-input input').type('${quoted(d.entrevistador)}');`);
      if (c.tipo === "positivo") lines.push(`    cy.contains('.oxd-autocomplete-option', '${quoted(d.entrevistador)}').click();`, "    cy.contains('.oxd-dialog-container button', /Add|Adicionar/i).click();", `    cy.contains('.oxd-table-row, .orangehrm-workflow-stage', '${quoted(d.etapa)}').should('contain', '${quoted(d.entrevistador)}');`);
      else lines.push(`    cy.contains('.oxd-autocomplete-option', '${quoted(d.entrevistador)}').should('not.exist');`);
    }
    return lines;
  }

  if (c.requisito_id === "RF-008") {
    lines.push("    cy.visit('/web/index.php/recruitment/addJobVacancy?step=smart-screening');", "    cy.contains('.oxd-button', /Add Rule|Adicionar Regra/i).click();");
    if (c.tipo === "excecao") {
      lines.push("    cy.get('.oxd-dialog-container .oxd-select-text').first().click();", `    cy.contains('.oxd-select-option', '${quoted(d.pergunta)}').should('not.exist');`);
    } else {
      lines.push("    cy.get('.oxd-dialog-container .oxd-select-text').eq(0).click();", `    cy.contains('.oxd-select-option', '${quoted(d.pergunta)}').click();`, "    cy.get('.oxd-dialog-container .oxd-select-text').eq(1).click();", `    cy.contains('.oxd-select-option', '${quoted(d.resposta)}').click();`);
      if (d.acao) lines.push("    cy.get('.oxd-dialog-container .oxd-select-text').eq(2).click();", `    cy.contains('.oxd-select-option', '${quoted(d.acao)}').click();`);
      lines.push("    cy.contains('.oxd-dialog-container button', /Save Rule|Salvar Regra/i).click();");
      if (c.tipo === "positivo") lines.push("    cy.contains('.oxd-toast', /Success|sucesso/i).should('be.visible');", `    cy.contains('.oxd-table-row', '${quoted(d.pergunta)}').should('contain', '${quoted(d.acao)}');`);
      else lines.push("    cy.get('.oxd-dialog-container .oxd-input-field-error-message').should('be.visible');");
    }
    return lines;
  }

  lines.push("    cy.visit('/web/index.php/recruitment/viewJobVacancy');", `    cy.contains('.oxd-table-row', '${quoted(d.vaga)}').find('.bi-pencil-fill, .bi-eye-fill').first().click();`, "    cy.contains('.orangehrm-tabs-item, .oxd-tab', /Publish|Job Posting|Divulgação/i).click();");
  if (c.tipo === "negativo") {
    lines.push("    cy.contains('.oxd-checkbox-wrapper', 'Career Portal').click();", "    cy.contains('.oxd-button', /Publish Vacancy|Publicar Vaga/i).click();", "    cy.get('.oxd-alert, .oxd-toast').should('be.visible').and('contain.text', 'Workflow');", "    cy.contains('.oxd-text', /Draft|Rascunho/i).should('be.visible');");
  } else {
    lines.push("    cy.contains('.oxd-checkbox-wrapper', 'Career Portal').click();", "    cy.contains('.oxd-checkbox-wrapper', 'LinkedIn').click();", "    cy.contains('.oxd-button', /Publish Vacancy|Publicar Vaga/i).click();", "    cy.contains('.oxd-dialog-container button', /Confirm|Confirmar/i).click();");
    if (c.tipo === "positivo") lines.push("    cy.contains('.oxd-toast', /Success|sucesso/i).should('be.visible');", "    cy.contains('.oxd-text', /Active|Ativa/i).should('be.visible');", "    cy.get('input').filter('[value*=\"http\"]').should('be.visible');");
    else lines.push("    cy.contains('.oxd-text', /Active|Ativa/i).should('be.visible');", "    cy.get('.oxd-alert, .oxd-toast').should('be.visible').and('contain.text', 'extern');");
  }
  return lines;
}

function recruitmentScript(c) {
  const d = c.dados_teste;
  const lines = [...loginLines(), "    cy.visit('/web/index.php/recruitment/viewCandidates');"];
  if (d.candidato) {
    lines.push(`    cy.get('.oxd-autocomplete-text-input input').first().type('${quoted(d.candidato)}');`);
    lines.push(`    cy.contains('.oxd-autocomplete-option', '${quoted(d.candidato)}').click();`);
    lines.push("    cy.contains('button', 'Search').click();");
    lines.push(`    cy.contains('.oxd-table-row', '${quoted(d.candidato)}').find('.bi-eye-fill').click();`);
  }
  const id = c.requisito_id;
  if (id === "RF-011" && c.tipo === "positivo") {
    lines.push("    cy.contains('.oxd-button', 'Shortlist').click();", `    cy.get('textarea').type('${quoted(d.notas)}');`, "    cy.contains('button', 'Save').click();", "    cy.contains('.oxd-text', 'Shortlisted').should('be.visible');", "    cy.contains('.oxd-button', 'Schedule Interview').should('be.enabled');");
  } else if (id === "RF-011") {
    lines.push(`    cy.contains('.oxd-text', '${quoted(d.status_atual)}').should('be.visible');`, "    cy.contains('.oxd-button', 'Shortlist').should('not.exist');");
  } else if (id === "RF-012") {
    lines.push("    cy.contains('.oxd-button', 'Schedule Interview').click();", `    cy.get('.oxd-input-group').contains('Interview Title').parent().find('input').type('${quoted(d.titulo)}');`);
    if (d.entrevistador) lines.push(`    cy.get('.oxd-autocomplete-text-input input').type('${quoted(d.entrevistador)}');`, `    cy.contains('.oxd-autocomplete-option', '${quoted(d.entrevistador)}').click();`);
    lines.push(`    cy.get('input[placeholder="yyyy-dd-mm"]').type('${quoted(d.data)}');`, `    cy.get('input[placeholder="hh:mm"]').type('${quoted(d.horario)}');`, "    cy.contains('button', 'Save').click();");
    lines.push(c.tipo === "positivo" ? "    cy.contains('.oxd-text', 'Interview Scheduled').should('be.visible');" : "    cy.get('.oxd-input-field-error-message').should('be.visible');");
  } else if (id === "RF-013") {
    const action = c.tipo === "excecao" ? "Mark Interview Failed" : "Mark Interview Passed";
    lines.push(`    cy.contains('.oxd-button', '${action}').click();`);
    if (d.feedback) lines.push(`    cy.get('textarea').type('${quoted(d.feedback)}');`);
    lines.push("    cy.contains('button', 'Save').click();");
    lines.push(c.tipo === "negativo" ? "    cy.get('.oxd-input-field-error-message').should('contain', 'Required');" : `    cy.contains('.oxd-text', '${quoted(d.resultado)}').should('be.visible');`);
  } else if (id === "RF-014") {
    if (c.tipo === "excecao") lines.push("    cy.contains('.oxd-button', 'Offer Job').should('not.exist');");
    else {
      lines.push("    cy.contains('.oxd-button', 'Offer Job').click();");
      if (d.salario) lines.push(`    cy.get('.oxd-input-group').contains(/Salary/i).parent().find('input').type('${quoted(d.salario)}');`);
      if (d.documento) lines.push("    cy.get('input[type=" + '"file"' + "]').selectFile({ contents: Cypress.Buffer.from('oferta formal'), fileName: 'proposta-ana-martins.pdf', mimeType: 'application/pdf' });");
      lines.push("    cy.contains('button', 'Save').click();", c.tipo === "positivo" ? "    cy.contains('.oxd-text', 'Job Offered').should('be.visible');" : "    cy.get('.oxd-input-field-error-message').should('be.visible');");
    }
  } else if (id === "RF-015") {
    if (c.tipo === "negativo") lines.push("    cy.contains('.oxd-button', 'Hire').should('not.exist');");
    else {
      lines.push("    cy.contains('.oxd-button', 'Hire').click();");
      if (c.tipo === "positivo") lines.push("    cy.get('textarea').type('Proposta aceita pela candidata');");
      lines.push("    cy.contains('button', 'Save').click();", c.tipo === "positivo" ? "    cy.contains('.oxd-text', 'Hired').should('be.visible');" : "    cy.get('.oxd-alert, .oxd-toast').should('be.visible');");
    }
  }
  return lines;
}

function pimScript(c) {
  const d = c.dados_teste;
  const lines = [...loginLines()];
  if (["RF-016", "RF-017"].includes(c.requisito_id)) {
    lines.push("    cy.visit('/web/index.php/pim/addEmployee');");
    if (d.first_name) lines.push(`    cy.get('input[name="firstName"]').type('${quoted(d.first_name)}');`);
    if (d.last_name) lines.push(`    cy.get('input[name="lastName"]').type('${quoted(d.last_name)}');`);
    if (d.employee_id) lines.push(`    cy.get('.oxd-input-group').contains('Employee Id').parent().find('input').clear().type('${quoted(d.employee_id)}');`);
    if (c.requisito_id === "RF-017") {
      lines.push("    cy.contains('.oxd-switch-input', '').click();", `    cy.get('.oxd-input-group').contains('Username').parent().find('input').type('${quoted(d.username)}');`, `    cy.get('input[type="password"]').eq(0).type('${quoted(d.password)}');`, `    cy.get('input[type="password"]').eq(1).type('${quoted(d.confirm_password || d.password)}');`);
    }
    lines.push("    cy.contains('button', 'Save').click();");
    if (c.tipo === "positivo") lines.push("    cy.url().should('include', '/pim/viewPersonalDetails/empNumber/');", "    cy.contains('.oxd-toast', 'Success').should('be.visible');");
    else lines.push("    cy.get('.oxd-input-field-error-message').should('be.visible');");
    return lines;
  }

  lines.push("    cy.visit('/web/index.php/pim/viewEmployeeList');", `    cy.get('.oxd-autocomplete-text-input input').type('${quoted(d.funcionario)}');`, `    cy.contains('.oxd-autocomplete-option', '${quoted(d.funcionario)}').click();`, "    cy.contains('button', 'Search').click();", `    cy.contains('.oxd-table-row', '${quoted(d.funcionario)}').find('.bi-pencil-fill').click();`);
  if (c.requisito_id === "RF-018") {
    lines.push("    cy.contains('.orangehrm-tabs-item', 'Job').click();");
    if (c.tipo === "positivo") {
      for (const [label, value] of [["Job Title", d.job_title], ["Employment Status", d.employment_status], ["Job Category", d.job_category], ["Sub Unit", d.sub_unit]]) {
        lines.push(`    cy.get('.oxd-input-group').contains('${label}').parent().find('.oxd-select-text').click();`, `    cy.contains('.oxd-select-option', '${quoted(value)}').click();`);
      }
      lines.push("    cy.contains('button', 'Save').click();", "    cy.contains('.oxd-toast', 'Success').should('be.visible');");
    } else {
      const label = c.tipo === "negativo" ? "Job Title" : "Sub Unit";
      const value = c.tipo === "negativo" ? d.job_title : d.sub_unit;
      lines.push(`    cy.get('.oxd-input-group').contains('${label}').parent().find('.oxd-select-text').click();`, `    cy.contains('.oxd-select-option', '${quoted(value)}').should('not.exist');`);
    }
  } else {
    lines.push("    cy.contains('.orangehrm-tabs-item', 'Report-to').click();", "    cy.contains('.orangehrm-action-header', 'Assigned Supervisors').parent().contains('button', 'Add').click();", `    cy.get('.oxd-autocomplete-text-input input').type('${quoted(d.supervisor)}');`, `    cy.contains('.oxd-autocomplete-option', '${quoted(d.supervisor)}').click();`);
    if (d.metodo) lines.push("    cy.get('.oxd-select-text').click();", `    cy.contains('.oxd-select-option', '${quoted(d.metodo)}').click();`);
    lines.push("    cy.contains('button', 'Save').click();");
    if (c.tipo === "positivo") lines.push(`    cy.contains('.oxd-table-row', '${quoted(d.supervisor)}').should('contain', '${quoted(d.metodo)}');`);
    else lines.push("    cy.get('.oxd-input-field-error-message, .oxd-toast').should('be.visible');");
  }
  return lines;
}

function buildCases(requirements) {
  return requirements.flatMap((requirement, index) => {
    const definition = catalog[requirement.requisito_id];
    if (!definition) throw new Error(`Requisito ${requirement.requisito_id} sem adaptador detalhado de QA.`);
    const base = String(index + 1).padStart(3, "0");
    return [["positive", "P", "positivo"], ["negative", "N", "negativo"], ["exception", "E", "excecao"]].map(([key, suffix, type]) => {
      const scenario = definition[key];
      return {
        id: `CT-${base}-${suffix}`,
        requisito_id: requirement.requisito_id,
        tipo: type,
        titulo: scenario.title,
        pre_condicoes: scenario.pre,
        dados_teste: scenario.data,
        passos: scenario.steps.map((step, i) => `${i + 1}. ${step}`),
        resultado_esperado: scenario.expected,
      };
    });
  });
}

function buildScript(testCase) {
  const vacancyIds = new Set(["RF-001", "RF-003", "RF-004", "RF-008", "RF-010"]);
  const lines = vacancyIds.has(testCase.requisito_id)
    ? vacancyScript(testCase)
    : testCase.requisito_id <= "RF-015"
      ? recruitmentScript(testCase)
      : pimScript(testCase);
  const code = [`describe('${testCase.requisito_id} - OrangeHRM', () => {`, `  it('${quoted(testCase.id)} - ${quoted(testCase.titulo)}', () => {`, ...lines, "  });", "});", ""].join("\n");
  validateScript(code, testCase.id);
  return code;
}

function validateCases(cases, requirementCount) {
  if (cases.length !== requirementCount * 3) throw new Error("Cada requisito deve gerar exatamente tres casos de teste.");
  for (const c of cases) {
    if (!/-[PNE]$/.test(c.id)) throw new Error(`ID invalido: ${c.id}`);
    if (!c.dados_teste || !c.passos?.length || !c.resultado_esperado) throw new Error(`Caso incompleto: ${c.id}`);
    for (const step of c.passos) {
      if (BANNED_STEP_PATTERNS.some((pattern) => pattern.test(step))) throw new Error(`Passo abstrato proibido em ${c.id}: ${step}`);
    }
  }
}

function validateScript(code, caseId) {
  if (/cy\.get\(['"]body['"]\)/.test(code) || /cy\.visit\(['"]\/['"]\)/.test(code)) throw new Error(`Script generico proibido em ${caseId}.`);
  if (!code.includes(".should(")) throw new Error(`Script sem assercao forte: ${caseId}.`);
  if (!/cy\.(get|contains|visit)\(/.test(code)) throw new Error(`Script sem comandos Cypress reais: ${caseId}.`);
}

function generate(requirements) {
  const cases = buildCases(requirements);
  validateCases(cases, requirements.length);
  const scripts = cases.map((testCase) => ({
    caso_id: testCase.id,
    arquivo: path.join("cypress", "e2e", "generated", `${testCase.requisito_id.toLowerCase()}-${testCase.id.toLowerCase()}.generated.cy.js`),
    teste: `${testCase.id} - ${testCase.titulo}`,
    framework: "Cypress",
    status_geracao: "planejado",
    codigo: buildScript(testCase),
  }));
  return { cases, scripts };
}

module.exports = { buildCases, buildScript, generate, validateCases, validateScript };
