import "./style.css";
import { Capacitor } from "@capacitor/core";
import portugueseWords from "an-array-of-portuguese-words";
import bgThemeMusic from "./assets/bg-theme.mp3";
import artPhase from "./assets/canva-1.png";
import artBirdLogo from "./assets/bird-logo.jpg";

const phaseArtEntries = Object.entries(import.meta.glob("./assets/canva-*.png", {
  eager: true,
  import: "default",
}));

const phaseArtPool = phaseArtEntries
  .map(([path, url]) => {
    const match = path.match(/canva-(\d+)\.png$/i);
    return {
      index: match ? Number.parseInt(match[1], 10) : Number.NaN,
      url,
    };
  })
  .filter((entry) => !Number.isNaN(entry.index))
  .sort((a, b) => a.index - b.index);

const preferredPhaseArts = phaseArtPool
  .filter((entry) => entry.index >= 2 && entry.index <= 10)
  .map((entry) => entry.url);

const PHASE_ART_ROTATION = preferredPhaseArts.length ? preferredPhaseArts : [artPhase];

const menuArtEntries = Object.entries(import.meta.glob("./assets/menu-bg.*", {
  eager: true,
  import: "default",
}));

const MENU_ART = menuArtEntries[0]?.[1] || phaseArtPool.find((entry) => entry.index === 9)?.url || PHASE_ART_ROTATION[0] || artPhase;

const TOTAL_PHASES = 2000;
const PHASE_COMPLETE_COINS = 50;
const BASIC_HINT_COST = 500;
const PREMIUM_HINT_PACK_COST = 20;
const PREMIUM_HINT_PACK_AMOUNT = 5;
const BONUS_WORD_POINTS = 50;
const PROGRESS_STORAGE_KEY = "menor-games-progress-v1";
const SYNC_INTERVAL_MS = 2 * 60 * 1000;
const DEFAULT_PUBLIC_API_URL = "https://menor-games-public-ranking.onrender.com";
const API_BASE_URL = typeof window !== "undefined"
  ? ((import.meta.env.VITE_RANKING_API_URL || "").trim() || DEFAULT_PUBLIC_API_URL)
  : DEFAULT_PUBLIC_API_URL;
const PROFILE_AVATARS = ["🦊", "🐼", "🐸", "🐯", "🐧", "🐙", "🐵", "🦁", "🐨", "🐻"];
const PROFILE_COLORS = ["#ffcf66", "#8fd8ff", "#a9f0b2", "#ffc8d6", "#c9c5ff", "#ffb980", "#9fe9df"];
const PROFILE_NAME_PREFIXES = ["Cap", "Mestre", "Turbo", "Ninja", "Super", "Mega", "Ultra", "Brabo", "Lenda", "Pulo"];
const PROFILE_NAME_SUFFIXES = ["Palavra", "Caça", "Letras", "Puzzle", "Jogo", "Rima", "Sábio", "Fase", "Gênio", "Trilha"];

// Robot de fases: banco de palavras comuns (sem nomes proprios), por dificuldade.
const WORD_TIERS = [
  [
    "ABRA", "ABRE", "ACORDA", "AMAR", "AMOR", "ANEL", "ARROZ", "ASA", "AZUL", "BALA", "BARCO",
    "BEBE", "BICO", "BOLA", "BOLO", "BOTA", "BRISA", "CAIXA", "CALOR", "CAMA", "CANA", "CARA",
    "CASA", "CEU", "CHAO", "CHUVA", "COCO", "COPO", "COR", "CORDA", "CORA", "DADO", "DENTE",
    "DIA", "DOCE", "DOR", "ECO", "ERVA", "ESCOLA", "ESTRELA", "FACA", "FARO", "FAROL", "FELIZ",
    "FITA", "FLOR", "FOGO", "FOLHA", "FORTE", "FRIO", "FRUTA", "GATO", "GELO", "GOTA", "GRAMA",
    "GRUPO", "ILHA", "JANELA", "JOGO", "LADO", "LAR", "LEITE", "LIMPO", "LINHA", "LIVRO", "LUA",
    "LUZ", "MACA", "MÃO", "MAR", "MASSA", "MATO", "MEL", "MESA", "MILHO", "MISTO", "MOEDA",
    "MOLA", "MUNDO", "NATA", "NAVE", "NEVE", "NOITE", "NOME", "NUVEM", "OLHO", "ONDA", "OURO",
    "PÃO", "PAPEL", "PAR", "PAREDE", "PATO", "PEDRA", "PEIXE", "PENA", "PIPA", "PISO", "PLANO",
    "POÇO", "PONTE", "PORTA", "PRATO", "QUADRO", "QUENTE", "RAIO", "RAMO", "REDE", "REI", "RIO",
    "RODA", "ROSTO", "RUA", "SABOR", "SACO", "SAL", "SAPATO", "SEDE", "SINO", "SOL", "SONHO",
    "SOPA", "SUCO", "TELA", "TEMPO", "TERRA", "TETO", "TINTA", "TOCA", "TOPO", "TRILHA", "TUDO",
    "UVA", "VALOR", "VASO", "VELA", "VENTO", "VERDE", "VIDA", "VILA", "VINHO", "VIVO", "VOO",
    "AMORA", "ANO", "APELO", "ARCA", "ARTE", "ATO", "AULA", "AVE", "AVIAO", "BAR", "BOIA",
    "BRIO", "CABO", "CAL", "CALMA", "CANO", "CAPA", "CEDO", "CENA", "CIMA", "COLA", "CUBO",
    "DANO", "DUNA", "FENO", "FIA", "FIO", "FUGA", "GALO", "GEMA", "GIRO", "GOMA", "GRUA",
    "HORA", "IDEIA", "IMA", "JATO", "LAGO", "LATA", "LEMA", "LENTE", "LONA", "LUTA", "MALA",
    "MEIO", "META", "MIMO", "MITO", "MODA", "MUDO", "NADO", "NINHO", "NO", "NORTE", "NOTA",
    "OCA", "ORLA", "PANO", "PICO", "PODA", "POEMA", "PONTA", "POTE", "PRUMA", "RAIZ", "RATO",
    "RETA", "RIMA", "RITO", "RUMO", "SOMA", "TALA", "TEMA", "TINA", "TIPO", "TIRA", "TOMO",
    "TRAMA", "TROCA", "TRONO", "TURMA", "VAGA", "VIA", "VIGA", "VIRA", "VISTA", "VOTO",
  ],
  [
    "ABRIGO", "ACENDER", "AGUA", "ALFACE", "ALVO", "AMARELO", "AMIGO", "ANIMAL", "APITO", "AREIA",
    "ARMA", "ASTRO", "ATALHO", "AVISO", "BALANCO", "BANCO", "BARULHO", "BATIDA", "BEBIDA", "BELEZA",
    "BONECA", "BORBOLETA", "BRAVO", "BRILHO", "BROTO", "CADERNO", "CAMINHO", "CANETA", "CANTAR",
    "CAPA", "CAPIM", "CAPITULO", "CARINHO", "CARTA", "CASACO", "CENTRO", "CIDADE", "CLARO", "CLIMA",
    "COLHER", "CORES", "CORPO", "CORRER", "CRESCER", "CRIAR", "CUIDAR", "DESCER", "DESENHO", "DOURADO",
    "ENERGIA", "ENXERGAR", "ESCADA", "ESCREVER", "ESCURO", "ESPACO", "ESPUMA", "ESTADO", "EXEMPLO",
    "FAMILIA", "FASE", "FESTA", "FIGURA", "FOGAO", "FORMA", "FORNO", "FRASE", "FRESCO", "FUTURO",
    "GANHAR", "GARRAFA", "GOSTO", "GRANDE", "GRITO", "HORTA", "IDEIA", "IMAGEM", "INVERNO", "JARDIM",
    "JORNADA", "LAMPADA", "LARANJA", "LETRA", "LISTA", "LIVRARIA", "LOJA", "LONGE", "MADRUGA", "MAIOR",
    "MANTEIGA", "MELHOR", "MENTE", "METAL", "MONTAR", "MORAR", "MUSICA", "NATUREZA", "NINHO", "NORMAL",
    "NOTICIA", "NUMERO", "OFICINA", "ORDEM", "ORIGEM", "PAISAGEM", "PASSEIO", "PEQUENO", "PERTO",
    "PINTAR", "PLANTA", "PONTO", "PRAIA", "PRONTO", "QUADRA", "QUEIJO", "RAPIDO", "RECEITA", "REGRA",
    "RESPIRAR", "RISCO", "ROTEIRO", "RUMO", "SABER", "SENTIR", "SERRA", "SILENCIO", "SIMPLES", "SORTE",
    "SUAVE", "TAREFA", "TESOURO", "TOMATE", "TOQUE", "TRABALHO", "TRECHO", "TRIGO", "UNIAO", "URBANO",
    "VIAGEM", "VITORIA", "VIZINHO", "VONTADE", "ZONA",
  ],
  [
    "ABERTO", "ACOLHER", "ADOTAR", "AGIL", "ALIMENTO", "ALMOCO", "AMANHECER", "AMBIENTE", "APROVAR",
    "ARQUITETO", "ARRUMAR", "ATITUDE", "AUMENTAR", "AVENTURA", "BRINCADEIRA", "CADERNETA", "CALENDARIO",
    "CAMPANHA", "CANTINHO", "CAPACETE", "CARREIRA", "CATAVENTO", "CELEBRAR", "CENARIO", "CERTO", "CHAMAR",
    "CHEIRO", "CIRCUITO", "COLETAR", "COMBINAR", "COMER", "COMUNIDADE", "CONSTRUIR", "CONVERSA", "CORAGEM",
    "CORTINA", "CUIDADO", "DECISAO", "DESEJO", "DESPERTAR", "DESTINO", "DESVIO", "DIRECAO", "DISTRITO",
    "EDIFICIO", "ENCONTRO", "ENTRADA", "EQUILIBRIO", "ESCOLHA", "ESFORCO", "ESPELHO", "ESTANTE", "ESTILO",
    "ESTIMAR", "ESTUDAR", "ETAPA", "EXERCICIO", "EXPLICAR", "FABRICA", "FANTASIA", "FARINHA", "FERIADO",
    "FERRAMENTA", "FLORESTA", "FREIO", "FUNCIONAR", "GELADEIRA", "GERAL", "HABITO", "HARMONIA", "HISTORIA",
    "HORARIO", "IDEAL", "IGUAL", "IMENSO", "IMPORTANTE", "JANELINHA", "JUSTO", "LABIRINTO", "LARGURA",
    "LEMBRAR", "LEVEZA", "MADEIRA", "MANHA", "MARGEM", "MELODIA", "MERCADO", "MINUTO", "MISTURAR", "MODERNO",
    "MOLDURA", "MONTANHA", "MOVIMENTO", "NASCENTE", "NAVEGAR", "OBJETO", "OPCAO", "ORGANIZAR", "PACOTE",
    "PANELA", "PARCEIRO", "PASSAGEM", "PENSAR", "PERCURSO", "PERGUNTA", "PERIODO", "PESQUISA", "PINTURA",
    "PLANEJAR", "PODER", "POMAR", "PONDERAR", "PRATICA", "PREFERIR", "PREPARAR", "PROJETO", "PROXIMO",
    "QUADRICULA", "QUILATE", "REALIZAR", "RECEBER", "RECURSO", "RETRATO", "ROTINA", "SEGREDO", "SEMANA",
    "SENSACAO", "SERVICO", "SINAL", "SISTEMA", "SITUACAO", "SORRISO", "SUPORTE", "TERMINAR", "TRADICAO",
    "TRAVESSIA", "UNIDADE", "UTIL", "VAREJO", "VENTANIA", "VERTENTE", "VIAVEL", "VIGOR", "VISITA", "VOLUME",
  ],
  [
    "ABUNDANTE", "ACESSIVEL", "ACONTECE", "ADAPTAR", "ALTERNAR", "AMPLIAR", "ANALISAR", "APRENDER", "APROXIMAR",
    "ARMAZENAR", "ASSUNTO", "ATIVIDADE", "ATUALIZAR", "AUTONOMO", "BENEFICIO", "BIBLIOTECA", "CADERNINHO",
    "CAMPEONATO", "CARGUEIRO", "CENARISTA", "CIRCULAR", "COLECAO", "COMPLETAR", "COMPOSICAO", "CONCEITO",
    "CONCLUIR", "CONEXAO", "CONQUISTAR", "CONSTANTE", "CONTEUDO", "CONTRASTE", "CONVITE", "COORDENAR",
    "CRIATIVO", "CURIOSO", "DESAFIO", "DESCOBRIR", "DESENROLAR", "DESENVOLVER", "DIALOGAR", "DIFERENTE",
    "DINAMICO", "DIRETRIZ", "DURAVEL", "EDUCATIVO", "ELEGANTE", "EMBALAGEM", "ENCANTAR", "ENRIQUECER", "EQUIPAMENTO",
    "ESTRUTURA", "EVOLUIR", "EXIGENTE", "EXPLORAR", "FACILITAR", "FAVORITO", "FERRAMENTAL", "FLEXIVEL", "FORMULAR",
    "FUNCIONAL", "FUNDAMENTO", "GERENCIAR", "HABILIDADE", "IDEALIZAR", "ILUMINAR", "INCENTIVO", "INDICAR", "INOVADOR",
    "INSPIRAR", "INTEGRAR", "INTUITIVO", "JORNALISMO", "LIDERANCA", "MANUTENCAO", "MECANISMO", "MENSAGEM", "MOBILIDADE",
    "MODULAR", "MOTIVAR", "NATURAL", "NAVEGACAO", "OBJETIVO", "OTIMIZAR", "PARCERIA", "PERSISTIR", "PLANEJAMENTO",
    "POTENCIAL", "PREDIO", "PRIORIDADE", "PROCESSO", "PRODUTIVO", "PROGRESSO", "QUALIDADE", "QUANTIDADE", "RACIOCINIO",
    "RECOMENDAR", "REFINAR", "RELATORIO", "RENOVAR", "RESOLVER", "RESPONSIVO", "RESULTADO", "SEQUENCIA", "SIGNIFICADO",
    "SIMPLICIDADE", "SOLUCIONAR", "SUSTENTAR", "TECNICA", "TEMATICA", "TRABALHAR", "TRANSFORMAR", "UNIVERSAL", "USABILIDADE",
    "VALIDAR", "VARIACAO", "VERIFICAR", "VISUALIZAR", "VOCABULARIO",
  ],
];

