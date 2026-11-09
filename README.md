# Agiliza Incorporadora · protótipo

Protótipo navegável (somente front) do app de loteamentos da Agiliza Incorporadora.
Imagens geradas por computador e dados fictícios, apenas para demonstração.

## Telas
- `#/` · início com os loteamentos
- `#/loteamento` · página do loteamento
- `#/mapa` · mapa com as abas Mapa, Obra, Comparar e Corretor

## Arquivos
- `index.html` · página principal
- `css/style.css` · visual
- `js/app.js` · funcionamento das telas
- `data/lotes.json` · lotes fictícios (quadra, número, status, medidas, coordenadas)
- `img/` · imagens aéreas, capas e ícones
- `manifest.json` e `sw.js` · permitem adicionar à tela inicial do celular

## WhatsApp do corretor
No início de `js/app.js`, preencha `whatsapp` com o número do plantão
(só números, com 55 e DDD, ex.: `5549999999999`). Vazio = modo demonstração.

## Publicar no GitHub Pages
1. Suba todos os arquivos desta pasta para a raiz de um repositório.
2. Em **Settings → Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. Em alguns minutos o site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.
