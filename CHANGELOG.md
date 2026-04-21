# Changelog

## 2026-04-21

### Pontuacao por palavra valida e sync imediato no ranking

- Arquivos alterados:
  - `src/main.js`
  - `CHANGELOG.md`

- Mudancas realizadas:
  - Regra de pontuacao ajustada para conceder `+50 pontos` em toda palavra valida no dicionario, seja palavra da fase ou palavra extra.
  - Validacao de envio passou a exigir existencia no dicionario antes de aceitar pontuacao.
  - Correcao de sincronizacao: sempre que pontua, o jogo sincroniza imediatamente com o backend para refletir no ranking sem esperar o ciclo de 2 minutos.
  - Mensagens de feedback ajustadas para mostrar ganho de pontos em palavras da fase e bonus.

- Resultado esperado:
  - Ranking atualizado rapidamente apos cada palavra pontuada.
  - Regra unica e previsivel de pontuacao para palavras validas no dicionario.

- Validacao:
  - Build web compilando sem erros (`npm.cmd run build`).

### QA publico consolidado no Render (ranking + amigos)

- Arquivos alterados:
  - `WORKFLOW-RULES.md`
  - `README.md`
  - `src/main.js`
  - `CHANGELOG.md`

- Mudancas realizadas:
  - Regra de testes publicos adicionada na documentacao para garantir funcionamento em 2 Androids diferentes.
  - Documentado que ranking e amigos devem funcionar juntos de forma publica via Render.
  - README atualizado com fluxo de amigos por ID e criterio de ranking por pontos.
  - Fallback da API no frontend fixado para `https://menor-games-public-ranking.onrender.com` quando variavel de ambiente nao estiver definida.

- Resultado esperado:
  - Ambiente de QA mais previsivel, evitando fallback local acidental durante testes multi-dispositivo.

- Validacao:
  - Regras e orientacoes atualizadas nos markdowns do projeto.

## 2026-04-19

### Bonus com dicionario completo de portugues

- Arquivos alterados:
  - `src/main.js`
  - `package.json`
  - `package-lock.json`
  - `CHANGELOG.md`

- Mudancas realizadas:
  - Integrado pacote `an-array-of-portuguese-words` (~180k palavras) para validar bonus por palavra existente no idioma.
  - Validacao de bonus deixou de usar apenas o vocabulario reduzido interno das fases.
  - Persistencia de bonus por fase foi mantida e agora valida com o dicionario completo ao restaurar sessao.
  - Base da USP (`br-utf8.txt`) foi incorporada na validacao de bonus via arquivo local `src/assets/usp-br-utf8-filtered.txt`, removendo as palavras `a` e `á` como solicitado.
  - Mensagem de bonus ajustada para o formato: `BÔNUS palavra extra PALAVRA: + 50 moedas.`, sem parenteses e com acentuacao correta.
  - Exibicao da palavra bonus passou a priorizar variante acentuada em maiusculo (ex.: `CAO` -> `CÃO`).
  - Filtro adicional de elegibilidade para bonus em palavras curtas e exclusao explicita de casos anômalos (ex.: `ROI`).
  - Revisao de acentuacao aplicada nos principais textos da interface (menus, popups e mensagens de gameplay).
  - Trilha de fundo adicionada durante gameplay com arquivo `src/assets/bg-theme.mp3`, respeitando o toggle de som.
  - Trilha de fundo ajustada para iniciar ja no menu inicial, com volume padrao em 50%.
  - Popup de configuracoes simplificado: removidos os botoes `Limpar` e `Proxima fase`.
  - Botao `Menu` no popup foi renomeado para `Voltar ao menu`.

- Resultado esperado:
  - Bonus mais consistente para palavras reais do portugues, mesmo quando nao fazem parte da fase atual.

- Validacao:
  - Build web compilando sem erros (`npm.cmd run build`).
  - Observacao: bundle JS ficou maior por causa do dicionario amplo (warning de chunk grande no Vite).
  - Observacao adicional: com a lista da USP combinada, o bundle cresceu ainda mais, mantendo o mesmo warning de chunk grande.