const BONUS_EXCLUDED_WORDS = new Set(["ROI", "AROM", "AUL"]);

const BONUS_DICTIONARY_MAP = new Map();

function registerBonusWord(rawWord) {
  const word = String(rawWord || "").trim();
  if (!word || !/^\p{L}+$/u.test(word)) {
    return;
  }

  // Filtra siglas/proprios em maiusculas vindos de bases externas.
  if (word !== word.toLocaleLowerCase("pt-BR")) {
    return;
  }

  const normalized = toUpperAscii(word);
  if (normalized.length < 3) {
    return;
  }

  const displayWord = word.toLocaleUpperCase("pt-BR");
  const current = BONUS_DICTIONARY_MAP.get(normalized);
  const nextHasAccent = /[^\u0000-\u007F]/.test(displayWord);
  const currentHasAccent = current ? /[^\u0000-\u007F]/.test(current) : false;

  // Prefere variante com acento para mostrar mensagem correta (ex.: CÃO).
  if (!current || (nextHasAccent && !currentHasAccent)) {
    BONUS_DICTIONARY_MAP.set(normalized, displayWord);
  }
}

portugueseWords.forEach(registerBonusWord);
// Base USP tinha fragmentos/ruido que geravam falsos bonus (ex.: formas truncadas).
// Mantemos apenas o dicionario principal para aceitar somente palavras reais.
// uspWordsRaw.split(/\r?\n/).forEach(registerBonusWord);

const BONUS_DICTIONARY_WORDS = new Set(BONUS_DICTIONARY_MAP.keys());

const state = {
  phase: 1,
  points: 0,
  hints: 5,
  basicCoins: 0,
  premiumCoins: 0,
  soundEnabled: true,
  musicEnabled: true,
  vibrationEnabled: false,
  profile: null,
  onlineLeaderboard: [],
  friendsLeaderboard: [],
  friendRequests: [],
  phaseSessions: {},
  bonusWords: new Set(),
  activePointerId: null,
  selectedIndexes: [],
  currentWord: "",
  foundWords: new Set(),
  hintedCells: new Map(),
  isDragging: false,
  currentPuzzle: null,
};

const app = document.querySelector("#app");

document.documentElement.style.setProperty("--art-phase", `url(${artPhase})`);
document.documentElement.style.setProperty("--art-game", `url(${MENU_ART})`);
document.documentElement.style.setProperty("--art-menu", `url(${MENU_ART})`);
document.documentElement.style.setProperty("--art-logo", `url(${artBirdLogo})`);
document.documentElement.style.setProperty("--art-splash-bg", `url(${PHASE_ART_ROTATION[0] || artPhase})`);

app.innerHTML = `
  <main class="screen">
    <section id="splash-screen" class="splash-screen">
      <article class="splash-card">
        <div class="splash-logo"></div>
        <h1>Menor Games</h1>
        <p>Carregando mundo das palavras...</p>
        <div class="loading-bar"><span id="splash-progress"></span></div>
      </article>
    </section>

    <section id="menu-screen" class="menu-screen hidden">
      <div class="menu-cloud menu-cloud-1" aria-hidden="true"></div>
      <div class="menu-cloud menu-cloud-2" aria-hidden="true"></div>
      <div class="menu-cloud menu-cloud-3" aria-hidden="true"></div>
      <div class="menu-water" aria-hidden="true"></div>

      <div class="menu-top-bar">
        <button id="menu-store-btn" class="menu-icon-btn" type="button" aria-label="Abrir loja">🛒</button>
        <div class="menu-top-actions-right">
          <button id="menu-profile-btn" class="menu-icon-btn menu-profile-icon" type="button" aria-label="Abrir perfil">
            <span id="menu-profile-avatar" class="menu-profile-avatar">🙂</span>
          </button>
          <button id="menu-settings-btn" class="menu-icon-btn" type="button" aria-label="Configurações do menu">⚙</button>
          <button id="menu-leaderboard-btn" class="menu-icon-btn" type="button" aria-label="Abrir ranking">🏆</button>
          <button id="menu-friends-btn" class="menu-icon-btn" type="button" aria-label="Abrir amigos">👥</button>
        </div>
      </div>

      <article class="menu-card menu-main-card">
        <h2 class="menu-game-title">
          <span class="menu-title-menor">MENOR</span>
          <span class="menu-title-games">GAMES</span>
        </h2>
        <div class="menu-main-actions">
          <button id="menu-play-btn" class="primary-btn" type="button">JOGAR</button>
          <button id="menu-modes-btn" class="secondary-btn" type="button">MODOS</button>
          <button id="menu-exit-btn" class="secondary-btn danger" type="button">SAIR</button>
        </div>
      </article>

      <footer class="menu-footer" aria-hidden="true">
        <span class="menu-footer-sub">LIPSUM</span>
        <span class="menu-footer-main">Lorem</span>
      </footer>
    </section>

    <section id="phase-select-screen" class="menu-screen hidden">
      <button id="phase-back-btn" class="menu-back-btn" type="button" aria-label="Voltar ao menu">←</button>
      <article class="menu-card">
        <h2>Selecionar Fase</h2>
        <p id="menu-phase">Fase atual: 1/${TOTAL_PHASES}</p>
        <div class="phase-select-row">
          <label class="phase-select-label" for="phase-picker">Escolher fase</label>
          <div class="phase-select-controls">
            <input
              id="phase-picker"
              class="phase-picker"
              type="number"
              min="1"
              max="${TOTAL_PHASES}"
              step="1"
              value="1"
            />
          </div>
        </div>
        <button id="start-btn" class="primary-btn" type="button">Iniciar</button>
      </article>
    </section>

    <section id="phase-loader" class="phase-loader hidden">
      <article class="phase-card">
        <p id="phase-loader-text">Carregando fase 1...</p>
        <div class="phase-progress" aria-hidden="true"><span id="phase-loader-progress"></span></div>
      </article>
    </section>

    <section class="panel hidden" id="game-panel">
      <section class="hud-top">
        <div class="currency-wrap">
          <span class="currency-chip" id="basic-coins-chip" title="Moedas básicas">🪙 <strong id="basic-coins">0</strong></span>
          <span class="currency-chip premium" id="premium-coins-chip" title="Moedas premium">💎 <strong id="premium-coins">0</strong></span>
        </div>
        <div class="hud-side-actions">
          <button id="settings-btn" class="settings-btn" type="button" aria-label="Configurações">⚙</button>
        </div>
      </section>

      <section class="board" id="board" aria-label="Tabuleiro conectado"></section>

      <section class="current" id="current-wrap">
        <strong id="current-word"></strong>
      </section>

      <section class="wheel-wrap">
        <div class="wheel" id="wheel">
          <svg class="connectors" id="connectors" viewBox="0 0 280 280" preserveAspectRatio="none"></svg>
        </div>
      </section>

      <button id="hint-btn" class="hint-card" type="button" aria-label="Usar dica">
        <span class="hint-icon">💡</span>
        <span class="hint-count" id="hint-count">5</span>
      </button>
      <button id="store-btn" class="store-card" type="button" aria-label="Abrir loja">🛍</button>

      <p class="message" id="message">Toque, arraste e solte para validar.</p>
    </section>

    <section class="overlay hidden" id="win-overlay" role="dialog" aria-modal="true">
      <article class="popup">
        <button class="popup-close" id="win-close" type="button" aria-label="Fechar">x</button>
        <div class="mascot-cut" aria-hidden="true"><span>🏆</span></div>
        <h2>Parabéns!</h2>
        <p id="win-text">Você concluiu a fase.</p>
        <button class="popup-action" id="win-next" type="button">Avançar</button>
      </article>
    </section>

    <section class="overlay hidden" id="hint-overlay" role="dialog" aria-modal="true">
      <article class="popup">
        <button class="popup-close" id="hint-close" type="button" aria-label="Fechar">x</button>
        <div class="mascot-cut" aria-hidden="true"><span>💡</span></div>
        <h2>Sem lâmpadas</h2>
        <p>Escolha como ganhar dicas: anúncio, moeda básica ou pacote premium.</p>
        <div class="popup-choices">
          <button class="popup-action" id="watch-ad-btn" type="button">Ver anúncio (+1)</button>
          <button class="popup-action" id="buy-hint-basic-btn" type="button">Comprar 1 dica (${BASIC_HINT_COST} 🪙)</button>
          <button class="popup-action alt" id="buy-hints-premium-btn" type="button">Pacote premium ${PREMIUM_HINT_PACK_AMOUNT} dicas (${PREMIUM_HINT_PACK_COST} 💎)</button>
        </div>
      </article>
    </section>

    <section class="overlay hidden" id="settings-overlay" role="dialog" aria-modal="true">
      <article class="settings-sheet">
        <div class="settings-sheet-header">
          <button class="settings-sheet-close" id="settings-close" type="button" aria-label="Fechar">←</button>
          <span>CONFIGURAÇÕES</span>
        </div>

        <div class="settings-sheet-body">
          <label class="settings-row" for="toggle-sound">
            <span class="settings-row-left"><span class="settings-row-icon">🔊</span><span class="settings-row-label">Som</span></span>
            <span class="switch-wrap">
              <input id="toggle-sound" type="checkbox" />
              <span class="switch-track" aria-hidden="true"></span>
              <span class="switch-thumb" aria-hidden="true"></span>
            </span>
          </label>

          <label class="settings-row" for="toggle-music">
            <span class="settings-row-left"><span class="settings-row-icon">🎵</span><span class="settings-row-label">Música</span></span>
            <span class="switch-wrap">
              <input id="toggle-music" type="checkbox" />
              <span class="switch-track" aria-hidden="true"></span>
              <span class="switch-thumb" aria-hidden="true"></span>
            </span>
          </label>

          <label class="settings-row" for="toggle-vibration">
            <span class="settings-row-left"><span class="settings-row-icon">📳</span><span class="settings-row-label">Vibração</span></span>
            <span class="switch-wrap">
              <input id="toggle-vibration" type="checkbox" />
              <span class="switch-track" aria-hidden="true"></span>
              <span class="switch-thumb" aria-hidden="true"></span>
            </span>
          </label>
        </div>

        <button class="settings-back-btn" id="settings-menu-btn" type="button">VOLTAR AO MENU</button>
      </article>
    </section>

    <section class="overlay hidden" id="store-overlay" role="dialog" aria-modal="true">
      <article class="shop-sheet">
        <div class="shop-sheet-header">
          <button class="shop-sheet-close" id="store-close" type="button" aria-label="Fechar">←</button>
          <span>LOJA</span>
        </div>

        <div class="shop-sheet-scroll">
          <p class="shop-section-title">Moedas</p>
          <div class="shop-item"><span class="shop-item-icon">🪙</span><span class="shop-item-info"><span class="shop-item-name">500 Moedas</span><span class="shop-item-price">R$ 4,90</span></span><button class="shop-item-btn shop-buy-btn" type="button" data-basic="500" data-premium="0" data-label="500 moedas">Comprar</button></div>
          <div class="shop-item"><span class="shop-item-icon">💰</span><span class="shop-item-info"><span class="shop-item-name">1000 Moedas</span><span class="shop-item-price">R$ 8,90</span></span><button class="shop-item-btn shop-buy-btn" type="button" data-basic="1000" data-premium="0" data-label="1000 moedas">Comprar</button></div>
          <div class="shop-item"><span class="shop-item-icon">💎💰</span><span class="shop-item-info"><span class="shop-item-name">2500 Moedas</span><span class="shop-item-price">R$ 19,90</span></span><button class="shop-item-btn shop-buy-btn" type="button" data-basic="2500" data-premium="0" data-label="2500 moedas">Comprar</button></div>

          <p class="shop-section-title">Diamantes</p>
          <div class="shop-item"><span class="shop-item-icon">💎</span><span class="shop-item-info"><span class="shop-item-name">50 Diamantes</span><span class="shop-item-price">R$ 9,90</span></span><button class="shop-item-btn shop-buy-btn" type="button" data-basic="0" data-premium="50" data-label="50 diamantes">Comprar</button></div>
          <div class="shop-item"><span class="shop-item-icon">💎💎</span><span class="shop-item-info"><span class="shop-item-name">100 Diamantes</span><span class="shop-item-price">R$ 17,90</span></span><button class="shop-item-btn shop-buy-btn" type="button" data-basic="0" data-premium="100" data-label="100 diamantes">Comprar</button></div>
          <div class="shop-item"><span class="shop-item-icon">💎💎💎</span><span class="shop-item-info"><span class="shop-item-name">500 Diamantes</span><span class="shop-item-price">R$ 79,90</span></span><button class="shop-item-btn shop-buy-btn" type="button" data-basic="0" data-premium="500" data-label="500 diamantes">Comprar</button></div>

          <p class="shop-section-title">Pacotes Especiais</p>
          <div class="shop-item"><span class="shop-item-icon">🎁</span><span class="shop-item-info"><span class="shop-item-name">Pacote Iniciante</span><span class="shop-item-price">500 moedas + 20 diamantes</span></span><button class="shop-item-btn shop-buy-btn" type="button" data-basic="500" data-premium="20" data-label="pacote iniciante">Comprar</button></div>
          <div class="shop-item"><span class="shop-item-icon">👑</span><span class="shop-item-info"><span class="shop-item-name">Pacote VIP</span><span class="shop-item-price">2000 moedas + 100 diamantes</span></span><button class="shop-item-btn shop-buy-btn" type="button" data-basic="2000" data-premium="100" data-label="pacote VIP">Comprar</button></div>
        </div>
      </article>
    </section>

    <section class="overlay hidden" id="profile-overlay" role="dialog" aria-modal="true">
      <article class="profile-sheet">
        <div class="profile-sheet-header">
          <button id="profile-close" class="profile-sheet-close" type="button" aria-label="Fechar">←</button>
          <span>PERFIL</span>
        </div>

        <div class="profile-sheet-body">
          <div class="profile-main-row">
            <div id="profile-avatar" class="profile-avatar">🙂</div>
            <div class="profile-main-info">
              <p class="profile-id-label">ID da conta</p>
              <p id="profile-account-id" class="profile-account-id">MG-000000</p>
            </div>
            <button id="profile-random-avatar" class="profile-avatar-random" type="button">Trocar</button>
          </div>

          <div class="profile-name-row">
            <label for="profile-name-input">Nome do jogador</label>
            <div class="profile-name-controls">
              <input id="profile-name-input" class="profile-name-input" type="text" maxlength="22" />
              <button id="profile-save-name" class="profile-save-name" type="button">Salvar</button>
            </div>
          </div>

          <div class="profile-sync-box">
            <p id="profile-sync-status" class="profile-sync-status">Sync automático a cada 2 minutos.</p>
            <button id="profile-sync-now" class="profile-save-name" type="button">Sincronizar agora</button>
          </div>
        </div>
      </article>
    </section>

    <section class="overlay hidden" id="avatar-overlay" role="dialog" aria-modal="true">
      <article class="avatar-sheet">
        <div class="avatar-sheet-header">
          <button id="avatar-close" class="avatar-sheet-close" type="button" aria-label="Fechar">←</button>
          <span>FOTO DE PERFIL</span>
        </div>
        <div id="avatar-grid" class="avatar-grid"></div>
      </article>
    </section>

    <section class="overlay hidden" id="leaderboard-overlay" role="dialog" aria-modal="true">
      <article class="leaderboard-sheet">
        <div class="leaderboard-sheet-header">
          <button id="leaderboard-close" class="leaderboard-sheet-close" type="button" aria-label="Fechar">←</button>
          <span>RANKING</span>
        </div>
        <div class="leaderboard-sheet-body">
          <p class="leaderboard-title">Top 10</p>
          <ul id="leaderboard-list" class="leaderboard-list"></ul>
        </div>
      </article>
    </section>

    <section class="overlay hidden" id="friends-overlay" role="dialog" aria-modal="true">
      <article class="leaderboard-sheet">
        <div class="leaderboard-sheet-header">
          <button id="friends-close" class="leaderboard-sheet-close" type="button" aria-label="Fechar">←</button>
          <span>AMIGOS</span>
        </div>
        <div class="leaderboard-sheet-body">
          <p class="leaderboard-title">Adicionar por ID</p>
          <div class="profile-name-controls">
            <input id="friends-id-input" class="profile-name-input" type="text" maxlength="16" placeholder="Ex.: MG-12345" />
            <button id="friends-add-btn" class="profile-save-name" type="button">Adicionar</button>
          </div>
          <p class="leaderboard-title" style="margin-top:12px;">Pedidos para você</p>
          <ul id="friends-requests-list" class="leaderboard-list"></ul>
          <p class="leaderboard-title" style="margin-top:12px;">Meus amigos</p>
          <ul id="friends-list" class="leaderboard-list"></ul>
        </div>
      </article>
    </section>
  </main>
`;

