const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT_DIR = __dirname;
const AGENTS_DIR = path.join(ROOT_DIR, "docs", "agents");

function readMarkdownInstructions(agentsDir = AGENTS_DIR) {
  const requiredFiles = {
    orquestrador: "00-orquestrador.md",
    geradorCasos: "01-gerador-casos-teste.md",
    geradorScripts: "02-gerador-scripts-automatizados.md",
    executor: "03-executor-testes.md",
    avaliador: "04-avaliador-resultados.md",
  };

  return Object.fromEntries(
    Object.entries(requiredFiles).map(([key, fileName]) => {
      const filePath = path.join(agentsDir, fileName);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Arquivo de instrucoes nao encontrado: ${filePath}`);
      }

      return [
        key,
        {
          fileName,
          filePath,
          content: fs.readFileSync(filePath, "utf8"),
        },
      ];
    })
  );
}

function normalizeRequirements(input) {
  if (Array.isArray(input)) {
    return input;
  }

  if (typeof input === "string") {
    return [
      {
        requisito_id: "RF-001",
        descricao: input,
        criterios_aceite: [],
      },
    ];
  }

  if (input && typeof input === "object") {
    return [input];
  }

  return [
    {
      requisito_id: "RF-001",
      descricao: "Usuario deve conseguir autenticar no OrangeHRM com credenciais validas.",
      criterios_aceite: [
        "Usuario informa login e senha",
        "Sistema redireciona para o dashboard",
        "Credenciais invalidas exibem mensagem de erro",
      ],
    },
  ];
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "fluxo";
}

function executar_cypress(options = {}) {
  const projectDir = path.resolve(ROOT_DIR);
  const cwd = path.resolve(options.cwd || ROOT_DIR);

  if (cwd !== projectDir) {
    throw new Error(`A ferramenta executar_cypress so pode rodar dentro de: ${projectDir}`);
  }

  const args = ["cypress", "run"];
  if (options.spec) {
    args.push("--spec", options.spec);
  }

  const startedAt = Date.now();
  const result = spawnSync("npx", args, {
    cwd: projectDir,
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  return {
    ferramenta: "executar_cypress",
    comando: ["npx", ...args].join(" "),
    cwd: projectDir,
    exitCode: result.status,
    duracao_ms: Date.now() - startedAt,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    logs: [result.stdout, result.stderr].filter(Boolean).join("\n"),
    erro: result.error ? result.error.message : null,
  };
}

class Agent {
  constructor(name, instructions) {
    this.name = name;
    this.instructions = instructions;
  }

  execute() {
    throw new Error(`Agente ${this.name} deve implementar execute()`);
  }
}

class AgenteGerador extends Agent {
  execute(requirements) {
    const requisitos = normalizeRequirements(requirements);
    const casosDeTeste = requisitos.flatMap((requisito, index) => {
      const requisitoId = requisito.requisito_id || `RF-${String(index + 1).padStart(3, "0")}`;
      const descricao = requisito.descricao || String(requisito);
      const baseId = String(index + 1).padStart(3, "0");

      return [
        {
          id: `CT-${baseId}-P`,
          requisito_id: requisitoId,
          tipo: "positivo",
          titulo: `Fluxo positivo - ${descricao}`,
          pre_condicoes: ["Aplicacao acessivel no ambiente experimental"],
          dados: {},
          passos: [
            "Acessar a funcionalidade descrita no requisito",
            "Informar dados validos",
            "Executar a acao principal",
          ],
          resultado_esperado: "Sistema conclui o fluxo com sucesso",
        },
        {
          id: `CT-${baseId}-N`,
          requisito_id: requisitoId,
          tipo: "negativo",
          titulo: `Fluxo negativo - ${descricao}`,
          pre_condicoes: ["Aplicacao acessivel no ambiente experimental"],
          dados: {},
          passos: [
            "Acessar a funcionalidade descrita no requisito",
            "Informar dados invalidos ou incompletos",
            "Executar a acao principal",
          ],
          resultado_esperado: "Sistema impede a acao e exibe mensagem adequada",
        },
        {
          id: `CT-${baseId}-E`,
          requisito_id: requisitoId,
          tipo: "excecao",
          titulo: `Caso de excecao - ${descricao}`,
          pre_condicoes: ["Aplicacao acessivel no ambiente experimental"],
          dados: {},
          passos: [
            "Acessar a funcionalidade descrita no requisito",
            "Simular condicao inesperada ou limite",
            "Observar o comportamento do sistema",
          ],
          resultado_esperado: "Sistema trata a excecao sem comportamento inconsistente",
        },
      ];
    });

    const scripts = casosDeTeste.map((caso) => {
      const specName = `${slugify(caso.requisito_id)}.generated.cy.js`;
      return {
        caso_id: caso.id,
        arquivo: path.join("cypress", "e2e", specName),
        teste: `${caso.id} - ${caso.titulo}`,
        framework: "Cypress",
        status_geracao: "planejado",
        codigo: this.createCypressSkeleton(caso),
      };
    });

    return {
      agente: this.name,
      instrucoes_usadas: this.instructions.fileName,
      requisitos,
      casosDeTeste,
      scripts,
    };
  }

  createCypressSkeleton(caso) {
    return [
      `describe('${caso.requisito_id}', () => {`,
      `  it('${caso.id} - ${caso.titulo.replace(/'/g, "\\'")}', () => {`,
      "    cy.visit('/');",
      `    // Passos planejados: ${caso.passos.join(" | ")}`,
      `    // Resultado esperado: ${caso.resultado_esperado}`,
      "    cy.contains('body', '').should('exist');",
      "  });",
      "});",
      "",
    ].join("\n");
  }
}

class AgenteExecutor extends Agent {
  constructor(name, instructions, tools = {}) {
    super(name, instructions);
    this.tools = tools;
  }

  execute(geracao, options = {}) {
    const dryRun = options.dryRun !== false;
    const comando = options.spec
      ? `npx cypress run --spec "${options.spec}"`
      : "npx cypress run";

    if (dryRun) {
      return {
        agente: this.name,
        instrucoes_usadas: this.instructions.fileName,
        modo: "dry-run",
        comando,
        total: geracao.scripts.length,
        passaram: 0,
        falharam: 0,
        pendentes: geracao.scripts.length,
        falhas: [],
        entrada: geracao.scripts,
      };
    }

    if (typeof this.tools.executar_cypress !== "function") {
      throw new Error("Action Tool executar_cypress nao foi fornecida ao Agente Executor.");
    }

    const result = this.tools.executar_cypress({
      cwd: ROOT_DIR,
      spec: options.spec,
    });

    return {
      agente: this.name,
      instrucoes_usadas: this.instructions.fileName,
      modo: "execucao",
      comando: result.comando || comando,
      cwd: result.cwd,
      exitCode: result.exitCode,
      duracao_ms: result.duracao_ms,
      stdout: result.stdout,
      stderr: result.stderr,
      logs: result.logs,
      total: geracao.scripts.length,
      passaram: result.exitCode === 0 ? geracao.scripts.length : 0,
      falharam: result.exitCode === 0 ? 0 : geracao.scripts.length,
      pendentes: 0,
      falhas: result.exitCode === 0 ? [] : [{ erro: result.erro || result.stderr || result.stdout || "Falha na execucao" }],
      entrada: geracao.scripts,
    };
  }
}

class AgenteAvaliador extends Agent {
  execute(execucao, geracao, criterios = {}) {
    const totalRequisitos = geracao.requisitos.length || 1;
    const requisitosComCasos = new Set(geracao.casosDeTeste.map((caso) => caso.requisito_id)).size;
    const coberturaRequisitos = requisitosComCasos / totalRequisitos;
    const taxaScriptsGerados = geracao.scripts.length / Math.max(geracao.casosDeTeste.length, 1);
    const executados = execucao.passaram + execucao.falharam;
    const taxaSucessoExecucao = executados === 0 ? 0 : execucao.passaram / executados;

    const criteriosFinais = {
      cobertura_minima_requisitos: 0.8,
      taxa_minima_sucesso_execucao: 0.9,
      falhas_criticas_permitidas: 0,
      scripts_devem_ser_executaveis: true,
      ...criterios,
    };

    const atingiuCobertura = coberturaRequisitos >= criteriosFinais.cobertura_minima_requisitos;
    const atingiuExecucao =
      execucao.modo === "dry-run" || taxaSucessoExecucao >= criteriosFinais.taxa_minima_sucesso_execucao;
    const falhasCriticas = execucao.falharam;

    let classificacao = "parcialmente eficaz";
    if (execucao.modo === "dry-run") {
      classificacao = "inconclusivo";
    } else if (atingiuCobertura && atingiuExecucao && falhasCriticas <= criteriosFinais.falhas_criticas_permitidas) {
      classificacao = "eficaz";
    } else if (!atingiuCobertura || !atingiuExecucao) {
      classificacao = "ineficaz";
    }

    return {
      agente: this.name,
      instrucoes_usadas: this.instructions.fileName,
      criterios: criteriosFinais,
      cobertura_requisitos: Number(coberturaRequisitos.toFixed(2)),
      taxa_scripts_gerados: Number(taxaScriptsGerados.toFixed(2)),
      taxa_sucesso_execucao: Number(taxaSucessoExecucao.toFixed(2)),
      falhas_criticas: falhasCriticas,
      classificacao,
      conclusao:
        execucao.modo === "dry-run"
          ? "Fluxo orquestrado sem executar Cypress; execute com --run para medir eficacia real."
          : `Fluxo classificado como ${classificacao}.`,
      melhorias_recomendadas: execucao.falharam > 0 ? ["Revisar falhas de execucao antes de concluir eficacia."] : [],
    };
  }
}

class AgenteOrquestrador extends Agent {
  constructor(instructions, agents) {
    super("Agente Orquestrador", instructions);
    this.agents = agents;
  }

  execute(input = {}) {
    const requisitos = input.requisitos || input.requirements || input.requisito || input.requirement;
    const geracao = this.agents.gerador.execute(requisitos);
    const execucao = this.agents.executor.execute(geracao, input.options || {});
    const avaliacao = this.agents.avaliador.execute(execucao, geracao, input.criterios || {});

    return {
      agente: this.name,
      instrucoes_usadas: this.instructions.fileName,
      etapas: {
        geracao,
        execucao,
        avaliacao,
      },
      resumo: {
        requisitos_processados: geracao.requisitos.length,
        casos_gerados: geracao.casosDeTeste.length,
        scripts_gerados: geracao.scripts.length,
        execucao: {
          total: execucao.total,
          passaram: execucao.passaram,
          falharam: execucao.falharam,
          pendentes: execucao.pendentes,
        },
        avaliacao_final: avaliacao.classificacao,
      },
    };
  }
}

function createManager() {
  const instructions = readMarkdownInstructions();
  const gerador = new AgenteGerador("Agente Gerador", instructions.geradorCasos);
  const executor = new AgenteExecutor("Agente Executor", instructions.executor, {
    executar_cypress,
  });
  const avaliador = new AgenteAvaliador("Agente Avaliador", instructions.avaliador);

  return new AgenteOrquestrador(instructions.orquestrador, {
    gerador,
    executor,
    avaliador,
  });
}

function parseArgs(argv) {
  const args = {
    options: {
      dryRun: true,
    },
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--run") {
      args.options.dryRun = false;
    } else if (arg === "--dry-run") {
      args.options.dryRun = true;
    } else if (arg === "--spec") {
      args.options.spec = argv[++index];
    } else if (arg === "--requirements" || arg === "--requisito") {
      args.requisitos = argv[++index];
    } else if (arg === "--requirements-file" || arg === "--requisitos-file") {
      const filePath = path.resolve(ROOT_DIR, argv[++index]);
      const raw = fs.readFileSync(filePath, "utf8");
      args.requisitos = filePath.endsWith(".json") ? JSON.parse(raw) : raw;
    }
  }

  return args;
}

function main() {
  const manager = createManager();
  const result = manager.execute(parseArgs(process.argv.slice(2)));
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = {
  AgenteAvaliador,
  AgenteExecutor,
  AgenteGerador,
  AgenteOrquestrador,
  createManager,
  executar_cypress,
  normalizeRequirements,
  readMarkdownInstructions,
};