## 2026-04-16

### Atualizacao visual e de jogabilidade (ajuste de coerencia)

- Arquivos alterados:
  - `src/main.js`
  - `src/style.css`
  - `WORKFLOW-RULES.md`
  - `ARCHITECTURE.md`
  - `CHANGELOG.md`

- Mudancas realizadas:
  - Removida lista inferior de palavras para reduzir confusao visual.
  - Tabuleiro mantido com blocos quadrados visiveis no proprio grid.
  - Fundo do jogo reforcado com a arte principal para ficar evidente durante gameplay.
  - Card de lampada ajustado para estilo transparente com badge de contador.
  - Dica corrigida para revelar exatamente 2 letras novas por uso e manter letras reveladas no mesmo lugar.
  - Dica passa a focar uma palavra alvo por vez ate completa-la, depois seleciona outro alvo nao concluido.
  - Regras de processo adicionadas para manter registro e arquitetura sempre atualizados.

- Resultado esperado:
  - Melhor leitura do tabuleiro e conectividade das palavras.
  - Comportamento de dicas previsivel e sem "troca de lugares".
  - Interface mais proxima do estilo de referencia enviado.

- Validacao:
  - Build de producao compilando sem erros.
  - Jogo recarregado em ambiente local para teste manual.

### Refino fiel ao print de referencia

- Arquivos alterados:
  - `src/main.js`
  - `src/style.css`
  - `ARCHITECTURE.md`
  - `CHANGELOG.md`

- Mudancas realizadas:
  - Removido titulo e fase da tela principal de jogo (mantidos no menu).
  - Removido quadro visual ao redor da area de palavras para ficar no estilo limpo da referencia.
  - Blocos do tabuleiro reforcados com alto contraste para leitura do tamanho das palavras.
  - Fundo principal mantido visivel durante gameplay com menor escurecimento.
  - Card de dica ficou arrastavel e transparente sobre a tela.
  - Dica fixada em uma palavra alvo por vez ate completar as letras faltantes desse alvo.
  - Correcao tecnica no arraste da dica para evitar erro de ponteiro e manter o movimento fluido.

- Resultado esperado:
  - Jogabilidade visualmente proxima ao modelo enviado.
  - Palavras conectadas claramente identificaveis no tabuleiro.
  - Dicas consistentes sem "pular" para lugares incoerentes.

### Correcao de visibilidade da estrutura das palavras

- Arquivos alterados:
  - `src/main.js`
  - `src/style.css`
  - `CHANGELOG.md`

- Mudancas realizadas:
  - Celas ocultas passaram a exibir marcador visual (`·`) para tornar o desenho das palavras visivel antes de digitar.
  - Contraste dos blocos vazios reforcado com fundo mais claro e borda mais forte.

- Resultado esperado:
  - Estrutura de palavras sempre visivel no tabuleiro, mesmo sem tentativa iniciada.

## 2026-04-17

### Conexao coerente de palavras e dica estatica

- Arquivos alterados:
  - src/main.js
  - CHANGELOG.md

- Mudancas realizadas:
  - Botao de dica voltou a ser estatico, sem suporte a arrastar.
  - Removidos handlers globais de ponteiro usados apenas pelo arraste da dica.
  - Algoritmo de posicionamento das palavras ficou mais restrito para cruzadinha real:
    - Bloqueio de palavras apenas encostadas por lateral ou extremidade.
    - Aceite apenas quando houver intersecao por letra igual.
    - Escolha do melhor posicionamento por maior numero de intersecoes.

- Resultado esperado:
  - Estrutura com conexoes coerentes entre palavras, evitando blocos "juntos" sem cruzamento valido.
  - Fluxo de dica previsivel com botao fixo na tela.

- Validacao:
  - Build web compilando sem erros.
  - APK debug recompilado com as correcoes.

### Acentuacao automatica, dica de 1 letra e documentacao tecnica

- Arquivos alterados:
  - src/main.js
  - ARCHITECTURE.md
  - CHANGELOG.md