const splashScreen = document.querySelector("#splash-screen");
const splashProgress = document.querySelector("#splash-progress");
const menuScreen = document.querySelector("#menu-screen");
const phaseSelectScreen = document.querySelector("#phase-select-screen");
const menuStoreBtn = document.querySelector("#menu-store-btn");
const menuLeaderboardBtn = document.querySelector("#menu-leaderboard-btn");
const menuFriendsBtn = document.querySelector("#menu-friends-btn");
const menuProfileBtn = document.querySelector("#menu-profile-btn");
const menuProfileAvatar = document.querySelector("#menu-profile-avatar");
const menuSettingsBtn = document.querySelector("#menu-settings-btn");
const menuPlayBtn = document.querySelector("#menu-play-btn");
const menuModesBtn = document.querySelector("#menu-modes-btn");
const menuExitBtn = document.querySelector("#menu-exit-btn");
const phaseBackBtn = document.querySelector("#phase-back-btn");
const menuPhase = document.querySelector("#menu-phase");
const phasePicker = document.querySelector("#phase-picker");
const startBtn = document.querySelector("#start-btn");
const phaseLoader = document.querySelector("#phase-loader");
const phaseLoaderText = document.querySelector("#phase-loader-text");
const phaseLoaderProgress = document.querySelector("#phase-loader-progress");
const gamePanel = document.querySelector("#game-panel");
const board = document.querySelector("#board");
const wheel = document.querySelector("#wheel");
const connectors = document.querySelector("#connectors");
const currentWrap = document.querySelector("#current-wrap");
const currentWordEl = document.querySelector("#current-word");
const basicCoinsEl = document.querySelector("#basic-coins");
const premiumCoinsEl = document.querySelector("#premium-coins");
const settingsBtn = document.querySelector("#settings-btn");
const storeBtn = document.querySelector("#store-btn");
const hintBtn = document.querySelector("#hint-btn");
const hintCount = document.querySelector("#hint-count");
const messageEl = document.querySelector("#message");

const winOverlay = document.querySelector("#win-overlay");
const winText = document.querySelector("#win-text");
const winClose = document.querySelector("#win-close");
const winNext = document.querySelector("#win-next");

const hintOverlay = document.querySelector("#hint-overlay");
const hintClose = document.querySelector("#hint-close");
const watchAdBtn = document.querySelector("#watch-ad-btn");
const buyHintBasicBtn = document.querySelector("#buy-hint-basic-btn");
const buyHintsPremiumBtn = document.querySelector("#buy-hints-premium-btn");

const settingsOverlay = document.querySelector("#settings-overlay");
const settingsClose = document.querySelector("#settings-close");
const toggleSoundInput = document.querySelector("#toggle-sound");
const toggleMusicInput = document.querySelector("#toggle-music");
const toggleVibrationInput = document.querySelector("#toggle-vibration");
const settingsMenuBtn = document.querySelector("#settings-menu-btn");

const storeOverlay = document.querySelector("#store-overlay");
const storeClose = document.querySelector("#store-close");
const shopBuyButtons = Array.from(document.querySelectorAll(".shop-buy-btn"));

const profileOverlay = document.querySelector("#profile-overlay");
const profileClose = document.querySelector("#profile-close");
const profileAvatar = document.querySelector("#profile-avatar");
const profileAccountId = document.querySelector("#profile-account-id");
const profileNameInput = document.querySelector("#profile-name-input");
const profileSaveName = document.querySelector("#profile-save-name");
const profileRandomAvatar = document.querySelector("#profile-random-avatar");
const profileSyncStatus = document.querySelector("#profile-sync-status");
const profileSyncNow = document.querySelector("#profile-sync-now");

const avatarOverlay = document.querySelector("#avatar-overlay");
const avatarClose = document.querySelector("#avatar-close");
const avatarGrid = document.querySelector("#avatar-grid");

const leaderboardOverlay = document.querySelector("#leaderboard-overlay");
const leaderboardClose = document.querySelector("#leaderboard-close");
const leaderboardList = document.querySelector("#leaderboard-list");

const friendsOverlay = document.querySelector("#friends-overlay");
const friendsClose = document.querySelector("#friends-close");
const friendsIdInput = document.querySelector("#friends-id-input");
const friendsAddBtn = document.querySelector("#friends-add-btn");
const friendsRequestsList = document.querySelector("#friends-requests-list");
const friendsList = document.querySelector("#friends-list");

let isStartingPhase = false;
let audioContext = null;
let syncIntervalHandle = null;
const backgroundMusic = new Audio(bgThemeMusic);
backgroundMusic.loop = true;
backgroundMusic.preload = "auto";
backgroundMusic.volume = 0.5;

const messageObserver = new MutationObserver(() => {
  const text = String(messageEl.textContent || "").trim();
  if (!text.startsWith("BÔNUS")) {
    messageEl.classList.remove("bonus");
  }
});

messageObserver.observe(messageEl, {
  childList: true,
  characterData: true,
  subtree: true,
});

async function configureNativeDisplay() {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setOverlaysWebView({ overlay: true });
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.hide();
  } catch (error) {
    console.warn("StatusBar plugin indisponivel:", error);
  }
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function generateAccountId() {
  const part = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `MG-${part}`;
}

function generateRandomName() {
  return `${randomFrom(PROFILE_NAME_PREFIXES)}${randomFrom(PROFILE_NAME_SUFFIXES)}${Math.floor(10 + (Math.random() * 90))}`;
}

function createRandomProfile() {
  return {
    id: generateAccountId(),
    name: generateRandomName(),
    avatar: randomFrom(PROFILE_AVATARS),
    avatarColor: randomFrom(PROFILE_COLORS),
  };
}

function ensureProfileState() {
  if (!state.profile) {
    state.profile = createRandomProfile();
  }
}

async function apiRequest(path, { method = "GET", body } = {}) {
  const endpoint = `${API_BASE_URL.replace(/\/+$/, "")}${path}`;
  const response = await fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.error || `Falha na API (${response.status}).`);
  }

  return payload;
}

function applyServerUser(serverUser) {
  if (!serverUser || typeof serverUser !== "object") {
    return;
  }

  ensureProfileState();
  state.profile.id = String(serverUser.id || state.profile.id || generateAccountId()).slice(0, 16);
  state.profile.name = String(serverUser.name || state.profile.name || generateRandomName()).slice(0, 22);
  state.profile.avatar = PROFILE_AVATARS.includes(serverUser.avatar) ? serverUser.avatar : state.profile.avatar;
  state.profile.avatarColor = PROFILE_COLORS.includes(serverUser.avatarColor) ? serverUser.avatarColor : state.profile.avatarColor;

  const nextPhase = Math.max(1, Math.min(TOTAL_PHASES, Number.parseInt(String(serverUser.phase), 10) || state.phase));
  const parsedPoints = Number.parseInt(String(serverUser.points), 10);
  state.phase = nextPhase;
  // Usa Math.max para nunca deixar resposta atrasada de sync sobrescrever pontos ja acumulados localmente.
  state.points = Number.isFinite(parsedPoints) ? Math.max(state.points, parsedPoints) : state.points;
  menuPhase.textContent = `Fase atual: ${state.phase}/${TOTAL_PHASES}`;
  phasePicker.value = String(state.phase);
}

function setSyncStatus(text, isError = false) {
  profileSyncStatus.textContent = text;
  profileSyncStatus.style.color = isError ? "#b0271d" : "#3f6686";
}

async function refreshLeaderboard({ silent = false } = {}) {
  try {
    const payload = await apiRequest("/api/leaderboard");
    state.onlineLeaderboard = Array.isArray(payload?.ranking) ? payload.ranking : [];
    if (!silent && state.onlineLeaderboard.length > 0) {
      messageEl.textContent = "Ranking online atualizado.";
    }
  } catch (error) {
    if (!silent) {
      messageEl.textContent = String(error?.message || "Falha ao atualizar ranking online.");
    }

    setSyncStatus("Sem conexão com o ranking online.", true);
  }
}

async function syncCurrentPhaseToServer({ silent = true } = {}) {
  try {
    const payload = await apiRequest("/api/public/sync", {
      method: "POST",
      body: {
        id: state.profile.id,
        name: state.profile.name,
        avatar: state.profile.avatar,
        avatarColor: state.profile.avatarColor,
        phase: state.phase,
        points: state.points,
      },
    });

    applyServerUser(payload?.player);
    saveProgress();
    updateHud();
    const hhmm = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    setSyncStatus(`Última sync: ${hhmm}`);
    await refreshLeaderboard({ silent: true });
    // Repinta o overlay de ranking se estiver aberto, agora com dados atualizados do servidor.
    if (!leaderboardOverlay.classList.contains("hidden")) {
      renderLeaderboardOverlay();
    }
  } catch (error) {
    setSyncStatus("Sem conexão com o ranking online.", true);
    if (!silent) {
      messageEl.textContent = String(error?.message || "Falha ao sincronizar fase no servidor.");
    }
  }
}

async function saveProfileOnServer() {
  await syncCurrentPhaseToServer({ silent: true });
}

async function refreshFriendsList({ silent = false } = {}) {
  try {
    const payload = await apiRequest(`/api/public/friends/${encodeURIComponent(state.profile.id)}`);
    state.friendsLeaderboard = Array.isArray(payload?.friends) ? payload.friends : [];
    state.friendRequests = Array.isArray(payload?.pendingRequests) ? payload.pendingRequests : [];
    if (!silent && friendsOverlay && !friendsOverlay.classList.contains("hidden")) {
      renderFriendsOverlay();
    }
  } catch (error) {
    if (!silent) {
      messageEl.textContent = String(error?.message || "Falha ao atualizar lista de amigos.");
    }
  }
}

async function addFriendById(friendId) {
  const cleanFriendId = String(friendId || "").trim().slice(0, 16);
  if (!cleanFriendId) {
    messageEl.textContent = "Digite um ID de amigo para adicionar.";
    return;
  }

  await apiRequest("/api/public/friends/add", {
    method: "POST",
    body: {
      id: state.profile.id,
      friendId: cleanFriendId,
    },
  });

  await refreshFriendsList({ silent: true });
  renderFriendsOverlay();
  messageEl.textContent = `Pedido de amizade enviado para ${cleanFriendId}.`;
}

async function respondFriendRequest(requesterId, accept) {
  const cleanRequesterId = String(requesterId || "").trim().slice(0, 16);
  if (!cleanRequesterId) {
    return;
  }

  await apiRequest("/api/public/friends/respond", {
    method: "POST",
    body: {
      id: state.profile.id,
      requesterId: cleanRequesterId,
      accept: !!accept,
    },
  });

  await refreshFriendsList({ silent: true });
  renderFriendsOverlay();
  messageEl.textContent = accept
    ? `${cleanRequesterId} agora é seu amigo.`
    : `Pedido de ${cleanRequesterId} recusado.`;
}

