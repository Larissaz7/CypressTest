# Casos de Teste Detalhados – OrangeHRM (Módulo Recruitment)

## RF-002 – Cadastro de vaga

### CT-001-P – Positivo

| Campo | Valor |
|---|---|
| **ID** | CT-001-P |
| **RF** | RF-002 |
| **Tipo** | Positivo |
| **Título** | Cadastrar vaga ativa com sucesso |
| **Pré-condições** | Usuário autenticado; existe Job Title e Hiring Manager ativos |
| **Dados de Teste** | Vacancy Name: QA Automation 2026;<br> Job Title: Account Assistant;<br> Hiring Manager: a;<br> Positions: 2;<br> Description: Automação de testes Cypress |
| **Passos** | 1. Acessar 'Recruitment > Vacancies' e clicar em 'Add'.<br>2. Preencher Vacancy Name com 'QA Automation 2026'.<br>3. Selecionar Job Title 'Account Assistant'.<br>4. Selecionar o primeiro Hiring Manager retornado ao digitar 'a'.<br>5. Preencher Number of Positions com '2', Description com 'Automação de testes Cypress' e clicar em 'Save'. |
| **Resultado Esperado** | O sistema exibe toast Success e abre os detalhes da vaga salva. |

### CT-001-N – Negativo

| Campo | Valor |
|---|---|
| **ID** | CT-001-N |
| **RF** | RF-002 |
| **Tipo** | Negativo |
| **Título** | Bloquear vaga sem nome |
| **Pré-condições** | Usuário autenticado; tela Add Vacancy aberta |
| **Dados de Teste** | Vacancy Name: vazio;<br> Job Title: Account Assistant;<br> Hiring Manager: a |
| **Passos** | 1. Acessar 'Recruitment > Vacancies > Add'.<br>2. Selecionar Job Title 'Account Assistant'.<br>3. Selecionar o primeiro Hiring Manager retornado ao digitar 'a'.<br>4. Manter Vacancy Name vazio e clicar em 'Save'. |
| **Resultado Esperado** | O formulário permanece aberto e exibe Required abaixo de Vacancy Name. |

### CT-001-E – Exceção

| Campo | Valor |
|---|---|
| **ID** | CT-001-E |
| **RF** | RF-002 |
| **Tipo** | Exceção |
| **Título** | Bloquear vaga com quantidade não numérica |
| **Pré-condições** | Usuário autenticado; tela Add Vacancy aberta |
| **Dados de Teste** | Vacancy Name: QA Quantity Invalid;<br> Positions: abc |
| **Passos** | 1. Acessar 'Recruitment > Vacancies > Add'.<br>2. Preencher Vacancy Name com 'QA Quantity Invalid'.<br>3. Digitar 'abc' em Number of Positions.<br>4. Clicar em 'Save'. |
| **Resultado Esperado** | O campo Number of Positions rejeita o valor ou exibe mensagem de formato numérico inválido. |

---

## RF-006 – Cadastro de candidato

### CT-002-P – Positivo

| Campo | Valor |
|---|---|
| **ID** | CT-002-P |
| **RF** | RF-006 |
| **Tipo** | Positivo |
| **Título** | Cadastrar candidato manualmente |
| **Pré-condições** | Usuário autenticado; tela Add Candidate disponível |
| **Dados de Teste** | First Name: Marina;<br> Middle Name: Beatriz;<br> Last Name: Almeida;<br> Email: marina.qa@example.com;<br> Phone: 85999990001;<br> Keywords: cypress,qa |
| **Passos** | 1. Acessar 'Recruitment > Candidates' e clicar em 'Add'.<br>2. Preencher First Name, Middle Name e Last Name com Marina Beatriz Almeida.<br>3. Preencher Email com marina.qa@example.com e Contact Number com 85999990001.<br>4. Preencher Keywords com 'cypress,qa', marcar Consent to keep data e clicar em 'Save'. |
| **Resultado Esperado** | O sistema exibe toast Success e abre o perfil do candidato cadastrado. |

### CT-002-N – Negativo