- Mudancas realizadas:
  - Palavra `TÃO` adicionada no pack da fase com letras A/E/N/O/T.
  - Sistema interno passou a separar comparacao sem acento e exibicao com acento.
  - Ao concluir palavra com acento, o tabuleiro e a mensagem exibem a forma correta (ex.: `TÃO`).
  - Dica alterada para revelar exatamente 1 letra por uso.
  - Dica agora escolhe 1 quadrado disponivel de qualquer palavra nao concluida.
  - Comentarios tecnicos adicionados em funcoes-chave de `src/main.js`.
  - Documentacao em `ARCHITECTURE.md` atualizada com regras atuais e guia de manutencao.

- Resultado esperado:
  - Melhor experiencia para palavras com acento sem exigir digitacao com caracteres especiais.
  - Sistema de dica previsivel: 1 consumo = 1 letra revelada.
  - Codigo mais facil de manter para ajustes manuais.

- Validacao:
  - Teste manual em browser confirmou `TÃO encontrada` e exibicao de `Ã` no tabuleiro.
  - Teste manual confirmou caso `1 dica -> 1 letra revelada`.

### Gerador de 500 fases unicas com progressao

- Arquivos alterados:
  - src/main.js
  - ARCHITECTURE.md
  - CHANGELOG.md

- Mudancas realizadas:
  - `TOTAL_PHASES` alterado para 500.
  - Packs fixos removidos e substituidos por robot de fases (`buildPhaseLibrary`).
  - Banco de palavras organizado por tiers de dificuldade (`WORD_TIERS`), sem nomes proprios.
  - Regra de assinatura unica por fase adicionada para impedir repeticao de combinacao de palavras.
  - Progressao de dificuldade aplicada por faixa de fase (mais palavras e mais letras ao longo da jornada).

- Resultado esperado:
  - Nao repetir o ciclo curto de fases iniciais.
  - Manter fases distintas ao longo das 500 fases com progressao gradual.

- Validacao:
  - Build web compilando sem erros.
  - Amostra manual das 8 primeiras fases exibiu 8 combinacoes de letras distintas.

### Seletor de fase no menu

- Arquivos alterados:
  - src/main.js
  - src/style.css
  - CHANGELOG.md

- Mudancas realizadas:
  - Adicionado seletor numerico de fase no menu inicial (`phase-picker`).
  - Adicionado botao `Definir` para aplicar a fase escolhida antes de jogar.
  - Botao `Jogar` passa a iniciar diretamente na fase selecionada.
  - Campo aceita `Enter` para aplicar a fase rapidamente.
  - Estilo do seletor integrado ao visual atual da tela de menu.

- Resultado esperado:
  - Jogador consegue iniciar em qualquer fase de 1 a 500 sem navegar sequencialmente.

- Validacao:
  - Teste manual no browser: fase 237 aplicada no menu e carregada ao iniciar.

### Novo card de dificuldade: 2000 fases com distribuicao por tamanho

- Arquivos alterados:
  - src/main.js
  - ARCHITECTURE.md
  - CHANGELOG.md

- Mudancas realizadas:
  - `TOTAL_PHASES` alterado para 2000.
  - Robot de fases refeito para geracao sob demanda (`createPhaseGenerator`).
  - Regras de distribuicao de palavras por tamanho (3, 4, 5, 6 letras) implementadas por faixa de fase.
  - Quantidade de palavras por fase ajustada:
    - Fases ate 1000: 4 a 6 palavras
    - Fases acima de 1000: 5 a 7 palavras
  - Regra de repeticao implementada:
    - mesma palavra no maximo 3 vezes em uma janela de 15 fases
  - Filtro de dicionario mantido sem nomes proprios.

- Resultado esperado:
  - Progressao de dificuldade mais controlada por comprimento das palavras.
  - Menor repeticao percebida entre fases proximas.
  - Escalabilidade para 2000 niveis mantendo coerencia das regras.

- Validacao:
  - Build web compilando sem erros.
  - Teste manual com seletor carregou fase 120 e fase 1001 com sucesso.