function syncBackgroundMusicPlayback() {
  const shouldPlay = state.musicEnabled && (
    !menuScreen.classList.contains("hidden")
    || !phaseSelectScreen.classList.contains("hidden")
    || !gamePanel.classList.contains("hidden")
  );

  if (!shouldPlay) {
    backgroundMusic.pause();
    return;
  }

  backgroundMusic.play().catch(() => {
    // Ignora bloqueios de autoplay; a proxima interacao do usuario destrava.
  });
}

function isEligibleBonusWord(normalizedWord, displayWord) {
  if (BONUS_EXCLUDED_WORDS.has(normalizedWord)) {
    return false;
  }

  // Regra mais restrita: bonus so para extras com 5+ letras para reduzir falsos positivos.
  return normalizedWord.length >= 5 && /\p{L}+/u.test(displayWord);
}

function getAudioContext() {
  if (audioContext) {
    return audioContext;
  }

  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) {
    return null;
  }

  audioContext = new AudioContextCtor();
  return audioContext;
}

function playTone({ frequency, duration = 0.08, type = "sine", gain = 0.035, delay = 0 } = {}) {
  if (!state.soundEnabled) {
    return;
  }

  const ctx = getAudioContext();
  if (!ctx || !Number.isFinite(frequency)) {
    return;
  }

  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {
      // Ignore resume errors on restricted browsers.
    });
  }

  const startAt = ctx.currentTime + Math.max(0, delay);
  const stopAt = startAt + Math.max(0.02, duration);
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startAt);

  amp.gain.setValueAtTime(0.0001, startAt);
  amp.gain.exponentialRampToValueAtTime(gain, startAt + 0.015);
  amp.gain.exponentialRampToValueAtTime(0.0001, stopAt);

  osc.connect(amp);
  amp.connect(ctx.destination);

  osc.start(startAt);
  osc.stop(stopAt + 0.01);
}

function playSfx(kind) {
  if (!state.soundEnabled) {
    return;
  }

  switch (kind) {
    case "select":
      playTone({ frequency: 520, duration: 0.05, type: "triangle", gain: 0.02 });
      break;
    case "success":
      playTone({ frequency: 520, duration: 0.07, type: "triangle", gain: 0.03, delay: 0 });
      playTone({ frequency: 700, duration: 0.09, type: "triangle", gain: 0.03, delay: 0.06 });
      break;
    case "bonus":
      playTone({ frequency: 640, duration: 0.08, type: "sine", gain: 0.04, delay: 0 });
      playTone({ frequency: 860, duration: 0.09, type: "sine", gain: 0.04, delay: 0.07 });
      break;
    case "hint":
      playTone({ frequency: 760, duration: 0.07, type: "triangle", gain: 0.03 });
      break;
    case "win":
      playTone({ frequency: 660, duration: 0.1, type: "sine", gain: 0.04, delay: 0 });
      playTone({ frequency: 880, duration: 0.12, type: "sine", gain: 0.045, delay: 0.09 });
      playTone({ frequency: 1040, duration: 0.16, type: "sine", gain: 0.045, delay: 0.2 });
      break;
    default:
      playTone({ frequency: 280, duration: 0.08, type: "sawtooth", gain: 0.018 });
      break;
  }
}

function parseProgress(raw) {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const phaseSessions = raw.phaseSessions && typeof raw.phaseSessions === "object"
    ? Object.fromEntries(
      Object.entries(raw.phaseSessions).map(([phase, session]) => {
        const safeSession = session && typeof session === "object" ? session : {};
        const foundWords = Array.isArray(safeSession.foundWords)
          ? safeSession.foundWords.filter((value) => typeof value === "string")
          : [];
        const hintedCells = Array.isArray(safeSession.hintedCells)
          ? safeSession.hintedCells
            .filter((entry) => Array.isArray(entry) && entry.length === 2)
            .map((entry) => [String(entry[0]), String(entry[1])])
          : [];
        const bonusWords = Array.isArray(safeSession.bonusWords)
          ? safeSession.bonusWords.filter((value) => typeof value === "string")
          : [];

        return [phase, { foundWords, hintedCells, bonusWords }];
      }),
    )
    : {};

  return {
    phase: Math.max(1, Math.min(TOTAL_PHASES, Number.parseInt(String(raw.phase), 10) || 1)),
    points: Math.max(0, Number.parseInt(String(raw.points), 10) || 0),
    hints: Math.max(0, Number.parseInt(String(raw.hints), 10) || 5),
    basicCoins: Math.max(0, Number.parseInt(String(raw.basicCoins), 10) || 0),
    premiumCoins: Math.max(0, Number.parseInt(String(raw.premiumCoins), 10) || 0),
    soundEnabled: typeof raw.soundEnabled === "boolean" ? raw.soundEnabled : true,
    musicEnabled: typeof raw.musicEnabled === "boolean" ? raw.musicEnabled : true,
    vibrationEnabled: typeof raw.vibrationEnabled === "boolean" ? raw.vibrationEnabled : false,
    profile: raw.profile && typeof raw.profile === "object"
      ? {
        id: String(raw.profile.id || "").slice(0, 16) || generateAccountId(),
        name: String(raw.profile.name || "").slice(0, 22) || generateRandomName(),
        avatar: PROFILE_AVATARS.includes(raw.profile.avatar) ? raw.profile.avatar : randomFrom(PROFILE_AVATARS),
        avatarColor: PROFILE_COLORS.includes(raw.profile.avatarColor) ? raw.profile.avatarColor : randomFrom(PROFILE_COLORS),
      }
      : null,
    phaseSessions,
  };
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) {
      return;
    }

    const parsed = parseProgress(JSON.parse(raw));
    if (!parsed) {
      return;
    }

    state.phase = parsed.phase;
    state.points = parsed.points;
    state.hints = parsed.hints;
    state.basicCoins = parsed.basicCoins;
    state.premiumCoins = parsed.premiumCoins;
    state.soundEnabled = parsed.soundEnabled;
    state.musicEnabled = parsed.musicEnabled;
    state.vibrationEnabled = parsed.vibrationEnabled;
    state.profile = parsed.profile;
    state.phaseSessions = parsed.phaseSessions;
  } catch (error) {
    console.warn("Falha ao carregar progresso:", error);
  }
}

function saveProgress() {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
      phase: state.phase,
      points: state.points,
      hints: state.hints,
      basicCoins: state.basicCoins,
      premiumCoins: state.premiumCoins,
      soundEnabled: state.soundEnabled,
      musicEnabled: state.musicEnabled,
      vibrationEnabled: state.vibrationEnabled,
      profile: state.profile,
      phaseSessions: state.phaseSessions,
    }));
  } catch (error) {
    console.warn("Falha ao salvar progresso:", error);
  }
}

function saveCurrentPhaseSession() {
  if (!state.currentPuzzle) {
    return;
  }

  const key = String(state.phase);
  state.phaseSessions[key] = {
    foundWords: Array.from(state.foundWords),
    hintedCells: Array.from(state.hintedCells.entries()),
    bonusWords: Array.from(state.bonusWords),
  };

  saveProgress();
}

function restorePhaseSession() {
  const session = state.phaseSessions[String(state.phase)];

  if (!session || !state.currentPuzzle) {
    return;
  }

  const validWords = new Set(state.currentPuzzle.words.map((word) => word.text));
  state.foundWords = new Set(session.foundWords.filter((word) => validWords.has(word)));

  const restoredHints = new Map();
  session.hintedCells.forEach(([key, letter]) => {
    if (state.currentPuzzle.cellMap.has(key) && typeof letter === "string") {
      restoredHints.set(key, letter);
    }
  });
  state.hintedCells = restoredHints;
  state.bonusWords = new Set(
    (session.bonusWords || [])
      .map((word) => toUpperAscii(word))
      .filter((word) => {
        const displayWord = BONUS_DICTIONARY_MAP.get(word) || word;
        return BONUS_DICTIONARY_WORDS.has(word) && isEligibleBonusWord(word, displayWord);
      }),
  );
}

function applyPhaseCompletionRewards() {
  state.basicCoins += PHASE_COMPLETE_COINS;

  saveProgress();
  updateHud();

  return {
    coinsAwarded: PHASE_COMPLETE_COINS,
  };
}

function showMenu() {
  if (state.currentPuzzle) {
    saveCurrentPhaseSession();
  }

  document.body.classList.remove("is-loader-active");
  document.body.classList.add("is-menu-active");
  document.documentElement.style.setProperty("--art-game", `url(${MENU_ART})`);
  phaseLoader.classList.add("hidden");
  gamePanel.classList.add("hidden");
  phaseSelectScreen.classList.add("hidden");
  menuScreen.classList.remove("hidden");
  menuPhase.textContent = `Fase atual: ${state.phase}/${TOTAL_PHASES}`;
  phasePicker.value = String(state.phase);
  syncBackgroundMusicPlayback();
}

function showPhaseSelectMenu() {
  document.body.classList.remove("is-loader-active");
  document.body.classList.add("is-menu-active");
  document.documentElement.style.setProperty("--art-game", `url(${MENU_ART})`);
  phaseLoader.classList.add("hidden");
  gamePanel.classList.add("hidden");
  menuScreen.classList.add("hidden");
  phaseSelectScreen.classList.remove("hidden");
  menuPhase.textContent = `Fase atual: ${state.phase}/${TOTAL_PHASES}`;
  phasePicker.value = String(state.phase);
  syncBackgroundMusicPlayback();
}

function clampPhaseValue(rawValue) {
  const parsed = Number.parseInt(String(rawValue), 10);

  if (Number.isNaN(parsed)) {
    return state.phase;
  }

  return Math.max(1, Math.min(TOTAL_PHASES, parsed));
}

function applySelectedPhase() {
  const selected = clampPhaseValue(phasePicker.value);
  state.phase = selected;
  phasePicker.value = String(selected);
  menuPhase.textContent = `Fase atual: ${state.phase}/${TOTAL_PHASES}`;
  saveProgress();
}

function showGame() {
  document.body.classList.remove("is-loader-active");
  document.body.classList.remove("is-menu-active");
  menuScreen.classList.add("hidden");
  phaseSelectScreen.classList.add("hidden");
  phaseLoader.classList.add("hidden");
  gamePanel.classList.remove("hidden");
  syncBackgroundMusicPlayback();
}

function showPhaseLoader() {
  document.body.classList.add("is-loader-active");
  document.body.classList.remove("is-menu-active");
  menuScreen.classList.add("hidden");
  phaseSelectScreen.classList.add("hidden");
  gamePanel.classList.add("hidden");
  phaseLoader.classList.remove("hidden");
  phaseLoaderText.textContent = `Carregando fase ${state.phase}...`;
  if (phaseLoaderProgress) {
    phaseLoaderProgress.style.width = "0%";
  }
  syncBackgroundMusicPlayback();
}

function setPhaseLoaderProgress(value) {
  if (!phaseLoaderProgress) {
    return;
  }

  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  phaseLoaderProgress.style.width = `${clamped}%`;
}

