# Agente Codex para testes Cypress

## Papel
Atue como um agente de automacao de testes end-to-end para este projeto Cypress. O objetivo principal e manter, corrigir e ampliar testes do OrangeHRM com foco em estabilidade, clareza e baixo retrabalho.

## Contexto do projeto
- Projeto Node.js com Cypress.
- Configuracao principal: `cypress.config.js`.
- `baseUrl` atual: `https://opensource-demo.orangehrmlive.com`.
- Specs ficam em `cypress/e2e`.
- Comandos e suporte ficam em `cypress/support`.
- Fixtures ficam em `cypress/fixtures`.
- Artefatos gerados, como screenshots e videos, nao devem ser tratados como codigo-fonte.

## Como trabalhar
- Leia `package.json`, `cypress.config.js` e os specs relevantes antes de alterar testes.
- Prefira seletores estaveis: atributos, `name`, textos funcionais e estruturas previsiveis da UI.
- Evite seletores muito frageis quando houver alternativa mais clara, especialmente classes geradas apenas para estilo.
- Quando um fluxo se repetir, extraia um comando customizado em `cypress/support/commands.js`.
- Mantenha cada spec focado em um modulo ou fluxo de negocio.
- Use nomes de testes em portugues, claros sobre o comportamento esperado.
- Preserve credenciais publicas de demonstracao apenas quando forem necessarias para o ambiente OrangeHRM demo.
- Nao adicione esperas fixas (`cy.wait(tempo)`) sem necessidade real. Prefira assertions e espera por elementos/rotas.

## Padroes Cypress
- Use `beforeEach` para preparacao comum do teste.
- Use `cy.visit()` com caminhos relativos ao `baseUrl`.
- Antes de interagir com elementos, valide visibilidade quando isso aumentar a confiabilidade do teste.
- Assercoes devem confirmar resultado de negocio, nao apenas que um clique aconteceu.
- Para login reutilizavel, prefira criar/usar `cy.login()` em `cypress/support/commands.js`.

## Comandos de verificacao
- Para rodar todos os testes em modo headless: `npx cypress run`.
- Para abrir o Cypress interativo: `npx cypress open`.
- Se adicionar scripts ao `package.json`, prefira nomes como `cy:run` e `cy:open`.

## Cuidados com arquivos
- Nao edite `node_modules`.
- Nao versione screenshots, videos ou caches gerados.
- Nao altere `package-lock.json` sem mudanca real de dependencias.
- Antes de remover ou renomear specs, verifique se ha referencias ou duplicacao intencional.

## Ao finalizar uma alteracao
- Explique quais specs ou fluxos foram alterados.
- Informe qual comando de verificacao foi executado.
- Se nao for possivel rodar Cypress, diga o motivo e o risco restante.

## Fluxo multiagente experimental
Este projeto tambem possui especificacoes de agentes em `docs/agents` para apoiar um fluxo experimental de automacao de testes.

Ao receber requisitos para transformar em testes, siga esta ordem:
1. Consulte `docs/agents/00-orquestrador.md` para coordenar o fluxo.
2. Use `docs/agents/01-gerador-casos-teste.md` para gerar casos positivos, negativos e excecoes.
3. Use `docs/agents/02-gerador-scripts-automatizados.md` para converter os casos em specs Cypress.
4. Use `docs/agents/03-executor-testes.md` para executar os testes e coletar evidencias.
5. Use `docs/agents/04-avaliador-resultados.md` para avaliar eficacia, cobertura e falhas.

Mantenha rastreabilidade entre requisito, caso de teste, script gerado e resultado de execucao.
