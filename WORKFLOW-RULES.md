# Workflow Rules

## Execucao automatica para testes

- Sempre que houver qualquer alteracao de codigo, estilo, assets ou configuracao do jogo, iniciar (ou manter ativo) o servidor de desenvolvimento e abrir o jogo para teste manual imediato.
- Em toda atualizacao feita nesta sessao, garantir explicitamente que o servidor local permanece de pe para teste no VS Code.
- URL padrao de teste local: http://localhost:5173/
- Comando preferencial no Windows: `npm.cmd run dev`
- Se o servidor ja estiver em execucao, apenas reutilizar a mesma sessao e abrir/atualizar a pagina.

## Objetivo

Garantir feedback visual rapido em toda alteracao e reduzir regressao de interface/gameplay.

## Registro obrigatorio de mudancas

- Sempre que qualquer alteracao for feita, registrar o que foi alterado em `CHANGELOG.md` na secao da data atual.
- O registro deve listar: arquivos alterados, comportamento esperado e resultado de validacao (build/execucao).

## Arquitetura obrigatoria e atualizada

- Manter `ARCHITECTURE.md` sempre atualizado a cada mudanca estrutural de fluxo, dados, UI ou regras de jogo.
- Sempre descrever no documento: telas/fluxo, principais modulos JS, regras de geracao de fase e sistema de dicas.

## APK debug obrigatorio

- Sempre que houver alteracao no projeto e for solicitado build Android, atualizar o arquivo `MenorGames-debug.apk`.
- Fluxo padrao:
	- Gerar APK debug com `android\\gradlew.bat assembleDebug`.
	- Copiar/renomear `android\\app\\build\\outputs\\apk\\debug\\app-debug.apk` para `MenorGames-debug.apk` na raiz do projeto (`menor games`).
- Entregar sempre o caminho final do APK nomeado na raiz do projeto: `MenorGames-debug.apk`.