// Normaliza texto para comparacao interna sem acentos.
function toUpperAscii(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

// Mantem a forma visual da palavra (com acento) para exibir no tabuleiro e mensagens.
function toDisplayWord(text) {
  return String(text || "").toLocaleUpperCase("pt-BR");
}

function canSpell(word, letters) {
  const pool = new Map();
  letters.forEach((letter) => {
    pool.set(letter, (pool.get(letter) || 0) + 1);
  });

  for (const char of word) {
    const remaining = pool.get(char) || 0;
    if (remaining <= 0) {
      return false;
    }
    pool.set(char, remaining - 1);
  }

  return true;
}

function sharesLetter(a, b) {
  const setB = new Set(b.split(""));
  return a.split("").some((char) => setB.has(char));
}

function mulberry32(seed) {
  return function random() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithRng(items, rng) {
  const cloned = items.slice();

  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }

  return cloned;
}

function getPhaseProfile(phase) {
  const maxWords = phase > 1000 ? 7 : 6;
  const wheelLetters = getWheelLettersByPhase(phase);
  const wheelWordRange = getWordRangeByWheelSize(wheelLetters);
  const wordsByProgress = phase > 1000 ? { minWords: 5, maxWords } : { minWords: 4, maxWords: 6 };
  const minWords = Math.min(wordsByProgress.minWords, wheelWordRange.maxWords);
  const phaseMaxWords = Math.min(wordsByProgress.maxWords, wheelWordRange.maxWords);
  const maxWordsByWheel = Math.max(minWords, phaseMaxWords);

  let weights;

  if (phase <= 15) {
    weights = { 3: 65, 4: 35, 5: 0, 6: 0 };
  } else if (phase <= 30) {
    weights = { 3: 50, 4: 30, 5: 20, 6: 0 };
  } else if (phase <= 60) {
    weights = { 3: 20, 4: 40, 5: 30, 6: 10 };
  } else if (phase <= 100) {
    weights = { 3: 10, 4: 40, 5: 40, 6: 10 };
  } else if (phase <= 199) {
    weights = { 3: 10, 4: 30, 5: 40, 6: 20 };
  } else if (phase <= 300) {
    weights = { 3: 10, 4: 30, 5: 50, 6: 10 };
  } else if (phase <= 400) {
    weights = { 3: 10, 4: 20, 5: 50, 6: 20 };
  } else if (phase <= 499) {
    weights = { 3: 10, 4: 20, 5: 40, 6: 30 };
  } else if (phase <= 1000) {
    weights = { 3: 10, 4: 30, 5: 30, 6: 30 };
  } else {
    weights = { 3: 0, 4: 20, 5: 40, 6: 40 };
  }

  return {
    minWords,
    maxWords: maxWordsByWheel,
    minWheelLetters: wheelLetters,
    maxWheelLetters: wheelLetters,
    weights,
  };
}

function getWheelLettersByPhase(phase) {
  if (phase >= 60) {
    return 8;
  }

  if (phase >= 35) {
    return 7;
  }

  if (phase >= 25) {
    return 6;
  }

  if (phase >= 16) {
    return 5;
  }

  return 4;
}

function getWordRangeByWheelSize(wheelLetters) {
  if (wheelLetters <= 4) {
    return { minWords: 2, maxWords: 3 };
  }

  if (wheelLetters === 5) {
    return { minWords: 3, maxWords: 4 };
  }

  if (wheelLetters === 6) {
    return { minWords: 4, maxWords: 5 };
  }

  if (wheelLetters === 7) {
    return { minWords: 4, maxWords: 6 };
  }

  return { minWords: 5, maxWords: 7 };
}

function getSignatureWindowByWheelSize(wheelLetters) {
  if (wheelLetters <= 4) {
    return 10;
  }

  if (wheelLetters === 5) {
    return 14;
  }

  if (wheelLetters === 6) {
    return 18;
  }

  if (wheelLetters === 7) {
    return 22;
  }

  return 28;
}

function getWordCooldownByWheelSize(wheelLetters) {
  if (wheelLetters <= 4) {
    return 10;
  }

  if (wheelLetters === 5) {
    return 8;
  }

  if (wheelLetters === 6) {
    return 7;
  }

  if (wheelLetters === 7) {
    return 6;
  }

  return 5;
}

function normalizeWeightsByWheelSize(weights, wheelLetters) {
  const normalized = { ...weights };

  [3, 4, 5, 6].forEach((len) => {
    if (len > wheelLetters) {
      normalized[len] = 0;
    }
  });

  if (Object.values(normalized).some((value) => value > 0)) {
    return normalized;
  }

  if (wheelLetters <= 3) {
    normalized[3] = 100;
    return normalized;
  }

  normalized[3] = 60;
  normalized[4] = 40;
  return normalized;
}

function randomIntInclusive(min, max, rng) {
  return min + Math.floor(rng() * (max - min + 1));
}

function buildWordCatalog() {
  const catalog = [];
  const byNormalized = new Map();
  const byLength = new Map([
    [3, []],
    [4, []],
    [5, []],
    [6, []],
  ]);

  WORD_TIERS.forEach((tierWords) => {
    tierWords.forEach((rawWord) => {
      const normalized = toUpperAscii(rawWord);
      const len = normalized.length;

      if (len < 3 || len > 6) {
        return;
      }

      if (byNormalized.has(normalized)) {
        return;
      }

      const entry = {
        text: normalized,
        displayText: toDisplayWord(rawWord),
        len,
      };

      byNormalized.set(normalized, entry);
      catalog.push(entry);
      byLength.get(len).push(entry);
    });
  });

  return { catalog, byNormalized, byLength };
}

function buildLengthPlan(totalWords, weights, rng) {
  const activeLengths = [3, 4, 5, 6].filter((len) => (weights[len] || 0) > 0);
  const weightSum = activeLengths.reduce((sum, len) => sum + weights[len], 0);
  const counters = new Map();
  let used = 0;

  activeLengths.forEach((len) => {
    const exact = (weights[len] / weightSum) * totalWords;
    const floorValue = Math.floor(exact);
    counters.set(len, { count: floorValue, frac: exact - floorValue });
    used += floorValue;
  });

  let remaining = totalWords - used;
  const priority = activeLengths
    .slice()
    .sort((a, b) => {
      const fracDiff = (counters.get(b)?.frac || 0) - (counters.get(a)?.frac || 0);
      if (Math.abs(fracDiff) > 0.0001) {
        return fracDiff;
      }
      return rng() < 0.5 ? -1 : 1;
    });

  let index = 0;
  while (remaining > 0) {
    const len = priority[index % priority.length];
    counters.get(len).count += 1;
    remaining -= 1;
    index += 1;
  }

  const plan = [];
  counters.forEach((value, len) => {
    for (let i = 0; i < value.count; i += 1) {
      plan.push(len);
    }
  });

  return shuffleWithRng(plan, rng);
}

function requiredWheelSize(words) {
  const maxByLetter = new Map();

  words.forEach((word) => {
    const local = new Map();

    word.split("").forEach((char) => {
      local.set(char, (local.get(char) || 0) + 1);
    });

    local.forEach((count, letter) => {
      maxByLetter.set(letter, Math.max(maxByLetter.get(letter) || 0, count));
    });
  });

  let total = 0;
  maxByLetter.forEach((count) => {
    total += count;
  });

  return total;
}

function buildWheelLetters(words, minLetters, maxLetters, rng) {
  const maxByLetter = new Map();

  words.forEach((word) => {
    const local = new Map();

    word.split("").forEach((char) => {
      local.set(char, (local.get(char) || 0) + 1);
    });

    local.forEach((count, letter) => {
      maxByLetter.set(letter, Math.max(maxByLetter.get(letter) || 0, count));
    });
  });

  const letters = [];
  maxByLetter.forEach((count, letter) => {
    for (let i = 0; i < count; i += 1) {
      letters.push(letter);
    }
  });

  if (letters.length > maxLetters) {
    return null;
  }

  const fillerOrder = ["A", "E", "O", "I", "U", "R", "S", "M", "N", "L", "T", "C"];
  const used = new Set(letters);

  for (const candidate of fillerOrder) {
    if (letters.length >= minLetters) {
      break;
    }

    if (!used.has(candidate)) {
      letters.push(candidate);
      used.add(candidate);
    }
  }

  return shuffleWithRng(letters, rng);
}

function wordAllowedInWindow(word, windowCounts) {
  return (windowCounts.get(word) || 0) < 3;
}

function pushPhaseToWindow(words, queue, windowCounts) {
  queue.push(words);
  words.forEach((word) => {
    windowCounts.set(word, (windowCounts.get(word) || 0) + 1);
  });

  while (queue.length > 14) {
    const removed = queue.shift();
    removed.forEach((word) => {
      const next = (windowCounts.get(word) || 0) - 1;
      if (next <= 0) {
        windowCounts.delete(word);
      } else {
        windowCounts.set(word, next);
      }
    });
  }
}

function getWordCells(placedWord) {
  const cells = [];

  for (let i = 0; i < placedWord.text.length; i += 1) {
    const x = placedWord.startX + (placedWord.orientation === "h" ? i : 0);
    const y = placedWord.startY + (placedWord.orientation === "v" ? i : 0);
    cells.push([x, y]);
  }

  return cells;
}

// Regras de cruzadinha: palavras so podem cruzar por letra igual, sem encostar em paralelo.
function hasPlacedCell(cellMap, x, y) {
  return cellMap.has(`${x}:${y}`);
}

function checkPlacement(text, displayText, startX, startY, orientation, cellMap, displayCellMap) {
  const beforeX = startX + (orientation === "h" ? -1 : 0);
  const beforeY = startY + (orientation === "v" ? -1 : 0);
  const afterX = startX + (orientation === "h" ? text.length : 0);
  const afterY = startY + (orientation === "v" ? text.length : 0);

  // Avoid words touching by head/tail without sharing a letter.
  if (hasPlacedCell(cellMap, beforeX, beforeY) || hasPlacedCell(cellMap, afterX, afterY)) {
    return 0;
  }

  let intersections = 0;

  for (let i = 0; i < text.length; i += 1) {
    const x = startX + (orientation === "h" ? i : 0);
    const y = startY + (orientation === "v" ? i : 0);
    const key = `${x}:${y}`;
    const letter = text[i];
    const displayLetter = displayText[i] || letter;
    const existing = cellMap.get(key);
    const existingDisplay = displayCellMap.get(key);

    if (existing && existing !== letter) {
      return 0;
    }

    if (existing === letter) {
      // Regra estrita de acento no cruzamento: letra visual tambem precisa ser igual.
      if (existingDisplay && existingDisplay !== displayLetter) {
        return 0;
      }

      intersections += 1;
      continue;
    }

    if (orientation === "h") {
      if (hasPlacedCell(cellMap, x, y - 1) || hasPlacedCell(cellMap, x, y + 1)) {
        return 0;
      }
    } else if (hasPlacedCell(cellMap, x - 1, y) || hasPlacedCell(cellMap, x + 1, y)) {
      return 0;
    }
  }

  return intersections;
}

function findPlacement(wordEntry, placedWords, cellMap, displayCellMap) {
  let bestPlacement = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const base of placedWords) {
    const baseCells = getWordCells(base);
    const orientation = base.orientation === "h" ? "v" : "h";

    for (let i = 0; i < wordEntry.text.length; i += 1) {
      for (let j = 0; j < base.text.length; j += 1) {
        if (wordEntry.text[i] !== base.text[j]) {
          continue;
        }

        const [crossX, crossY] = baseCells[j];
        const startX = orientation === "h" ? crossX - i : crossX;
        const startY = orientation === "v" ? crossY - i : crossY;
        const intersections = checkPlacement(
          wordEntry.text,
          wordEntry.displayText || wordEntry.text,
          startX,
          startY,
          orientation,
          cellMap,
          displayCellMap,
        );

        if (intersections <= 0) {
          continue;
        }

        const compactnessPenalty = Math.abs(startX) + Math.abs(startY);
        const score = intersections * 100 - compactnessPenalty;

        if (score > bestScore) {
          bestScore = score;
          bestPlacement = {
            text: wordEntry.text,
            displayText: wordEntry.displayText || wordEntry.text,
            startX,
            startY,
            orientation,
          };
        }
      }
    }
  }

  return bestPlacement;
}

// Normaliza coordenadas para caber no grid visivel e monta mapa final de celulas.
function normalizePlacedWords(placedWords) {
  const allCells = placedWords.flatMap((placedWord) => getWordCells(placedWord));
  const minX = Math.min(...allCells.map((cell) => cell[0]));
  const maxX = Math.max(...allCells.map((cell) => cell[0]));
  const minY = Math.min(...allCells.map((cell) => cell[1]));
  const maxY = Math.max(...allCells.map((cell) => cell[1]));

  const words = placedWords.map((placedWord) => {
    const cells = getWordCells(placedWord).map((cell) => [cell[0] - minX, cell[1] - minY]);
    return {
      text: placedWord.text,
      displayText: placedWord.displayText || placedWord.text,
      cells,
    };
  });

  const cellMap = new Map();
  words.forEach((word) => {
    word.cells.forEach((cell, idx) => {
      cellMap.set(`${cell[0]}:${cell[1]}`, word.text[idx]);
    });
  });

  return {
    words,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    cellMap,
  };
}

function buildConnectedLayout(candidateWords, targetCount) {
  const sorted = candidateWords.slice().sort((a, b) => b.text.length - a.text.length);
  let best = [];

  for (let anchorIndex = 0; anchorIndex < Math.min(sorted.length, 3); anchorIndex += 1) {
    const anchor = sorted[anchorIndex];
    const placedWords = [{
      text: anchor.text,
      displayText: anchor.displayText || anchor.text,
      startX: 0,
      startY: 0,
      orientation: "h",
    }];
    const cellMap = new Map();
    const displayCellMap = new Map();

    anchor.text.split("").forEach((letter, index) => {
      cellMap.set(`${index}:0`, letter);
      displayCellMap.set(`${index}:0`, (anchor.displayText || anchor.text)[index] || letter);
    });

    for (const wordEntry of sorted) {
      if (wordEntry.text === anchor.text) {
        continue;
      }

      const placement = findPlacement(wordEntry, placedWords, cellMap, displayCellMap);
      if (!placement) {
        continue;
      }

      placedWords.push(placement);
      getWordCells(placement).forEach((cell, idx) => {
        const key = `${cell[0]}:${cell[1]}`;
        cellMap.set(key, placement.text[idx]);
        displayCellMap.set(key, (placement.displayText || placement.text)[idx] || placement.text[idx]);
      });

      if (placedWords.length >= targetCount) {
        break;
      }
    }

    if (placedWords.length > best.length) {
      best = placedWords;
    }
  }

  if (best.length < targetCount) {
    throw new Error(`Nao foi possivel gerar layout conectado com ${targetCount} palavras`);
  }

  return normalizePlacedWords(best.slice(0, targetCount));
}

function buildDisplayLetterMap(words, cellMap) {
  const buckets = new Map();

  words.forEach((word) => {
    const displayText = word.displayText || word.text;

    word.cells.forEach((cell, idx) => {
      const key = `${cell[0]}:${cell[1]}`;
      const bucket = buckets.get(key) || new Set();
      bucket.add(displayText[idx] || word.text[idx]);
      buckets.set(key, bucket);
    });
  });

  const displayLetterMap = new Map();

  buckets.forEach((bucket, key) => {
    const choices = [...bucket];

    if (choices.length === 1) {
      displayLetterMap.set(key, choices[0]);
      return;
    }

    // Regra estrita: conflito visual em intersecao invalida a fase para regeneracao.
    displayLetterMap.set(key, null);
  });

  return displayLetterMap;
}