| Campo | Valor |
|---|---|
| **ID** | CT-002-N |
| **RF** | RF-006 |
| **Tipo** | Negativo |
| **Título** | Bloquear candidato sem e-mail |
| **Pré-condições** | Usuário autenticado; tela Add Candidate aberta |
| **Dados de Teste** | First Name: Marina;<br> Last Name: Almeida;<br> Email: vazio |
| **Passos** | 1. Preencher First Name com Marina e Last Name com Almeida.<br>2. Manter Email vazio.<br>3. Clicar em 'Save'. |
| **Resultado Esperado** | O formulário permanece aberto e exibe Required junto ao Email. |

### CT-002-E – Exceção

| Campo | Valor |
|---|---|
| **ID** | CT-002-E |
| **RF** | RF-006 |
| **Tipo** | Exceção |
| **Título** | Bloquear candidato com e-mail malformado |
| **Pré-condições** | Usuário autenticado; tela Add Candidate aberta |
| **Dados de Teste** | First Name: Paulo;<br> Last Name: Costa;<br> Email: paulo-sem-arroba |
| **Passos** | 1. Preencher First Name com Paulo e Last Name com Costa.<br>2. Informar 'paulo-sem-arroba' em Email.<br>3. Clicar em 'Save'. |
| **Resultado Esperado** | O sistema não salva o candidato e exibe Expected format: admin@example.com ou validação equivalente. |

---

## RF-008 – Shortlist / status do candidato

### CT-003-P – Positivo

| Campo | Valor |
|---|---|
| **ID** | CT-003-P |
| **RF** | RF-008 |
| **Tipo** | Positivo |
| **Título** | Mover candidato para Shortlisted |
| **Pré-condições** | Usuário autenticado; existe candidato em Application Initiated |
| **Dados de Teste** | Status origin: Application Initiated;<br> Notes: Perfil aderente à vaga |
| **Passos** | 1. Acessar Recruitment > Candidates e abrir candidato em Application Initiated.<br>2. Clicar em 'Shortlist'.<br>3. Preencher Notes com 'Perfil aderente à vaga'.<br>4. Clicar em 'Save'. |
| **Resultado Esperado** | O status muda para Shortlisted e a ação é registrada no histórico. |

### CT-003-N – Negativo

| Campo | Valor |
|---|---|
| **ID** | CT-003-N |
| **RF** | RF-008 |
| **Tipo** | Negativo |
| **Título** | Ocultar Shortlist para candidato sem vaga |
| **Pré-condições** | Usuário autenticado; candidato cadastrado sem vaga associada |
| **Dados de Teste** | Vacancy: null |
| **Passos** | 1. Cadastrar um candidato sem selecionar Vacancy.<br>2. Abrir o perfil do candidato cadastrado.<br>3. Inspecionar os botões de ação do perfil. |
| **Resultado Esperado** | O botão Shortlist não é exibido porque o candidato não participa de um processo seletivo. |

### CT-003-E – Exceção

| Campo | Valor |
|---|---|
| **ID** | CT-003-E |
| **RF** | RF-008 |
| **Tipo** | Exceção |
| **Título** | Ocultar Shortlist em status terminal |
| **Pré-condições** | Usuário autenticado; candidato em Rejected ou Hired |
| **Dados de Teste** | Status: Rejected |
| **Passos** | 1. Abrir um candidato com status Rejected.<br>2. Inspecionar os botões de ação do perfil. |
| **Resultado Esperado** | O botão Shortlist não é exibido para o status terminal. |

---

## RF-012 – Cadastro de funcionário

### CT-004-P – Positivo

| Campo | Valor |
|---|---|
| **ID** | CT-004-P |
| **RF** | RF-012 |
| **Tipo** | Positivo |
| **Título** | Cadastrar funcionário com dados básicos |
| **Pré-condições** | Usuário autenticado; Employee Id 92012 disponível |
| **Dados de Teste** | First Name: Marina;<br> Middle Name: Beatriz;<br> Last Name: Almeida;<br> Employee Id: 92012 |
| **Passos** | 1. Acessar 'PIM > Add Employee'.<br>2. Preencher Marina Beatriz Almeida.<br>3. Substituir Employee Id por 92012.<br>4. Clicar em 'Save'. |
| **Resultado Esperado** | O sistema exibe Success e redireciona para Personal Details do funcionário. |

