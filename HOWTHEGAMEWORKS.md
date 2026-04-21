# How The Game Works

## 1. Objetivo do jogo

Menor Games e um caca palavras com tabuleiro conectado e selecao por roda de letras.
Em cada fase, o jogador deve descobrir todas as palavras validas daquele nivel.

## 2. Fluxo principal

1. Splash screen
- Exibe carregamento inicial.

2. Menu inicial
- Mostra a fase atual.
- Permite escolher qualquer fase entre 1 e 2000.

3. Carregamento de fase
- Gera o puzzle com regras de dificuldade e diversidade.

4. Gameplay
- O jogador arrasta letras na roda para formar uma tentativa.
- A tentativa so valida se for palavra exata da fase.
- Ao validar, a palavra e marcada no tabuleiro.

5. Conclusao
- Ao encontrar todas as palavras, abre popup de vitoria.
- Jogador pode avancar para a proxima fase.

## 3. Roda de letras e dificuldade

A roda tem tamanho fixo por faixa de nivel:

- Fases 1 a 15: 4 letras
- Fases 16 a 24: 5 letras
- Fases 25 a 34: 6 letras
- Fases 35 a 59: 7 letras
- Fases 60+: 8 letras

As palavras da fase sempre sao formaveis apenas com as letras da roda.

## 4. Geracao procedural das fases

As 2000 fases sao geradas sob demanda por algoritmo, com base em banco de palavras por tier.

Regras principais:

- Comprimento permitido por palavra: 3, 4, 5 ou 6 letras
- Frequencia de tamanho de palavra muda por faixa de fase
- Conectividade obrigatoria no tabuleiro (cruzadinha real)
- Sem nomes proprios no dicionario

## 5. Regras de diversidade (anti repeticao)

Para evitar repeticao perceptivel:

1. Repeticao por palavra em janela curta (cooldown)
- roda 4: 10 fases
- roda 5: 8 fases
- roda 6: 7 fases
- roda 7: 6 fases
- roda 8: 5 fases

2. Repeticao de assinatura de fase (conjunto de palavras)
- roda 4: ultimas 10 fases
- roda 5: ultimas 14 fases
- roda 6: ultimas 18 fases
- roda 7: ultimas 22 fases
- roda 8: ultimas 28 fases

3. Bloqueio de fase vizinha
- Palavras da fase imediatamente anterior nao podem ser reutilizadas na fase seguinte.

## 6. Regras de validacao de palavra

- A tentativa deve ser palavra exata da fase.
- Palavra invertida nao e aceita como equivalente.
  Exemplo: ROMA nao valida como AMOR.

## 7. Sistema de acentos

O jogo separa comparacao interna e exibicao visual:

- Internamente, texto e normalizado para comparacao.
- Visualmente, o tabuleiro e mensagens preservam acento.
  Exemplos: MÃO, PÃO, POÇO.

Regra de cruzamento com acento:

- Intersecao so e valida se letra visual tambem coincidir.
- Se houver conflito visual de acento na mesma celula, a fase e descartada e regenerada.

## 8. Sistema de dicas

- Jogador inicia com 5 dicas.
- Cada dica revela exatamente 1 letra nova.
- Dica nunca revela letra ja visivel por palavra resolvida ou dica anterior.
- Se todas letras possiveis ja estiverem visiveis, dica nao e consumida.
- Mensagem exibida: "Todas as letras ja foram descobertas. Nao e possivel usar mais dicas."

Economia de dicas:

- Ver anuncio simulado: +1
- Compra simulada: +5

## 9. Layout e responsividade

O layout foi otimizado para celular:

- Tabuleiro maior para leitura e toque
- Roda menor para nao dominar a tela
- Botoes e area de acao mais abaixo
- Safe areas e viewport-fit para melhor uso de tela

## 10. Fundo por fase

O fundo de gameplay rotaciona automaticamente por fase.

Regra atual:

- Prioriza imagens canva-2 ate canva-10
- Se nao existirem todas, usa as disponiveis
- Quando chegar ao fim da lista, volta ao inicio (loop)

Isso deixa pronto para adicionar mais fundos depois sem mudar logica.

## 11. Ferramentas de debug e auditoria

O jogo expoe utilitarios em window.__MENOR_DEBUG__ para validar comportamento.

Exemplos de auditoria:

- Geracao e consistencia de fases
- Repeticao entre fases
- Validacao de candidatas
- Diagnostico de dicas
- Rotacao de fundos

## 12. Criterios de qualidade usados

- Build web compilando com sucesso
- Auditorias de 2000 fases sem falhas criticas
- Sem repeticao curta abaixo do cooldown
- Sem gasto de dica quando nao ha mais letras ocultas
- Regras de acentuacao mantidas em exibicao e cruzamentos