// Robot de fases: gera niveis sob demanda com regras de distribuicao e repeticao.
function createPhaseGenerator(totalPhases) {
  const { byNormalized, byLength } = buildWordCatalog();
  const phaseLibrary = [];
  const windowQueue = [];
  const windowCounts = new Map();
  const recentSignatures = [];
  let previousPhaseWords = new Set();
  const lastWordPhase = new Map();
  let builtUntil = 0;
  let allPhasesPrecomputed = false;

  function buildSinglePhase(phase) {
    const profile = getPhaseProfile(phase);
    const wheelLetters = profile.maxWheelLetters;
    const effectiveWeights = normalizeWeightsByWheelSize(profile.weights, wheelLetters);
    let blueprint = null;

    for (let attempt = 0; attempt < 6000; attempt += 1) {
      const rng = mulberry32(phase * 10007 + attempt * 131 + 17);
      const baseWordsInPhase = randomIntInclusive(profile.minWords, profile.maxWords, rng);
      const adaptiveDrop = Math.floor(attempt / 2000);
      const wordsInPhase = Math.max(2, baseWordsInPhase - adaptiveDrop);
      const enforceWindowRule = attempt < 4000;
      const effectiveCooldown = getWordCooldownByWheelSize(wheelLetters);
      const enforceCooldown = true;
      const lengthPlan = buildLengthPlan(wordsInPhase, effectiveWeights, rng);
      const selected = [];
      const usedInPhase = new Set();
      let failed = false;

      for (const len of lengthPlan) {
        const candidates = shuffleWithRng(byLength.get(len) || [], rng)
          .filter((entry) => !usedInPhase.has(entry.text))
          .filter((entry) => !previousPhaseWords.has(entry.text))
          .filter((entry) => {
            if (!enforceCooldown) {
              return true;
            }

            const lastPhase = lastWordPhase.get(entry.text);
            if (typeof lastPhase !== "number") {
              return true;
            }

            return (phase - lastPhase) >= effectiveCooldown;
          })
          .filter((entry) => !enforceWindowRule || wordAllowedInWindow(entry.text, windowCounts))
          .filter((entry) => selected.length === 0 || selected.some((word) => sharesLetter(word.text, entry.text)))
          .filter((entry) => requiredWheelSize(selected.map((word) => word.text).concat(entry.text)) <= profile.maxWheelLetters);

        if (!candidates.length) {
          failed = true;
          break;
        }

        const chosen = candidates[Math.floor(rng() * candidates.length)];
        selected.push(chosen);
        usedInPhase.add(chosen.text);
      }

      if (failed || selected.length !== wordsInPhase) {
        continue;
      }

      let layout;

      try {
        layout = buildConnectedLayout(selected, wordsInPhase);
      } catch {
        continue;
      }

      const selectedWords = layout.words.map((word) => word.text);
      const signature = layout.words
        .map((word) => word.text)
        .sort()
        .join("|");
      const signatureWindow = getSignatureWindowByWheelSize(wheelLetters);

      if (recentSignatures.slice(-signatureWindow).includes(signature)) {
        continue;
      }

      const requiredLetters = requiredWheelSize(selectedWords);

      // Palavras devem caber na roda da faixa, mas nao precisam usar todas as letras.
      if (requiredLetters > wheelLetters) {
        continue;
      }

      const letters = buildWheelLetters(selectedWords, profile.minWheelLetters, profile.maxWheelLetters, rng);

      if (!letters) {
        continue;
      }

      if (!selectedWords.every((word) => canSpell(word, letters))) {
        continue;
      }

      const wordsWithDisplay = layout.words.map((word) => ({
        ...word,
        displayText: byNormalized.get(word.text)?.displayText || word.text,
      }));

      const displayLetterMap = buildDisplayLetterMap(wordsWithDisplay, layout.cellMap);

      if ([...displayLetterMap.values()].some((value) => value === null)) {
        continue;
      }

      blueprint = {
        phase,
        letters,
        words: wordsWithDisplay,
        width: layout.width,
        height: layout.height,
        cellMap: layout.cellMap,
        displayLetterMap,
      };

      break;
    }

    if (!blueprint) {
      throw new Error(`Falha ao gerar fase ${phase} com as regras atuais.`);
    }

    pushPhaseToWindow(
      blueprint.words.map((word) => word.text),
      windowQueue,
      windowCounts,
    );

    const signature = blueprint.words
      .map((word) => word.text)
      .sort()
      .join("|");

    recentSignatures.push(signature);
    if (recentSignatures.length > 40) {
      recentSignatures.shift();
    }

    previousPhaseWords = new Set(blueprint.words.map((word) => word.text));
    blueprint.words.forEach((word) => {
      lastWordPhase.set(word.text, phase);
    });

    return blueprint;
  }

  function ensureBuilt(targetPhase) {
    const boundedTarget = Math.max(1, Math.min(totalPhases, targetPhase));

    while (builtUntil < boundedTarget) {
      const phaseNumber = builtUntil + 1;
      phaseLibrary.push(buildSinglePhase(phaseNumber));
      builtUntil = phaseNumber;
    }
  }

  function getPhase(phase) {
    ensureBuilt(phase);
    const index = Math.max(1, Math.min(totalPhases, phase)) - 1;
    return phaseLibrary[index];
  }

  function precomputeAllPhases() {
    if (allPhasesPrecomputed) {
      return;
    }

    ensureBuilt(totalPhases);
    allPhasesPrecomputed = true;
  }

  function getPhaseSignature(phase) {
    const puzzle = getPhase(phase);
    return puzzle.words.map((word) => word.text).sort().join("|");
  }

  return { getPhase, precomputeAllPhases, getPhaseSignature };
}

const phaseGenerator = createPhaseGenerator(TOTAL_PHASES);

function generatePhase(phase) {
  return phaseGenerator.getPhase(phase);
}

function getPhaseArt(phase) {
  const safePhase = Math.max(1, Number.parseInt(String(phase), 10) || 1);
  const index = (safePhase - 1) % PHASE_ART_ROTATION.length;
  return PHASE_ART_ROTATION[index] || artPhase;
}

function applyPhaseBackground(phase) {
  document.documentElement.style.setProperty("--art-game", `url(${getPhaseArt(phase)})`);
}

function matchWordInPuzzle(puzzle, candidate) {
  return puzzle.words.find((word) => word.text === candidate) || null;
}

function buildPhaseAuditReport(startPhase = 1, endPhase = TOTAL_PHASES) {
  const start = Math.max(1, Math.min(TOTAL_PHASES, Number.parseInt(String(startPhase), 10) || 1));
  const end = Math.max(start, Math.min(TOTAL_PHASES, Number.parseInt(String(endPhase), 10) || TOTAL_PHASES));

  const failures = [];
  const accentedWords = [];

  for (let phase = start; phase <= end; phase += 1) {
    let puzzle;

    try {
      puzzle = generatePhase(phase);
    } catch (error) {
      failures.push({ phase, reason: error?.message || "Falha ao gerar fase" });
      continue;
    }

    const wheelSizeExpected = getWheelLettersByPhase(phase);

    if (puzzle.letters.length !== wheelSizeExpected) {
      failures.push({
        phase,
        reason: `Roda invalida: esperado ${wheelSizeExpected}, recebido ${puzzle.letters.length}`,
      });
    }

    const wheelCounts = new Map();
    puzzle.letters.forEach((letter) => {
      wheelCounts.set(letter, (wheelCounts.get(letter) || 0) + 1);
    });

    for (const word of puzzle.words) {
      const pool = new Map(wheelCounts);
      for (const char of word.text) {
        const remaining = pool.get(char) || 0;
        if (remaining <= 0) {
          failures.push({
            phase,
            reason: `Palavra ${word.displayText || word.text} usa letra fora da roda`,
          });
          break;
        }
        pool.set(char, remaining - 1);
      }

      if ((word.displayText || word.text) !== word.text) {
        accentedWords.push({ phase, text: word.text, displayText: word.displayText || word.text });
      }
    }
  }

  return {
    phaseRange: [start, end],
    totalChecked: end - start + 1,
    failureCount: failures.length,
    failures,
    accentedWordsCount: accentedWords.length,
    accentedWords,
  };
}

function buildGameplayAuditReport(startPhase = 1, endPhase = TOTAL_PHASES) {
  const start = Math.max(1, Math.min(TOTAL_PHASES, Number.parseInt(String(startPhase), 10) || 1));
  const end = Math.max(start, Math.min(TOTAL_PHASES, Number.parseInt(String(endPhase), 10) || TOTAL_PHASES));
  const failures = [];
  let previousWords = new Set();

  for (let phase = start; phase <= end; phase += 1) {
    let puzzle;

    try {
      puzzle = generatePhase(phase);
    } catch (error) {
      failures.push({ phase, reason: error?.message || "Falha ao gerar fase" });
      continue;
    }

    const currentWords = puzzle.words.map((word) => word.text);
    const repeatedFromPrevious = currentWords.filter((word) => previousWords.has(word));

    if (repeatedFromPrevious.length > 0) {
      failures.push({
        phase,
        reason: `Repeticao com fase anterior: ${repeatedFromPrevious.join(", ")}`,
      });
    }

    for (const word of puzzle.words) {
      const reversed = word.text.split("").reverse().join("");

      if (reversed === word.text) {
        continue;
      }

      const shouldNotMatch = matchWordInPuzzle(puzzle, reversed);
      if (shouldNotMatch) {
        failures.push({
          phase,
          reason: `Palavra invertida aceitando indevidamente: ${reversed}`,
        });
      }
    }

    previousWords = new Set(currentWords);
  }

  return {
    phaseRange: [start, end],
    totalChecked: end - start + 1,
    failureCount: failures.length,
    failures,
  };
}

if (typeof window !== "undefined") {
  window.__MENOR_DEBUG__ = {
    getWheelLettersByPhase,
    generatePhase,
    buildPhaseAuditReport,
    buildGameplayAuditReport,
    precomputeAllPhases() {
      phaseGenerator.precomputeAllPhases();
      return TOTAL_PHASES;
    },
    getPhaseSignature(phase) {
      return phaseGenerator.getPhaseSignature(phase);
    },
    testCandidateForPhase(phase, candidate) {
      const puzzle = generatePhase(phase);
      const matched = matchWordInPuzzle(puzzle, String(candidate || "").toUpperCase());
      return matched ? (matched.displayText || matched.text) : null;
    },
  };
}

function updateHud() {
  hintCount.textContent = String(state.hints);
  basicCoinsEl.textContent = String(state.basicCoins);
  premiumCoinsEl.textContent = String(state.premiumCoins);
  if (!profileOverlay.classList.contains("hidden")) {
    renderProfileOverlay();
  }
  if (!leaderboardOverlay.classList.contains("hidden")) {
    renderLeaderboardOverlay();
  }
  if (!friendsOverlay.classList.contains("hidden")) {
    renderFriendsOverlay();
  }
}

function getLeaderboardEntries() {
  const playerEntry = {
    id: state.profile.id,
    name: state.profile.name,
    avatar: state.profile.avatar,
    avatarColor: state.profile.avatarColor,
    phase: state.phase,
    points: state.points,
    isPlayer: true,
  };

  const source = state.onlineLeaderboard.length > 0
    ? state.onlineLeaderboard
    : [playerEntry];

  return source
    .map((entry) => ({
      id: entry.id,
      name: entry.name,
      avatar: entry.avatar,
      avatarColor: entry.avatarColor,
      phase: Math.max(1, Math.min(TOTAL_PHASES, Number.parseInt(String(entry.phase), 10) || 1)),
      points: Math.max(0, Number.parseInt(String(entry.points), 10) || 0),
      isPlayer: entry.id === state.profile.id,
    }))
    .sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      if (b.phase !== a.phase) {
        return b.phase - a.phase;
      }

      return a.name.localeCompare(b.name, "pt-BR");
    })
    .slice(0, 10);
}

function renderProfileOverlay() {
  menuProfileAvatar.textContent = state.profile.avatar;
  menuProfileBtn.style.background = state.profile.avatarColor;

  profileAvatar.textContent = state.profile.avatar;
  profileAvatar.style.background = state.profile.avatarColor;
  profileAccountId.textContent = state.profile.id;
  profileNameInput.value = state.profile.name;
}

function renderLeaderboardOverlay() {
  const rows = getLeaderboardEntries()
    .map((entry, idx) => `
      <li class="leaderboard-item${entry.isPlayer ? " you" : ""}">
        <span class="leaderboard-rank">#${idx + 1}</span>
        <span class="leaderboard-avatar" style="background:${entry.avatarColor}">${entry.avatar}</span>
        <span class="leaderboard-name">${entry.name}${entry.isPlayer ? " (Você)" : ""}</span>
        <span class="leaderboard-phase">Fase ${entry.phase} · ${entry.points} pts</span>
      </li>
    `)
    .join("");

  leaderboardList.innerHTML = rows;
}

function renderFriendsOverlay() {
  const requestRows = state.friendRequests
    .map((entry) => ({
      id: String(entry.id || "").slice(0, 16),
      name: String(entry.name || "Jogador").slice(0, 22),
      avatar: String(entry.avatar || "🙂").slice(0, 4),
      avatarColor: String(entry.avatarColor || "#8fd8ff"),
      phase: Math.max(1, Math.min(TOTAL_PHASES, Number.parseInt(String(entry.phase), 10) || 1)),
      points: Math.max(0, Number.parseInt(String(entry.points), 10) || 0),
    }))
    .sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      if (b.phase !== a.phase) {
        return b.phase - a.phase;
      }

      return a.name.localeCompare(b.name, "pt-BR");
    })
    .map((entry) => `
      <li class="leaderboard-item friend-request-item">
        <span class="leaderboard-rank">ID</span>
        <span class="leaderboard-avatar" style="background:${entry.avatarColor}">${entry.avatar}</span>
        <span class="leaderboard-name">${entry.name}</span>
        <span class="leaderboard-phase">Fase ${entry.phase} · ${entry.points} pts</span>
        <div class="friend-request-actions">
          <button class="friend-request-btn accept" type="button" data-requester-id="${entry.id}" data-accept="1" aria-label="Aceitar pedido">V</button>
          <button class="friend-request-btn reject" type="button" data-requester-id="${entry.id}" data-accept="0" aria-label="Recusar pedido">X</button>
        </div>
      </li>
    `)
    .join("");

  const rows = state.friendsLeaderboard
    .map((entry) => ({
      id: String(entry.id || "").slice(0, 16),
      name: String(entry.name || "Jogador").slice(0, 22),
      avatar: String(entry.avatar || "🙂").slice(0, 4),
      avatarColor: String(entry.avatarColor || "#8fd8ff"),
      phase: Math.max(1, Math.min(TOTAL_PHASES, Number.parseInt(String(entry.phase), 10) || 1)),
      points: Math.max(0, Number.parseInt(String(entry.points), 10) || 0),
    }))
    .sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      if (b.phase !== a.phase) {
        return b.phase - a.phase;
      }

      return a.name.localeCompare(b.name, "pt-BR");
    })
    .map((entry) => `
      <li class="leaderboard-item">
        <span class="leaderboard-rank">ID</span>
        <span class="leaderboard-avatar" style="background:${entry.avatarColor}">${entry.avatar}</span>
        <span class="leaderboard-name">${entry.name}</span>
        <span class="leaderboard-phase">Fase ${entry.phase} · ${entry.points} pts</span>
      </li>
    `)
    .join("");

  friendsRequestsList.innerHTML = requestRows;
  friendsList.innerHTML = rows;
}