### Ajuste de dificuldade inicial e resolucao mobile

- Arquivos alterados:
  - src/main.js
  - src/style.css
  - src/main.js
  - capacitor.config.json
  - index.html
  - CHANGELOG.md

- Mudancas realizadas:
  - Fases iniciais ficaram mais simples no gerador:
    - fases 1-15 fixadas em 4 palavras
    - limite de letras na roleta por faixa de fase (`minWheelLetters` / `maxWheelLetters`)
    - selecao de palavras agora respeita budget de letras para evitar rodas grandes no comeco.
  - Layout mobile/resolucao melhorado:
    - uso de `100dvh` e safe-area para preenchimento de tela
    - viewport atualizado para `viewport-fit=cover`
    - grade e celulas reduzidas em telas pequenas para evitar cortes
    - roda de letras deslocada mais para baixo
    - botao de dica reposicionado para baixo e fora da area de palavras.
  - Android fullscreen:
    - configuracao do plugin `@capacitor/status-bar` para esconder barra superior no app nativo.

- Resultado esperado:
  - Inicio da jornada menos complexo visualmente.
  - Menos casos de quadrados cortados em telas pequenas.
  - Experiencia mais proxima de tela cheia no Android.

- Validacao:
  - Teste manual da fase 1: roleta com 7 letras.
  - Verificacao de posicao: botao de dica sem sobrepor tabuleiro.
  - Build web compilando sem erros.

### Correcao de acento em cruzamento

- Arquivos alterados:
  - src/main.js
  - CHANGELOG.md

- Mudancas realizadas:
  - Criado mapa de exibicao por celula (`displayLetterMap`) para resolver conflitos de acento em casas compartilhadas.
  - Quando duas palavras cruzam e sugerem letras visuais diferentes para a mesma celula (ex.: `A` x `Ã`), a celula passa a exibir a letra-base.
  - Sistema de dica atualizado para usar essa letra canonica por celula e evitar inconsistencias.

- Resultado esperado:
  - Evita casos como `CÃPA` ou mudanca incoerente de acento quando outra palavra cruza a mesma casa.
  - Mantem mensagens de palavra encontrada com acento correto.

- Validacao:
  - Build web compilando sem erros apos a alteracao.

### Regra estrita de acento no cruzamento

- Arquivos alterados:
  - src/main.js
  - CHANGELOG.md

- Mudancas realizadas:
  - Algoritmo de posicionamento atualizado para validar letra visual no cruzamento.
  - Agora, duas palavras so podem compartilhar celula se a letra e o acento coincidirem (ex.: `Ã` cruza apenas com `Ã`).
  - Fases com conflito de acento em celula compartilhada passam a ser descartadas e regeneradas.

- Resultado esperado:
  - Evita perda de acento em palavras como `PÃO`.
  - Impede resultados sem sentido por cruzamento misto (ex.: `CÃPA`).

- Validacao:
  - Build web compilando sem erros.
  - Fase inicial carregada com sucesso apos a mudanca de regra.

### Ajuste da area de tentativa

- Arquivos alterados:
  - src/main.js
  - src/style.css
  - CHANGELOG.md

- Mudancas realizadas:
  - Area de tentativa agora fica escondida por padrao.
  - Ao arrastar letras, exibe apenas a palavra em formacao (sem prefixo `Tentativa:` e sem `-`).
  - Ao limpar/validar tentativa, area volta a ocultar automaticamente.

- Resultado esperado:
  - Interface mais limpa, exibindo somente texto util durante a formacao da palavra.

### Estabilidade da roda e refinamento mobile/fullscreen

- Arquivos alterados:
  - src/main.js
  - src/style.css
  - android/app/src/main/res/values/styles.xml
  - android/app/src/main/java/com/menorgames/app/MainActivity.java
  - CHANGELOG.md

- Mudancas realizadas:
  - Area de tentativa deixou de usar `display:none` durante o jogo e passou a usar estado visual (`is-active`) sem alterar o fluxo do layout.
  - Roda nao se desloca quando a tentativa aparece/desaparece.
  - Grid de palavras ficou responsivo com tamanho de celula adaptativo para reduzir cortes em telas pequenas e manter boa leitura.
  - Fullscreen Android reforcado no tema nativo e em `MainActivity` com ocultacao programatica da status bar.

