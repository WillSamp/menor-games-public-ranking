# Menor Games - Architecture

## Visao geral

Aplicacao web com Vite + JavaScript + CSS para prototipo de caca palavras estilo mobile.

## Fluxo de telas

1. Splash de inicializacao
2. Menu inicial
3. Tela de carregamento de fase
4. Tela principal do jogo
  - Sem titulo/fase no topo para manter foco no tabuleiro
  - Botao de dica flutuante e estatico
5. Popups de vitoria e economia de dicas

## Modulos principais

- `src/main.js`
  - Gera fases progressivas (1 a 2000)
  - Monta tabuleiro conectado (palavras cruzadas entre si)
  - Processa interacao por arraste de letras
  - Valida palavras formadas
  - Gerencia sistema de dicas e economia (anuncio/compra simulados)
  - Preserva forma visual com acentos para exibicao (ex.: TÃO)
- `src/style.css`
  - Estilo das telas, tabuleiro, roda de letras, botoes e overlays
  - Camada de fundo com arte principal

## Regras de fase

- Total de fases: 2000
- Fases sao geradas por um robot interno em `src/main.js` (`createPhaseGenerator`)
- As fases sao geradas sob demanda (fase a fase), mantendo assinaturas deterministicas para facilitar validacao sem penalizar o tempo de boot
- Tamanho fixo da roda por faixa:
  - fases 1-15: 4 letras
  - fases 16-24: 5 letras
  - fases 25-34: 6 letras
  - fases 35-59: 7 letras
  - fases 60+: 8 letras
- Quantidade de palavras por fase e ajustada para caber no tamanho da roda da faixa
- Comprimento de palavras permitido: 3, 4, 5 e 6 letras
- Frequencia por tamanho de palavra muda por faixa de fases, conforme card de dificuldade
- Regra de repeticao: uma mesma palavra pode aparecer no maximo 3 vezes em qualquer janela de 15 fases
- Palavras da fase devem ser formaveis usando apenas as letras da roda da fase
- Sem nomes proprios no banco de palavras
- Em cenarios de alta restricao (roda pequena + conectividade + janela de repeticao), o gerador aplica fallback adaptativo para garantir continuidade:
  - reduz progressivamente a quantidade de palavras da fase
  - e, em ultimo caso, relaxa apenas a janela de repeticao
- Anti-repeticao de fase: a mesma assinatura de palavras (conjunto da fase) nao pode se repetir em janela recente, com tamanho adaptado pela roda:
  - roda 4: ultimas 10 fases
  - roda 5: ultimas 14 fases
  - roda 6: ultimas 18 fases
  - roda 7: ultimas 22 fases
  - roda 8: ultimas 28 fases
- Anti-repeticao por palavra: cada palavra respeita cooldown minimo por tamanho da roda para evitar repeticao em intervalo curto:
  - roda 4: 10 fases
  - roda 5: 8 fases
  - roda 6: 7 fases
  - roda 7: 6 fases
  - roda 8: 5 fases
- Vocabulario curto (3-4 letras) foi ampliado para aumentar variedade nas fases iniciais.

## Regras de tabuleiro

- Palavras devem se conectar entre si
- Conexao valida apenas por letra compartilhada (sem encostar por lateral/ponta)
- Cada palavra ocupa blocos quadrados visiveis
- Letras descobertas permanecem no mesmo lugar
- Validacao de tentativa aceita somente palavra exata da fase (nao aceita invertida/anagrama como equivalente)

## Sistema de dicas

- Jogador inicia com 5 dicas
- Cada uso revela exatamente 1 letra nova no tabuleiro
- A letra pode vir de qualquer quadrado ainda disponivel
- Letras reveladas por dica permanecem no tabuleiro
- Botao de dica permanece fixo
- Sem dicas: popup com simulacao de anuncio (+1) ou compra (+5)
- Se todas as letras possiveis ja estiverem visiveis, a dica nao e consumida e o jogo avisa que nao ha mais letras para revelar

## Guia rapido de manutencao

- Para alterar o robot de fases, revise:
  - `WORD_TIERS`
  - `getPhaseProfile`
  - `buildLengthPlan`
  - `createPhaseGenerator`
- Para palavras com acento, cadastre no formato correto (ex.: `TÃO`).
  - Internamente a comparacao usa forma sem acento, mas a exibicao mantem o acento.
  - Exemplo esperado em jogo: `MAO` e validado internamente e exibido como `MÃO` quando resolvido.
- Para ajustar conexao de palavras, revise `checkPlacement()` e `findPlacement()` em `src/main.js`.
- Para ajustar dica, revise `applyHint()` em `src/main.js`.

## Assets

- Fundo e carregamento usam `src/assets/canva-1.png`

## Mobile e tela cheia

- Layout usa `100dvh` com safe areas para melhor adaptacao em celulares.
- `viewport-fit=cover` configurado em `index.html`.
- Botao de dica foi deslocado para baixo e fixado para evitar sobreposicao do tabuleiro.
- Grade e celulas reduzem de tamanho em telas pequenas para evitar cortes.
- Em app nativo (Capacitor), `@capacitor/status-bar` e usado para esconder a barra superior.

## Fundo por fase

- O fundo do gameplay rotaciona automaticamente por fase.
- A logica prioriza imagens `canva-2.png` ate `canva-10.png` em `src/assets`.
- Se nem todas existirem, usa as que estiverem disponiveis sem quebrar o jogo.
- O ciclo e automatico (loop), facilitando adicionar novas imagens no futuro.

## Validacao

- Sempre validar com `npm.cmd run build`
- Sempre abrir/recarregar `http://localhost:5173/` apos alteracoes