function renderAvatarPicker() {
  avatarGrid.innerHTML = PROFILE_AVATARS.map((avatar) => {
    const color = randomFrom(PROFILE_COLORS);
    return `<button class="avatar-option" type="button" data-avatar="${avatar}" data-color="${color}" aria-label="Escolher ${avatar}">${avatar}</button>`;
  }).join("");

  avatarGrid.querySelectorAll(".avatar-option").forEach((button) => {
    button.addEventListener("click", () => {
      state.profile.avatar = button.dataset.avatar || "🙂";
      state.profile.avatarColor = button.dataset.color || randomFrom(PROFILE_COLORS);
      saveProgress();
      void saveProfileOnServer();
      renderProfileOverlay();
      closeAvatarOverlay();
      messageEl.textContent = "Foto de perfil atualizada.";
    });
  });
}

function openProfileOverlay() {
  renderProfileOverlay();
  profileOverlay.classList.remove("hidden");
}

function closeProfileOverlay() {
  profileOverlay.classList.add("hidden");
}

function openAvatarOverlay() {
  renderAvatarPicker();
  avatarOverlay.classList.remove("hidden");
}

function closeAvatarOverlay() {
  avatarOverlay.classList.add("hidden");
}

function openLeaderboardOverlay() {
  renderLeaderboardOverlay();
  leaderboardOverlay.classList.remove("hidden");
  void refreshLeaderboard({ silent: true });
}

function closeLeaderboardOverlay() {
  leaderboardOverlay.classList.add("hidden");
}

function openFriendsOverlay() {
  renderFriendsOverlay();
  friendsOverlay.classList.remove("hidden");
  void refreshFriendsList({ silent: true });
}

function closeFriendsOverlay() {
  friendsOverlay.classList.add("hidden");
}

function closeWinOverlay() {
  winOverlay.classList.add("hidden");
}

function closeHintOverlay() {
  hintOverlay.classList.add("hidden");
}

function openSettingsOverlay() {
  settingsOverlay.classList.remove("hidden");
}

function closeSettingsOverlay() {
  settingsOverlay.classList.add("hidden");
}

function openStoreOverlay() {
  storeOverlay.classList.remove("hidden");
}

function closeStoreOverlay() {
  storeOverlay.classList.add("hidden");
}

function updateSettingsControls() {
  toggleSoundInput.checked = state.soundEnabled;
  toggleMusicInput.checked = state.musicEnabled;
  toggleVibrationInput.checked = state.vibrationEnabled;
}

async function tryExitGame() {
  const appPlugin = window?.Capacitor?.Plugins?.App;

  if (Capacitor.isNativePlatform() && appPlugin && typeof appPlugin.exitApp === "function") {
    try {
      await appPlugin.exitApp();
      return;
    } catch (error) {
      console.warn("Não foi possível encerrar o app:", error);
    }
  }

  if (window?.navigator?.app && typeof window.navigator.app.exitApp === "function") {
    try {
      window.navigator.app.exitApp();
      return;
    } catch (error) {
      console.warn("Fallback navigator.app.exitApp falhou:", error);
    }
  }

  messageEl.textContent = "Opção Sair funciona apenas no app Android/iOS.";
}

function buyStorePack({ basic = 0, premium = 0, label = "pacote" } = {}) {
  state.basicCoins += Math.max(0, basic);
  state.premiumCoins += Math.max(0, premium);
  saveProgress();
  updateHud();
  closeStoreOverlay();
  messageEl.textContent = `Compra simulada concluída: ${label}.`;
}

function getSolvedVisibleKeys() {
  const solvedKeys = new Set();

  if (!state.currentPuzzle) {
    return solvedKeys;
  }

  state.currentPuzzle.words.forEach((word) => {
    if (!state.foundWords.has(word.text)) {
      return;
    }

    word.cells.forEach((cell) => {
      solvedKeys.add(`${cell[0]}:${cell[1]}`);
    });
  });

  return solvedKeys;
}

function getHintableCells() {
  if (!state.currentPuzzle) {
    return [];
  }

  const unsolvedWords = state.currentPuzzle.words.filter((word) => !state.foundWords.has(word.text));
  const solvedVisibleKeys = getSolvedVisibleKeys();
  const availableCells = [];
  const seenKeys = new Set();

  unsolvedWords.forEach((word) => {
    word.cells.forEach((cell) => {
      const key = `${cell[0]}:${cell[1]}`;

      if (seenKeys.has(key) || state.hintedCells.has(key) || solvedVisibleKeys.has(key)) {
        return;
      }

      seenKeys.add(key);
      availableCells.push({
        key,
        letter: getCellDisplayLetter(key),
      });
    });
  });

  return availableCells;
}

function clearSelection({ keepMessage = false } = {}) {
  state.selectedIndexes = [];
  state.currentWord = "";
  currentWordEl.textContent = "";
  currentWrap.classList.remove("is-active");
  renderWheel();

  if (!keepMessage) {
    messageEl.textContent = "Tentativa limpa.";
  }
}

function getCellDisplayLetter(key) {
  return state.currentPuzzle.displayLetterMap.get(key) || state.currentPuzzle.cellMap.get(key);
}

function applyResponsiveGameLayout() {
  if (!state.currentPuzzle) {
    return;
  }

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const cols = Math.max(1, state.currentPuzzle.width || 1);
  const rows = Math.max(1, state.currentPuzzle.height || 1);

  const compact = viewportWidth <= 640;
  const letterCount = Math.max(1, state.currentPuzzle.letters?.length || 1);
  const crowdedFactor = letterCount >= 8 ? 1.24 : letterCount >= 7 ? 1.12 : 1;
  const cellGap = compact ? 6 : 8;
  const horizontalPadding = compact ? 42 : 60;
  const topReserve = compact ? 116 : 138;
  const actionsReserve = compact ? 134 : 148;

  const maxCellByWidth = (viewportWidth - horizontalPadding - ((cols - 1) * cellGap)) / cols;
  const preferredWheel = Math.round((compact ? 212 : 276) * crowdedFactor);
  const minWheel = letterCount >= 8
    ? (compact ? 152 : 196)
    : (compact ? 132 : 172);

  // Keep board legible by reserving only the minimum wheel footprint first.
  const maxCellByHeight = (viewportHeight - topReserve - minWheel - actionsReserve - ((rows - 1) * cellGap)) / rows;
  const minCell = compact ? 16 : 18;
  const maxCell = compact ? 48 : 56;

  let cellSize = Math.floor(Math.min(maxCellByWidth, maxCellByHeight, maxCell));
  if (!Number.isFinite(cellSize)) {
    return;
  }

  cellSize = Math.max(minCell, cellSize);

  board.style.setProperty("--cell-gap", `${cellGap}px`);
  board.style.setProperty("--cell-size", `${cellSize}px`);
  board.style.setProperty("--cell-radius", `${Math.max(5, Math.round(cellSize * 0.2))}px`);
  board.style.setProperty("--cell-font-size", `${Math.max(12, Math.round(cellSize * 0.42))}px`);
  board.style.setProperty("--cell-dot-size", `${Math.max(13, Math.round(cellSize * 0.5))}px`);

  const boardHeight = (rows * cellSize) + ((rows - 1) * cellGap);
  const availableForWheel = viewportHeight - topReserve - boardHeight - actionsReserve;
  let wheelSize = Math.min(preferredWheel, Math.floor(availableForWheel));
  wheelSize = Math.min(wheelSize, Math.floor(viewportWidth * (compact ? 0.68 : 0.56)));

  if (wheelSize < minWheel) {
    wheelSize = Math.max(104, wheelSize);
  }

  wheelSize = Math.max(104, wheelSize);

  const messageGap = compact
    ? (letterCount >= 8 ? 54 : 38)
    : (letterCount >= 8 ? 76 : 50);

  gamePanel.style.setProperty("--wheel-size", `${wheelSize}px`);
  gamePanel.style.setProperty("--message-gap", `${messageGap}px`);
  wheel.style.width = `${wheelSize}px`;
  wheel.style.height = `${wheelSize}px`;
}

function renderBoard() {
  board.innerHTML = "";
  board.style.setProperty("--cols", String(state.currentPuzzle.width));
  board.style.setProperty("--rows", String(state.currentPuzzle.height));
  applyResponsiveGameLayout();

  const solvedMap = new Map();

  state.currentPuzzle.words.forEach((word) => {
    if (!state.foundWords.has(word.text)) {
      return;
    }

    word.cells.forEach((cell, idx) => {
      solvedMap.set(`${cell[0]}:${cell[1]}`, getCellDisplayLetter(`${cell[0]}:${cell[1]}`));
    });
  });

  for (let y = 0; y < state.currentPuzzle.height; y += 1) {
    for (let x = 0; x < state.currentPuzzle.width; x += 1) {
      const key = `${x}:${y}`;
      const cell = document.createElement("span");

      if (!state.currentPuzzle.cellMap.has(key)) {
        cell.className = "cell void";
        board.appendChild(cell);
        continue;
      }

      if (solvedMap.has(key)) {
        cell.className = "cell solved";
        cell.textContent = solvedMap.get(key);
      } else if (state.hintedCells.has(key)) {
        cell.className = "cell hinted";
        cell.textContent = state.hintedCells.get(key);
      } else {
        cell.className = "cell blank";
        cell.textContent = "·";
      }

      board.appendChild(cell);
    }
  }
}

function getButtonCenter(index) {
  const button = wheel.querySelector(`[data-index="${index}"]`);
  if (!button) {
    return null;
  }

  return {
    x: Number.parseFloat(button.style.left),
    y: Number.parseFloat(button.style.top),
  };
}

function drawConnectors() {
  connectors.innerHTML = "";

  if (state.selectedIndexes.length < 2) {
    return;
  }

  for (let i = 1; i < state.selectedIndexes.length; i += 1) {
    const a = getButtonCenter(state.selectedIndexes[i - 1]);
    const b = getButtonCenter(state.selectedIndexes[i]);

    if (!a || !b) {
      continue;
    }

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", String(a.x));
    line.setAttribute("y1", String(a.y));
    line.setAttribute("x2", String(b.x));
    line.setAttribute("y2", String(b.y));
    line.setAttribute("class", "link-path");
    connectors.appendChild(line);
  }
}

function renderWheel() {
  applyResponsiveGameLayout();
  wheel.innerHTML = "";
  wheel.appendChild(connectors);

  const size = wheel.clientWidth || 300;
  const center = size / 2;
  const letterCount = Math.max(1, state.currentPuzzle.letters.length);
  const radius = size * (letterCount >= 8 ? 0.42 : 0.37);
  connectors.setAttribute("viewBox", `0 0 ${size} ${size}`);

  state.currentPuzzle.letters.forEach((letter, index) => {
    const angle = (Math.PI * 2 * index) / state.currentPuzzle.letters.length - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "letter-btn";
    button.dataset.index = String(index);
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
    button.textContent = letter;

    if (state.selectedIndexes.includes(index)) {
      button.classList.add("active");
    }

    wheel.appendChild(button);
  });

  drawConnectors();
}

function selectLetter(index) {
  if (state.selectedIndexes.includes(index)) {
    return;
  }

  state.selectedIndexes.push(index);
  state.currentWord += state.currentPuzzle.letters[index];
  currentWordEl.textContent = state.currentWord;
  currentWrap.classList.toggle("is-active", state.currentWord.length > 0);
  playSfx("select");
  renderWheel();
}

function resolveWordCandidate(candidate) {
  return matchWordInPuzzle(state.currentPuzzle, candidate);
}

function openHintEconomy() {
  hintOverlay.classList.remove("hidden");
}

// Sistema de dica: revela exatamente 1 letra ainda oculta em qualquer celula disponivel.
function applyHint() {
  const unsolvedWords = state.currentPuzzle.words.filter((word) => !state.foundWords.has(word.text));

  if (!unsolvedWords.length) {
    messageEl.textContent = "Todas as palavras já foram resolvidas.";
    return 0;
  }

  const availableCells = getHintableCells();

  if (!availableCells.length) {
    messageEl.textContent = "Todas as letras já foram descobertas. Não é possível usar mais dicas.";
    return 0;
  }

  const selected = availableCells[Math.floor(Math.random() * availableCells.length)];
  state.hintedCells.set(selected.key, selected.letter);
  saveCurrentPhaseSession();

  renderBoard();
  messageEl.textContent = "Dica usada: 1 letra revelada.";
  playSfx("hint");
  return 1;
}

function useHint() {
  if (state.hints <= 0) {
    openHintEconomy();
    return;
  }

  const revealedCount = applyHint();
  if (revealedCount > 0) {
    state.hints -= 1;
    updateHud();
  }
}

async function loadPhase(phaseNumber) {
  if (state.currentPuzzle) {
    saveCurrentPhaseSession();
  }

  state.phase = phaseNumber > TOTAL_PHASES ? 1 : phaseNumber;
  saveProgress();
  void syncCurrentPhaseToServer();
  showPhaseLoader();
  let progressValue = 12;
  setPhaseLoaderProgress(progressValue);
  const progressTimer = setInterval(() => {
    progressValue = Math.min(86, progressValue + 4);
    setPhaseLoaderProgress(progressValue);
  }, 90);

  await wait(240);

  try {
    state.currentPuzzle = generatePhase(state.phase);
  } catch (error) {
    console.error(error);

    try {
      messageEl.textContent = "Erro ao gerar fase. Carregando fase 1.";
      state.currentPuzzle = generatePhase(1);
      state.phase = 1;
    } catch (fallbackError) {
      console.error(fallbackError);
      phaseLoaderText.textContent = "Falha ao gerar fase. Voltando ao menu.";
      await wait(900);
      showMenu();
      clearInterval(progressTimer);
      return;
    }
  }

  clearInterval(progressTimer);
  setPhaseLoaderProgress(100);
  await wait(120);

  state.foundWords = new Set();
  state.hintedCells = new Map();
  state.bonusWords = new Set();
  state.selectedIndexes = [];
  state.currentWord = "";
  state.isDragging = false;
  state.activePointerId = null;
  applyPhaseBackground(state.phase);
  restorePhaseSession();

  updateHud();
  showGame();
  renderBoard();
  renderWheel();
  currentWordEl.textContent = "";
  currentWrap.classList.remove("is-active");
  if (state.foundWords.size > 0 || state.hintedCells.size > 0) {
    messageEl.textContent = `Progresso retomado: ${state.foundWords.size}/${state.currentPuzzle.words.length} palavras.`;
  } else {
    messageEl.textContent = "Toque, arraste e solte para validar.";
  }
}

