# Menor Games

Prototipo de jogo de caca palavras inspirado nas referencias enviadas.

## Stack atual

- Vite
- JavaScript (vanilla)
- CSS

## Como rodar no Windows

1. Instalar dependencias:

```bash
npm install
```

2. Rodar em desenvolvimento:

```bash
npm run dev
```

Para testar em celular na mesma rede Wi-Fi:

```bash
npm run dev:host
```

3. Abrir no navegador:

- http://localhost:5173

## Ranking real (sync automatica por ID)

1. Subir API local de ranking:

```bash
npm run dev:api
```

2. O jogo sincroniza automaticamente (a cada 2 minutos) usando o ID unico da conta.

3. No Perfil, o jogador pode mudar nome/avatar e usar Sincronizar agora para forcar envio imediato.

Observacoes:

- O top 10 agora vem do servidor (sem bots locais).
- Cada ID de conta e atualizado (upsert), sem duplicar jogador quando ele muda nome.
- O ranking e ordenado por pontos (desempate por fase e atualizacao).

## Amigos (publico, por ID)

- Tela de amigos permite adicionar por ID.
- A listagem de amigos mostra nome, fase e pontos.
- O fluxo de amigos usa o mesmo backend publico do ranking.

## Regra atual de QA publico (2 Androids)

- Para os testes entre dispositivos diferentes, manter tudo apontando para Render.
- URL oficial de testes publicos:
	- `https://menor-games-public-ranking.onrender.com`
- Nao depender de tunel temporario para validar ranking/amigos no card de QA.

## Backend publico (teste entre voces)

Opcao recomendada (Render):

1. Subir este repositorio no GitHub.
2. No Render, criar novo Web Service a partir do repo.
3. O arquivo `render.yaml` ja define build/start/healthcheck e disco persistente.
4. Quando publicar, copie a URL publica da API (ex.: `https://menor-games-ranking-api.onrender.com`).
5. No frontend, definir `VITE_RANKING_API_URL` com essa URL para build final do app.

Teste rapido sem deploy (tunel temporario):

```bash
npm run dev:api
npx localtunnel --port 8787
```

Use a URL gerada pelo localtunnel como endpoint da API para teste temporario.

## Build de producao

```bash
npm run build
npm run preview
```

## Estrutura

- `src/main.js`: logica do jogo (selecao de letras, validacao e progresso)
- `src/style.css`: visual base do prototipo
- `.vscode/tasks.json`: task de dev no Windows com `npm.cmd`
- `.vscode/launch.json`: configuracao de debug com Chrome

## Gameplay atual

- Letras disponiveis: A, A, C, M, P
- Palavras alvo: AMA, CAM, CAMA, MAPA, CAPA
- Clique nas letras para montar a palavra.
- Use `Enviar` para validar e `Limpar` para reiniciar a tentativa.

## Proximo passo para Android

A base esta pronta para encapsular com Capacitor em seguida, mantendo o mesmo front-end:

- Instalar Capacitor
- Gerar projeto Android
- Testar no emulador/dispositivo
