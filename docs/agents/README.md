# Fluxo multiagente para automacao de testes

Este diretorio descreve os agentes usados no fluxo experimental de geracao, execucao e avaliacao de testes automatizados.

## Ordem de execucao
1. `00-orquestrador.md` coordena a passagem de informacoes entre agentes.
2. `01-gerador-casos-teste.md` transforma requisitos em casos de teste.
3. `02-gerador-scripts-automatizados.md` converte casos em scripts executaveis.
4. `03-executor-testes.md` executa os scripts e coleta evidencias.
5. `04-avaliador-resultados.md` avalia os resultados contra criterios definidos.

## Contrato entre agentes
Cada agente deve receber uma entrada estruturada e devolver uma saida estruturada. Sempre que possivel, use JSON para reduzir ambiguidades e facilitar a comparacao dos resultados.

## Artefatos sugeridos
- Requisitos: `docs/requisitos/`.
- Casos de teste gerados: `docs/casos-de-teste/`.
- Scripts automatizados: `cypress/e2e/`.
- Relatorios de execucao: `docs/resultados/`.
- Avaliacoes finais: `docs/avaliacoes/`.