function onPointerDown(event) {
  const target = event.target;

  if (!(target instanceof HTMLElement) || !target.classList.contains("letter-btn")) {
    return;
  }

  const index = Number.parseInt(target.dataset.index || "", 10);
  if (Number.isNaN(index)) {
    return;
  }

  event.preventDefault();
  state.isDragging = true;
  state.activePointerId = event.pointerId;
  if (typeof wheel.setPointerCapture === "function") {
    try {
      wheel.setPointerCapture(event.pointerId);
    } catch {
      // ignore setPointerCapture failures on unsupported browsers
    }
  }
  clearSelection({ keepMessage: true });
  selectLetter(index);
}

function pointerIndexFromEvent(event) {
  const target = document.elementFromPoint(event.clientX, event.clientY);

  if (!target || !target.classList.contains("letter-btn")) {
    return null;
  }

  return Number.parseInt(target.dataset.index || "", 10);
}

function onPointerMove(event) {
  if (!state.isDragging) {
    return;
  }

  if (state.activePointerId !== null && event.pointerId !== state.activePointerId) {
    return;
  }

  event.preventDefault();

  const index = pointerIndexFromEvent(event);
  if (index === null || Number.isNaN(index)) {
    return;
  }

  selectLetter(index);
}

function submitWord() {
  const candidate = state.currentWord;

  if (!candidate) {
    messageEl.textContent = "Selecione letras primeiro.";
    return;
  }

  const matchedWord = resolveWordCandidate(candidate);
  const displayWord = matchedWord?.displayText || matchedWord?.text || candidate;
  const normalizedCandidate = toUpperAscii(candidate);
  const dictionaryDisplayWord = BONUS_DICTIONARY_MAP.get(normalizedCandidate) || normalizedCandidate;

  if (!BONUS_DICTIONARY_WORDS.has(normalizedCandidate)) {
    messageEl.textContent = `"${candidate}" não existe no dicionário.`;
    playSfx("error");
    clearSelection({ keepMessage: true });
    return;
  }

  if (!matchedWord) {
    if (!state.bonusWords.has(normalizedCandidate)) {
      state.bonusWords.add(normalizedCandidate);
      state.points += BONUS_WORD_POINTS;
      saveCurrentPhaseSession();
      updateHud();
      void syncCurrentPhaseToServer({ silent: true });
      messageEl.textContent = `BÔNUS palavra extra ${dictionaryDisplayWord}: +${BONUS_WORD_POINTS} pontos.`;
      messageEl.classList.add("bonus");
      playSfx("bonus");
    } else {
      messageEl.textContent = `Bônus já recebido para ${dictionaryDisplayWord} nesta fase.`;
      playSfx("error");
    }

    clearSelection({ keepMessage: true });
    return;
  }

  if (state.foundWords.has(matchedWord.text)) {
    messageEl.textContent = `"${displayWord}" já foi encontrada.`;
    playSfx("error");
    clearSelection({ keepMessage: true });
    return;
  }

  state.foundWords.add(matchedWord.text);
  state.points += BONUS_WORD_POINTS;
  saveCurrentPhaseSession();
  renderBoard();
  clearSelection({ keepMessage: true });
  void syncCurrentPhaseToServer({ silent: true });

  const found = state.foundWords.size;
  const total = state.currentPuzzle.words.length;

  if (found === total) {
    const reward = applyPhaseCompletionRewards();
    winText.textContent = `Fase ${state.phase} concluída. Vamos para a próxima!`;
    messageEl.textContent = `Parabéns! +${BONUS_WORD_POINTS} pontos e +${reward.coinsAwarded} moedas.`;
    playSfx("win");
    winOverlay.classList.remove("hidden");
    return;
  }

  messageEl.textContent = `${displayWord} encontrada: +${BONUS_WORD_POINTS} pontos. ${found}/${total} palavras.`;
  playSfx("success");
}

function onPointerUp(event) {
  if (!state.isDragging) {
    return;
  }

  if (state.activePointerId !== null && event.pointerId !== state.activePointerId) {
    return;
  }

  state.isDragging = false;
  if (state.activePointerId !== null && typeof wheel.releasePointerCapture === "function") {
    try {
      wheel.releasePointerCapture(state.activePointerId);
    } catch {
      // ignore releasePointerCapture failures
    }
  }
  state.activePointerId = null;
  submitWord();
}

async function boot() {
  loadProgress();
  ensureProfileState();
  updateHud();
  updateSettingsControls();
  renderProfileOverlay();
  await syncCurrentPhaseToServer({ silent: true });
  if (syncIntervalHandle) {
    clearInterval(syncIntervalHandle);
  }
  syncIntervalHandle = setInterval(() => {
    void syncCurrentPhaseToServer({ silent: true });
  }, SYNC_INTERVAL_MS);
  splashScreen.classList.remove("hidden");

  splashProgress.style.width = "100%";
  await wait(5000);

  splashScreen.classList.add("hidden");
  showMenu();
}

async function startFromMenu() {
  if (isStartingPhase) {
    return;
  }

  applySelectedPhase();

  isStartingPhase = true;
  try {
    await loadPhase(state.phase);
  } finally {
    isStartingPhase = false;
  }
}

async function continueFromMenu() {
  if (isStartingPhase) {
    return;
  }

  isStartingPhase = true;
  try {
    await loadPhase(state.phase);
  } finally {
    isStartingPhase = false;
  }
}

menuPlayBtn.addEventListener("click", () => {
  void continueFromMenu();
});
menuModesBtn.addEventListener("click", showPhaseSelectMenu);
menuExitBtn.addEventListener("click", () => {
  void tryExitGame();
});
menuStoreBtn.addEventListener("click", openStoreOverlay);
menuLeaderboardBtn.addEventListener("click", openLeaderboardOverlay);
menuFriendsBtn.addEventListener("click", openFriendsOverlay);
menuProfileBtn.addEventListener("click", openProfileOverlay);
menuSettingsBtn.addEventListener("click", openSettingsOverlay);
phaseBackBtn.addEventListener("click", showMenu);

startBtn.addEventListener("click", startFromMenu);
startBtn.addEventListener("pointerup", (event) => {
  event.preventDefault();
  startFromMenu();
});
phasePicker.addEventListener("change", applySelectedPhase);
phasePicker.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") {
    return;
  }

  event.preventDefault();
  applySelectedPhase();
});

settingsBtn.addEventListener("click", openSettingsOverlay);
storeBtn.addEventListener("click", openStoreOverlay);
hintBtn.addEventListener("click", (event) => {
  event.preventDefault();
  useHint();
});

winClose.addEventListener("click", closeWinOverlay);
winNext.addEventListener("click", async () => {
  closeWinOverlay();
  await loadPhase(state.phase + 1);
});
winOverlay.addEventListener("click", (event) => {
  if (event.target === winOverlay) {
    closeWinOverlay();
  }
});

hintClose.addEventListener("click", closeHintOverlay);
watchAdBtn.addEventListener("click", () => {
  state.hints += 1;
  saveProgress();
  updateHud();
  closeHintOverlay();
  messageEl.textContent = "Anúncio simulado: +1 dica.";
});
buyHintBasicBtn.addEventListener("click", () => {
  if (state.basicCoins < BASIC_HINT_COST) {
    messageEl.textContent = `Moedas insuficientes. Você precisa de ${BASIC_HINT_COST} 🪙.`;
    return;
  }

  state.basicCoins -= BASIC_HINT_COST;
  state.hints += 1;
  saveProgress();
  updateHud();
  closeHintOverlay();
  messageEl.textContent = "Compra básica: +1 dica.";
});
buyHintsPremiumBtn.addEventListener("click", () => {
  if (state.premiumCoins < PREMIUM_HINT_PACK_COST) {
    messageEl.textContent = `Diamantes insuficientes. Você precisa de ${PREMIUM_HINT_PACK_COST} 💎.`;
    return;
  }

  state.premiumCoins -= PREMIUM_HINT_PACK_COST;
  state.hints += PREMIUM_HINT_PACK_AMOUNT;
  saveProgress();
  updateHud();
  closeHintOverlay();
  messageEl.textContent = `Pacote premium: +${PREMIUM_HINT_PACK_AMOUNT} dicas.`;
});
hintOverlay.addEventListener("click", (event) => {
  if (event.target === hintOverlay) {
    closeHintOverlay();
  }
});

settingsClose.addEventListener("click", closeSettingsOverlay);
toggleSoundInput.addEventListener("change", () => {
  state.soundEnabled = !!toggleSoundInput.checked;
  saveProgress();
  syncBackgroundMusicPlayback();
  messageEl.textContent = state.soundEnabled ? "Som ativado." : "Som desativado.";
});
toggleMusicInput.addEventListener("change", () => {
  state.musicEnabled = !!toggleMusicInput.checked;
  saveProgress();
  syncBackgroundMusicPlayback();
  messageEl.textContent = state.musicEnabled ? "Música ativada." : "Música desativada.";
});
toggleVibrationInput.addEventListener("change", () => {
  state.vibrationEnabled = !!toggleVibrationInput.checked;
  saveProgress();
  messageEl.textContent = state.vibrationEnabled ? "Vibração ativada." : "Vibração desativada.";
});
settingsMenuBtn.addEventListener("click", () => {
  closeSettingsOverlay();
  showMenu();
});
settingsOverlay.addEventListener("click", (event) => {
  if (event.target === settingsOverlay) {
    closeSettingsOverlay();
  }
});

profileClose.addEventListener("click", closeProfileOverlay);
profileOverlay.addEventListener("click", (event) => {
  if (event.target === profileOverlay) {
    closeProfileOverlay();
  }
});
profileSaveName.addEventListener("click", () => {
  const candidate = String(profileNameInput.value || "").trim().slice(0, 22);
  if (!candidate) {
    messageEl.textContent = "Digite um nome válido para salvar.";
    return;
  }

  state.profile.name = candidate;
  saveProgress();
  void saveProfileOnServer();
  renderProfileOverlay();
  messageEl.textContent = `Nome atualizado para ${candidate}.`;
});
profileRandomAvatar.addEventListener("click", openAvatarOverlay);
profileSyncNow.addEventListener("click", async () => {
  await syncCurrentPhaseToServer({ silent: false });
  await refreshLeaderboard();
  renderProfileOverlay();
});

avatarClose.addEventListener("click", closeAvatarOverlay);
avatarOverlay.addEventListener("click", (event) => {
  if (event.target === avatarOverlay) {
    closeAvatarOverlay();
  }
});

leaderboardClose.addEventListener("click", closeLeaderboardOverlay);
leaderboardOverlay.addEventListener("click", (event) => {
  if (event.target === leaderboardOverlay) {
    closeLeaderboardOverlay();
  }
});

friendsClose.addEventListener("click", closeFriendsOverlay);
friendsAddBtn.addEventListener("click", async () => {
  try {
    await addFriendById(friendsIdInput.value);
    friendsIdInput.value = "";
  } catch (error) {
    messageEl.textContent = String(error?.message || "Falha ao adicionar amigo.");
  }
});
friendsRequestsList.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const button = target.closest(".friend-request-btn");
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  const requesterId = String(button.dataset.requesterId || "").trim();
  const shouldAccept = button.dataset.accept === "1";
  try {
    await respondFriendRequest(requesterId, shouldAccept);
  } catch (error) {
    messageEl.textContent = String(error?.message || "Falha ao responder pedido de amizade.");
  }
});
friendsIdInput.addEventListener("keydown", async (event) => {
  if (event.key !== "Enter") {
    return;
  }

  event.preventDefault();
  try {
    await addFriendById(friendsIdInput.value);
    friendsIdInput.value = "";
  } catch (error) {
    messageEl.textContent = String(error?.message || "Falha ao adicionar amigo.");
  }
});
friendsOverlay.addEventListener("click", (event) => {
  if (event.target === friendsOverlay) {
    closeFriendsOverlay();
  }
});

storeClose.addEventListener("click", closeStoreOverlay);
shopBuyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const basic = Number.parseInt(button.dataset.basic || "0", 10) || 0;
    const premium = Number.parseInt(button.dataset.premium || "0", 10) || 0;
    const label = button.dataset.label || "pacote";
    buyStorePack({ basic, premium, label });
  });
});
storeOverlay.addEventListener("click", (event) => {
  if (event.target === storeOverlay) {
    closeStoreOverlay();
  }
});

wheel.addEventListener("pointerdown", onPointerDown);
window.addEventListener("pointermove", onPointerMove, { passive: false });
window.addEventListener("pointerup", onPointerUp);
window.addEventListener("pointercancel", onPointerUp);
window.addEventListener("resize", () => {
  if (!state.currentPuzzle) {
    return;
  }

  renderBoard();
  renderWheel();
});

if (typeof window !== "undefined") {
  window.__MENOR_DEBUG__ = {
    ...(window.__MENOR_DEBUG__ || {}),
    getPhaseArt,
    getPhaseArtRotation() {
      return PHASE_ART_ROTATION.slice();
    },
    getCurrentHintDiagnostics() {
      if (!state.currentPuzzle) {
        return {
          hints: state.hints,
          hintableCells: 0,
          solvedVisibleCells: 0,
          hintedCells: state.hintedCells.size,
        };
      }

      return {
        hints: state.hints,
        hintableCells: getHintableCells().length,
        solvedVisibleCells: getSolvedVisibleKeys().size,
        hintedCells: state.hintedCells.size,
        totalBoardCells: state.currentPuzzle.cellMap.size,
      };
    },
    setHintsForTest(value) {
      state.hints = Math.max(0, Number.parseInt(String(value), 10) || 0);
      updateHud();
      return state.hints;
    },
    useHintForTest() {
      const before = state.hints;
      useHint();
      return {
        before,
        after: state.hints,
        hintableCells: getHintableCells().length,
        message: messageEl.textContent,
      };
    },
  };
}

configureNativeDisplay();
boot();