- Resultado esperado:
  - Layout mais estavel no celular, sem "pulo" da roda durante a tentativa.
  - Melhor aproveitamento da tela e menor chance de corte dos quadrados.
  - Menor incidencia da barra superior no app Android.

### Nova regra fixa da roda por nivel

- Arquivos alterados:
  - src/main.js
  - CHANGELOG.md

- Mudancas realizadas:
  - Tamanho da roda fixado por faixa de nivel:
    - Fases 1 a 15: 4 letras
    - Fases 16 a 24: 5 letras
    - Fases 25 a 34: 6 letras
    - Fases 35 a 59: 7 letras
    - Fases 60+: 8 letras
  - Gerador passou a aceitar fase somente quando o conjunto de palavras exige exatamente o mesmo total de letras da roda da faixa.
  - Distribuicao de tamanhos de palavras foi adaptada automaticamente para nunca pedir palavras maiores do que a roda da fase permite.

- Resultado esperado:
  - Coerencia total entre dificuldade da fase e tamanho da roda.
  - Palavras da fase sempre formaveis usando apenas as letras disponiveis naquela roda.

### Hotfix: carregamento infinito da fase

- Arquivos alterados:
  - src/main.js
  - CHANGELOG.md

- Causa identificada:
  - A validacao de geracao exigia uso exato do total de letras da roda, o que tornou fases iniciais inviaveis em alguns cenarios.

- Mudancas realizadas:
  - Validacao ajustada para aceitar fase quando as palavras cabem na roda (<=), sem exigir uso exato de todas as letras.
  - Faixa de quantidade de palavras passou a considerar o tamanho fixo da roda para manter viabilidade nas fases iniciais.
  - Fallback de erro em carregamento de fase reforcado para voltar ao menu caso ocorra falha dupla de geracao.

- Resultado esperado:
  - Fases carregam normalmente sem ficar presas em loop de loading.

### Estabilizacao do gerador e auditoria completa (2000 fases)

- Arquivos alterados:
  - src/main.js
  - ARCHITECTURE.md
  - CHANGELOG.md

- Mudancas realizadas:
  - Removida restricao global de assinatura unica, que esgotava combinacoes em rodas pequenas.
  - Gerador ganhou fallback adaptativo para cenarios muito restritos:
    - reduz quantidade de palavras quando necessario
    - e relaxa janela de repeticao apenas em ultimo caso
  - Mantidas regras principais:
    - roda fixa por faixa de fase
    - palavras sempre formaveis pelas letras da roda
    - exibicao com acento apos completar palavra (ex.: `MAO` -> `MÃO`)

- Validacao executada:
  - Auditoria Playwright in-browser nas fases 1..2000.
  - Resultado: `0` falhas de geracao/compatibilidade de roda.
  - Cenarios com acento encontrados em varias fases, incluindo amostras com `MÃO`.

### Correcao de repeticao de fases + auditoria geral de acentos

- Arquivos alterados:
  - src/main.js
  - ARCHITECTURE.md
  - CHANGELOG.md

- Mudancas realizadas:
  - Adicionada regra anti-repeticao por assinatura de fase (conjunto de palavras), com janela recente adaptada pelo tamanho da roda.
  - Mantida regra de roda fixa por nivel e verificacao de formacao das palavras pela roda.
  - Mantida regra de exibicao acentuada apos resolucao da palavra (ex.: `MAO` -> `MÃO`).

- Validacao executada (Playwright in-browser):
  - 2000 fases verificadas.
  - 0 falhas gerais.
  - 0 repeticoes de assinatura dentro da janela.
  - 0 erros de acentuacao.
  - Palavras acentuadas detectadas no conjunto: `MÃO`, `PÃO`, `POÇO`.

### Correcao de tentativa invertida e repeticao entre fases vizinhas