### CT-004-N – Negativo

| Campo | Valor |
|---|---|
| **ID** | CT-004-N |
| **RF** | RF-012 |
| **Tipo** | Negativo |
| **Título** | Bloquear funcionário sem First Name |
| **Pré-condições** | Usuário autenticado; tela Add Employee aberta |
| **Dados de Teste** | First Name: vazio;<br> Last Name: Almeida;<br> Employee Id: 92013 |
| **Passos** | 1. Manter First Name vazio.<br>2. Preencher Last Name com Almeida e Employee Id com 92013.<br>3. Clicar em 'Save'. |
| **Resultado Esperado** | O sistema permanece em Add Employee e exibe Required em First Name. |

### CT-004-E – Exceção

| Campo | Valor |
|---|---|
| **ID** | CT-004-E |
| **RF** | RF-012 |
| **Tipo** | Exceção |
| **Título** | Bloquear Employee Id duplicado |
| **Pré-condições** | Usuário autenticado; Employee Id 0001 já existe |
| **Dados de Teste** | First Name: Paulo;<br> Last Name: Mendes;<br> Employee Id: 0001 |
| **Passos** | 1. Preencher Paulo Mendes.<br>2. Informar Employee Id 0001.<br>3. Clicar em 'Save'. |
| **Resultado Esperado** | O sistema não cria o funcionário e informa que o Employee Id já existe. |

---

## RF-014 – Atualização de cargo e supervisão

### CT-005-P – Positivo

| Campo | Valor |
|---|---|
| **ID** | CT-005-P |
| **RF** | RF-014 |
| **Tipo** | Positivo |
| **Título** | Atualizar Job e adicionar supervisor |
| **Pré-condições** | Usuário autenticado; funcionário existente; supervisor ativo |
| **Dados de Teste** | Job Title: Account Assistant;<br> Employment Status: Full-Time Permanent;<br> Supervisor search: a; Method: Direct |
| **Passos** | 1. Pesquisar um funcionário e abrir seu perfil.<br>2. Abrir a aba Job e selecionar Job Title Account Assistant e Employment Status Full-Time Permanent.<br>3. Salvar e abrir a aba Report-to.<br>4. Adicionar o primeiro supervisor retornado ao digitar 'a', selecionar Direct e salvar. |
| **Resultado Esperado** | O sistema exibe Success e mantém os dados funcionais e o supervisor no perfil. |

### CT-005-N – Negativo

| Campo | Valor |
|---|---|
| **ID** | CT-005-N |
| **RF** | RF-014 |
| **Tipo** | Negativo |
| **Título** | Bloquear supervisor sem Reporting Method |
| **Pré-condições** | Usuário autenticado; funcionário e supervisor ativos |
| **Dados de Teste** | Supervisor search: a;<br> Method: vazio |
| **Passos** | 1. Abrir Report-to no perfil do funcionário.<br>2. Adicionar o primeiro supervisor retornado ao digitar 'a'.<br>3. Manter Reporting Method vazio e clicar em Save. |
| **Resultado Esperado** | O sistema exibe Required em Reporting Method e não grava a relação. |

### CT-005-E – Exceção

| Campo | Valor |
|---|---|
| **ID** | CT-005-E |
| **RF** | RF-014 |
| **Tipo** | Exceção |
| **Título** | Impedir autorreferência de supervisor |
| **Pré-condições** | Usuário autenticado;<br> funcionário existente |
| **Dados de Teste** | Supervisor: mesmo funcionário; Method: Direct |
| **Passos** | 1. Abrir Report-to e clicar em Add Supervisor.<br>2. Pesquisar e selecionar o próprio funcionário.<br>3. Selecionar Direct e clicar em Save. |
| **Resultado Esperado** | O sistema rejeita a relação ou exibe validação impedindo autorreferência. |
