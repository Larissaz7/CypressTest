# Projeto de Testes Automatizados - OrangeHRM com Cypress

Este repositório contém uma suíte de testes de ponta a ponta (E2E) desenvolvida em Cypress para o sistema de demonstração **OrangeHRM**. O objetivo principal é validar fluxos críticos de RH, como autenticação e gerenciamento de colaboradores/candidatos.

##  Tecnologias Utilizadas
* [Cypress](https://www.cypress.io/) - Framework de automação de testes
* [Sistema](https://opensource-demo.orangehrmlive.com/) - Sistema Testado

##Funcionalidades Cobertas (Requisitos)
* **[RF-001/002] Autenticação:** Login com credenciais válidas e validação de cenários de erro.
* **[RF-003/004] Módulo PIM:** Cadastro e consulta de novos funcionários com dados dinâmicos.
* **[RF-005/006] Recrutamento:** Inclusão de novas vagas de emprego e registro de candidatos associados.

## 🛠️ Comandos Para Executar o Projeto

1. Clone este repositório para a sua máquina
2. cd testesCypress
3. npx cypress open
4. npx cypress run