- Arquivos alterados:
  - src/main.js
  - ARCHITECTURE.md
  - CHANGELOG.md

- Mudancas realizadas:
  - Tentativa agora valida apenas palavra exata da fase.
    - Exemplo: `ROMA` nao valida mais como `AMOR`.
  - Gerador passou a bloquear reuso de palavras da fase imediatamente anterior.
  - Adicionado cenario de teste em debug para auditar:
    - repeticao entre fases consecutivas
    - aceite indevido de palavra invertida

- Validacao executada (Playwright in-browser):
  - Auditoria base (1..2000): 0 falhas.
  - Auditoria de gameplay (1..2000): 0 falhas.
  - Teste direcionado: primeira fase com `AMOR` = fase 4, `ROMA` rejeitada e `AMOR` aceita.

### Mais variedade nas fases curtas (repeticao em intervalo curto)

- Arquivos alterados:
  - src/main.js
  - ARCHITECTURE.md
  - CHANGELOG.md

- Mudancas realizadas:
  - Vocabulario de palavras curtas (3-4 letras) foi expandido para aumentar diversidade no inicio do jogo.
  - Regra de cooldown por palavra ficou estrita, evitando reaparecimento em intervalo curto.
  - Cooldown aplicado por tamanho da roda:
    - roda 4: 10 fases
    - roda 5: 8 fases
    - roda 6: 7 fases
    - roda 7: 6 fases
    - roda 8: 5 fases

- Validacao executada (Playwright in-browser):
  - 2000 fases verificadas.
  - Repeticoes abaixo do cooldown: 0.
  - Amostra inicial validada:
    - F1: `PANO`, `PÃO`, `ANO`
    - F2: `COLA`, `OCA`, `CAL`
    - F3: `VIDA`, `DIA`, `VIA`

### Ajuste responsivo de layout (tabuleiro maior, roda menor, controles mais baixos)

- Arquivos alterados:
  - src/style.css
  - CHANGELOG.md

- Mudancas realizadas:
  - Painel de jogo ajustado para ocupar melhor a altura util da tela em diferentes resolucoes.
  - Tabuleiro teve aumento do tamanho de celulas e area vertical disponivel para melhorar leitura dos quadrados.
  - Roda de letras foi reduzida para diminuir dominancia visual.
  - Bloco de acoes (`Limpar`, `Proxima fase`, `Menu`) foi ancorado mais para baixo na tela.
  - Botao de dica reposicionado para acompanhar o novo fluxo vertical.

- Validacao executada:
  - Build web concluido com sucesso.
  - Medicao em browser confirmou: roda abaixo do tabuleiro, acoes abaixo da roda e maior ocupacao do tabuleiro.
  - APK Android debug recompilado e atualizado.

### Dicas sem gasto indevido + fundo rotativo por fase + documento de mecanicas

- Arquivos alterados:
  - src/main.js
  - ARCHITECTURE.md
  - HOWTHEGAMEWORKS.md
  - CHANGELOG.md

- Mudancas realizadas:
  - Sistema de dicas agora impede gasto quando nao existe mais letra nova para revelar.
  - Mensagem especifica quando o limite de letras revelaveis e atingido.
  - Fundo do gameplay passou a rotacionar por fase com suporte escalavel para novas imagens.
    - Prioridade atual: `canva-2` ate `canva-10`
    - Fallback automatico para conjunto disponivel
  - Criado documento dedicado com explicacao detalhada de todas as mecanicas: `HOWTHEGAMEWORKS.md`.

- Validacao executada:
  - Build web concluido com sucesso.
  - Teste funcional confirmou que dica nao reduz contador quando nao ha mais letras ocultas.
  - Teste funcional confirmou troca de fundo ao avancar fase.

### Ajuste de assets de fundo e titulo

- Arquivos alterados:
  - src/assets/canva-2.png (removido)
  - src/assets/canva-3.png -> src/assets/title.png
  - src/main.js
  - ARCHITECTURE.md
  - CHANGELOG.md

- Mudancas realizadas:
  - Removido asset antigo `canva-2.png` conforme solicitacao.
  - Asset `canva-3.png` renomeado para `title.png` e aplicado no logo/titulo.
  - Rotacao de fundo da fase ficou dedicada a arquivos `canva-2.png` ate `canva-10.png`.

- Observacao:
  - Enquanto os arquivos `canva-2..10` nao estiverem no projeto, o sistema usa fallback seguro com `canva-1.png`.

### Fases estaticas por execucao (precompute 2000)

- Arquivos alterados:
  - src/main.js
  - ARCHITECTURE.md
  - CHANGELOG.md

- Mudancas realizadas:
  - Biblioteca de fases passou a precomputar as 2000 fases no boot.
  - Sequencia das fases fica estatica durante a execucao do app.
  - Helpers de debug adicionados para validar assinatura de fase e estabilidade.

- Validacao executada (todas as fases):
  - Auditoria base (1..2000): 0 falhas.
  - Auditoria de gameplay (1..2000): 0 falhas.
  - Estabilidade de assinatura em amostras de fases (1, 2, 3, 10, 25, 60, 120, 500, 1000, 2000): 100% estavel.

### Compatibilidade Android ampliada + preparacao para Play Store (AAB)

- Arquivos alterados:
  - android/app/src/main/java/com/menorgames/app/MainActivity.java
  - android/app/src/main/AndroidManifest.xml
  - src/style.css
  - CHANGELOG.md

- Mudancas realizadas:
  - Fullscreen imersivo reforcado em Android (status bar + navigation bar), reaplicado em `onResume` e foco da janela.
  - Activity ajustada para retrato, `adjustResize` e `resizeableActivity` para maior consistencia entre aparelhos.
  - CSS com reforco para variacoes de viewport e escala de fonte (`text-size-adjust`, `100svh`, controle de overscroll).

- Validacao executada:
  - Build web: sucesso.
  - Auditorias 1..2000 (base + gameplay): 0 falhas.
  - Build Android APK debug: sucesso.
  - Build Android AAB release: sucesso.

### Boot mais rapido + splash em tela cheia (title)

- Arquivos alterados:
  - src/main.js
  - src/style.css
  - ARCHITECTURE.md
  - CHANGELOG.md

- Mudancas realizadas:
  - Removido precompute das 2000 fases no boot para evitar demora de abertura.
  - Carregamento voltou para estrategia fase a fase (sob demanda), mantendo consistencia por assinatura.
  - Splash redesenhada para usar somente `title.png` ocupando a tela inteira.
  - Elementos da splash anterior (card pequeno, titulo texto e barra) ocultados.

- Validacao executada:
  - Build web: sucesso.
  - Auditoria base (1..2000): 0 falhas.
  - Auditoria de gameplay (1..2000): 0 falhas.
  - Estabilidade de assinatura em fases amostradas: 0 divergencias.

### Refino de abertura e tela de carregamento de fase

- Arquivos alterados:
  - src/main.js
  - src/style.css
  - CHANGELOG.md

- Mudancas realizadas:
  - Splash com fundo branco e logo central em destaque.
  - Splash configurada para permanecer por 5 segundos antes de abrir menu.
  - Tela "Carregando fase" ajustada para estilo limpo/alinhado ao menu (sem card azul/transparente).

- Validacao executada:
  - Build web: sucesso.
  - Estilos da splash e do loader validados em runtime.

### Autoajuste de layout para evitar corte em fases grandes (mobile)

- Arquivos alterados:
  - src/main.js
  - src/style.css
  - CHANGELOG.md

- Mudancas realizadas:
  - Inteligencia de layout responsivo reforcada para calcular dinamicamente:
    - tamanho das celulas do tabuleiro
    - tamanho da roda
    - reservas verticais para manter botoes e mensagem visiveis
  - Limites minimos/maximos ajustados para cenarios extremos de fase em telas menores.
  - Removido `min-height` fixo do painel para evitar overflow vertical forcado.

- Validacao executada:
  - Build web: sucesso.
  - Teste runtime confirmou: tabuleiro, roda e controles dentro do viewport sem corte na fase testada.
