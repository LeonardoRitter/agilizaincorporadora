/* =========================================================
   Agiliza Incorporadora · protótipo navegável (somente front)
   Telas: #/ (início) · #/loteamento · #/mapa
   Dados fictícios em data/lotes.json
   ========================================================= */
'use strict';
(function () {
  const app = document.getElementById('app');

  /* ---------- Configuração ---------- */
  const CONFIG = {
    // WhatsApp do corretor de plantão: só números, com 55 + DDD. Ex.: '5549999999999'.
    // Vazio = modo demonstração (mostra a mensagem, mas não abre o WhatsApp).
    whatsapp: '',
    nomeLoteamento: 'Loteamento Exemplo'
  };

  const IMG = {
    orto: 'img/ortomosaico.jpg',
    relevo: 'img/curvas-de-nivel.png',
    voos: [
      { src: 'img/voo-marco.jpg', data: 'março de 2026', titulo: 'Terraplanagem do terreno' },
      { src: 'img/voo-julho.jpg', data: 'julho de 2026', titulo: 'Vias abertas e lotes demarcados' },
      { src: 'img/ortomosaico.jpg', data: 'novembro de 2026', titulo: 'Vias pavimentadas e praça' }
    ]
  };

  const LOTEAMENTOS = [
    { nome: 'Loteamento\nExemplo', fase: 'LANÇAMENTO', grupo: 'lanc', cidade: 'Maravilha', area: '250 m²', preco: 'R$ 190 mil', capa: 'img/capa-1.jpg', disp: null, pct: null },
    { nome: 'Residencial\nModelo', fase: 'EM OBRAS', grupo: 'obras', cidade: 'Paraíso', area: '280 m²', preco: 'R$ 165 mil', capa: 'img/capa-2.jpg', disp: '58 de 120 disponíveis', pct: 48 },
    { nome: 'Jardim\nDemonstração', fase: 'CONCLUÍDO', grupo: 'fim', cidade: 'Dionísio C.', area: '360 m²', preco: 'R$ 240 mil', capa: 'img/capa-3.jpg', disp: 'Últimas 9 unidades', pct: 11 }
  ];

  const GALERIA = [
    { src: 'img/capa-1.jpg', pos: '50% 40%', legenda: 'Vista aérea' },
    { src: IMG.orto, pos: '50% 28%', legenda: 'Ortomosaico' },
    { src: IMG.orto, pos: '40% 76%', legenda: 'Área de lazer' },
    { src: IMG.orto, pos: '100% 50%', legenda: 'Entorno' }
  ];

  const EST = {
    d: { nome: 'Disponível', ab: 'Disp.', mapa: 'rgba(45,212,167,.72)', cor: '#2DD4A7', txt: '#0B1F4B', btn: '#12805C', btnTxt: '#FFFFFF' },
    r: { nome: 'Reservado', ab: 'Res.', mapa: 'rgba(244,182,63,.9)', cor: '#F4B63F', txt: '#0B1F4B', btn: '#F4B63F', btnTxt: '#0B1F4B' },
    v: { nome: 'Vendido', ab: 'Vend.', mapa: 'rgba(11,31,75,.68)', cor: '#8592AD', txt: '#FFFFFF', btn: '#5A6785', btnTxt: '#FFFFFF' }
  };

  const PERGUNTAS = [
    { t: 'Quanto você quer investir?', k: 'orc', ops: [['a', 'Até R$ 205 mil'], ['b', 'Até R$ 225 mil'], ['c', 'Quero ver todas as opções']] },
    { t: 'O que mais importa no seu lote?', k: 'prio', ops: [['sol', 'Sol na frente da casa'], ['lazer', 'Perto da praça'], ['plano', 'Terreno mais plano'], ['esquina', 'Lote de esquina']] },
    { t: 'Prefere um lote…', k: 'tam', ops: [['compacto', 'Mais em conta'], ['amplo', 'O maior possível']] }
  ];

  const MUNDO = { w: 600, h: 1240 };

  const svg = (d, t, extra) => `<svg width="${t || 20}" height="${t || 20}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra || ''}>${d}</svg>`;
  const ICO = {
    voltar: svg('<path d="M15 18l-6-6 6-6"/>'),
    avancar: svg('<path d="M9 18l6-6-6-6"/>'),
    seta: svg('<path d="M7 17L17 7M8 7h9v9"/>', 22),
    mais: svg('<path d="M12 5v14M5 12h14"/>', 22),
    menos: svg('<path d="M5 12h14"/>', 22),
    fechar: svg('<path d="M6 6l12 12M18 6L6 18"/>', 18),
    gps: svg('<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>', 22),
    relevo: svg('<path d="M3 15c3-5 6-7 9-7s6 2 9 7"/><path d="M7 15c2-3 3-4 5-4s3 1 5 4"/><path d="M3 20h18"/>', 22),
    arvore: svg('<path d="M12 22v-6M7 16h10l-3-4h2l-4-5h2l-2-4-2 4h2l-4 5h2z"/>', 22),
    check: svg('<path d="M5 13l4 4L19 7"/>', 17, 'stroke="#F4B63F" stroke-width="3"').replace('stroke="currentColor" stroke-width="2" ', ''),
    coracao: svg('<path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/>', 20),
    coracaoCheio: svg('<path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z" fill="#F4B63F" stroke="#F4B63F"/>', 20),
    pin: svg('<path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>', 24, 'stroke="#F4B63F" stroke-width="1.8"').replace('stroke="currentColor" stroke-width="2" ', ''),
    area: svg('<path d="M4 20L20 4M20 10V4h-6M4 14v6h6"/>', 24, 'stroke="#F4B63F" stroke-width="1.8"').replace('stroke="currentColor" stroke-width="2" ', ''),
    sol: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>', 24, 'stroke="#F4B63F" stroke-width="1.8"').replace('stroke="currentColor" stroke-width="2" ', ''),
    arvoreA: svg('<path d="M12 22v-6M7 16h10l-3-4h2l-4-5h2l-2-4-2 4h2l-4 5h2z"/>', 24, 'stroke="#F4B63F" stroke-width="1.8"').replace('stroke="currentColor" stroke-width="2" ', '')
  };

  /* ---------- Estado ---------- */
  const S = {
    dados: null,
    agora: Date.now(),
    // início
    filtroIni: 'todos', iniI: 0,
    // página do loteamento
    foto: 0,
    // mapa
    v: null, tab: 'mapa', filtro: null, sel: null, passo: 'card', deSim: false, hora: 1,
    gps: false, relevo: false, lazer: false, poi: null,
    guia: false, gp: 0, orc: null, prio: null, tam: null, rkOn: false, rkI: 0,
    favs: [], ent: 20, prazo: 120, vooI: 2,
    nome: '', tel: '', erro: false,
    // corretor
    muda: {}, res: {}, delta: {}, quadra: 'A', selN: 1,
    leads: [
      { nome: 'Cliente Exemplo 1', lote: 'Lote 2, Quadra D', feito: false },
      { nome: 'Cliente Exemplo 2', lote: 'Lote 6, Quadra B', feito: true }
    ]
  };

  /* ---------- Utilidades ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const brl = (v) => 'R$ ' + Math.round(v).toLocaleString('pt-BR');
  const mil = (v) => 'R$ ' + Math.round(v / 1000) + ' mil';
  const virg = (x) => String(x).replace('.', ',');
  const num2 = (x) => x.toFixed(2).replace('.', ',');
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const $ = (id) => document.getElementById(id);
  const setTxt = (id, t) => { const el = $(id); if (el) el.textContent = t; };
  const idL = (l) => l.q + l.n;
  const esq = (l) => l.n % 4 === 1 || l.n % 4 === 0;
  const decl = (l) => Math.round(l.dec / 3 * 10) / 10;
  const lotes = () => (S.dados ? S.dados.lotes : []);
  const acha = (i) => lotes().find((l) => idL(l) === i);
  const centro = (l) => [l.p.reduce((a, p) => a + p[0], 0) / 4, l.p.reduce((a, p) => a + p[1], 0) / 4];

  function stat(l) {
    const i = idL(l), s = S.muda[i] || l.s;
    return s === 'r' && S.res[i] && S.res[i] < S.agora ? 'd' : s;
  }
  const conta = (s) => lotes().filter((l) => stat(l) === s).length;
  function valor(l) {
    const base = l.a * 740 * (esq(l) ? 1.08 : 1) * (1 + ('ABCDEFGH'.indexOf(l.q) >> 1) * 0.03);
    return Math.round(base / 500) * 500 + (S.delta[idL(l)] || 0);
  }
  function timer(i) {
    const t = S.res[i];
    if (!t) return '';
    const s = Math.max(0, Math.floor((t - S.agora) / 1000)), p = (x) => String(x).padStart(2, '0');
    return p(Math.floor(s / 3600)) + ':' + p(Math.floor(s / 60) % 60) + ':' + p(s % 60);
  }
  const loteGps = () => lotes().find((l) => l.q === 'C' && l.n === 6);

  /* ---------- Rotas ---------- */
  function rota() {
    const h = location.hash;
    if (h.indexOf('#/loteamento') === 0) return 'lot';
    if (h.indexOf('#/mapa') === 0) return 'mapa';
    return 'inicio';
  }
  function render() {
    const r = rota();
    if (r === 'inicio') telaInicio();
    else if (r === 'lot') telaLot();
    else telaMapa();
  }

  /* =========================================================
     TELA 1 · INÍCIO
     ========================================================= */
  function listaIni() {
    return S.filtroIni === 'todos' ? LOTEAMENTOS : LOTEAMENTOS.filter((x) => x.grupo === S.filtroIni);
  }
  function telaInicio() {
    app.innerHTML = `
      <section class="tela inicio">
        ${LOTEAMENTOS.map((c, i) => `<img class="capa" data-capa="${i}" src="${c.capa}" alt="Vista aérea ilustrativa de ${esc(c.nome.replace('\n', ' '))}">`).join('')}
        <div class="sombra-topo"></div>
        <div class="sombra-base"></div>
        <header class="ini-topo" id="iniTopo"></header>
        <div class="ini-base" id="iniBase"></div>
      </section>`;
    atualizarInicio();
  }
  function atualizarInicio() {
    const lista = listaIni();
    const i = Math.min(S.iniI, lista.length - 1);
    const at = lista[i];
    app.querySelectorAll('[data-capa]').forEach((im) => im.classList.toggle('on', LOTEAMENTOS[+im.dataset.capa] === at));
    const opts = [['todos', 'Todos'], ['lanc', 'Lançamentos'], ['obras', 'Obras'], ['fim', 'Prontos']];
    const pad = (n) => String(n).padStart(2, '0');
    $('iniTopo').innerHTML = `
      <div class="linha">
        <div class="marca">AGILIZA<small>INCORPORADORA</small></div>
        <span class="mono">${pad(i + 1)} / ${pad(lista.length)}</span>
      </div>
      <div class="chips">${opts.map((o) => `<button type="button" class="chip${S.filtroIni === o[0] ? ' on' : ''}" aria-pressed="${S.filtroIni === o[0]}" data-a="filtroIni" data-v="${o[0]}">${o[1]}</button>`).join('')}</div>`;
    const total = lotes().length;
    const disp = at.disp || `${conta('d')} de ${total} disponíveis`;
    const pct = at.pct != null ? at.pct : Math.round(conta('d') / Math.max(1, total) * 100);
    $('iniBase').innerHTML = `
      <div class="ini-nome">
        <div>
          <div class="mono amarelo">${at.fase}</div>
          <h1>${esc(at.nome)}</h1>
        </div>
        <div class="setas">
          <button type="button" data-a="iniAnt" aria-label="Loteamento anterior">${ICO.voltar}</button>
          <button type="button" data-a="iniProx" aria-label="Próximo loteamento">${ICO.avancar}</button>
        </div>
      </div>
      <dl class="info3">
        <div><dt>Cidade</dt><dd>${at.cidade}</dd></div>
        <div><dt>Lotes desde</dt><dd>${at.area}</dd></div>
        <div><dt>A partir de</dt><dd>${at.preco}</dd></div>
      </dl>
      <div>
        <div class="disp-txt mono"><span>${disp}</span><span>em até 120x</span></div>
        <div class="trilho"><div style="width:${pct}%"></div></div>
      </div>
      <a class="btn pri cta" href="#/loteamento">Explorar o terreno ${ICO.seta}</a>`;
  }

  /* =========================================================
     TELA 2 · PÁGINA DO LOTEAMENTO
     ========================================================= */
  function telaLot() {
    const total = lotes().length, d = conta('d'), r = conta('r'), v = conta('v');
    const etapas = [['Terraplanagem', 100], ['Abertura das vias', 80], ['Água e esgoto', 45], ['Pavimentação', 10]];
    app.innerHTML = `
      <section class="tela lot" id="lotScroll">
        <div class="galeria">
          ${GALERIA.map((f, i) => `<img data-foto="${i}" src="${f.src}" style="object-position:${f.pos}" alt="${f.legenda} (imagem ilustrativa)">`).join('')}
          <div class="sombra-topo"></div>
          <a class="btn-ico escuro voltar" href="#/" aria-label="Voltar para o início">${ICO.voltar}</a>
          <div class="legenda mono" id="legenda"></div>
        </div>
        <div class="miniaturas">
          ${GALERIA.map((f, i) => `<button type="button" data-a="foto" data-v="${i}" aria-label="Ver foto: ${f.legenda}"><img src="${f.src}" style="object-position:${f.pos}" alt=""></button>`).join('')}
        </div>
        <div class="lot-corpo">
          <div>
            <div class="mono amarelo">LANÇAMENTO · MARAVILHA, SC</div>
            <h1>${CONFIG.nomeLoteamento}</h1>
          </div>
          <ul class="destaques">
            <li>${ICO.pin}Na área de expansão da cidade</li>
            <li>${ICO.area}Lotes desde 250 m², em até 120x</li>
            <li>${ICO.sol}Veja o sol em cada lote, antes de comprar</li>
            <li>${ICO.arvoreA}Praça, playground e vias arborizadas</li>
          </ul>
          <a class="mapa-card" href="#/mapa" data-a="irMapa">
            <img src="${IMG.orto}" alt="Foto aérea ilustrativa do loteamento">
            <img class="rel" src="${IMG.relevo}" alt="">
            <span class="faixa">Entrar no mapa ${ICO.seta}</span>
          </a>
          <div>
            <div class="sec-tit"><h2>Agora</h2><span class="mono">${total} LOTES</span></div>
            <div class="status-barra" role="img" aria-label="${d} disponíveis, ${r} reservados, ${v} vendidos">
              <div style="flex:${d};background:${EST.d.cor}"></div>
              <div style="flex:${r};background:${EST.r.cor}"></div>
              <div style="flex:${v};background:${EST.v.btn}"></div>
            </div>
            <div class="status-num">
              <div><strong>${d}</strong>Disponíveis</div>
              <div><strong>${r}</strong>Reservados</div>
              <div><strong>${v}</strong>Vendidos</div>
            </div>
          </div>
          <div class="selo-bloco">
            <img src="${IMG.relevo}" alt="">
            <div>
              <div class="mono amarelo">SELO TÉCNICO AGILIZA</div>
              <h2>O lote que você vê é o lote que foi medido.</h2>
              <p>Topografia e documentação com responsabilidade técnica e respaldo legal, da planta ao contrato.</p>
            </div>
          </div>
          <div>
            <div class="sec-tit"><h2>Obra</h2><button type="button" class="btn-link" data-a="irObra">Ver fotos do drone</button></div>
            <div class="etapas">
              ${etapas.map((e) => `<div class="etapa"><div class="disp-txt"><span>${e[0]}</span><span class="mono">${e[1]}%</span></div><div class="trilho"><div style="width:${e[1]}%"></div></div></div>`).join('')}
            </div>
          </div>
          <a class="btn sec" href="#/mapa" data-a="irMapa">Agendar visita com o corretor de plantão</a>
          <p class="aviso">Imagens geradas por computador; nomes, valores e percentuais fictícios, apenas para demonstração.</p>
        </div>
      </section>`;
    atualizarGaleria();
  }
  function atualizarGaleria() {
    app.querySelectorAll('[data-foto]').forEach((im) => im.classList.toggle('on', +im.dataset.foto === S.foto));
    app.querySelectorAll('.miniaturas button').forEach((b) => {
      const on = +b.dataset.v === S.foto;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on);
    });
    setTxt('legenda', GALERIA[S.foto].legenda.toUpperCase());
  }

  /* =========================================================
     TELA 3 · MAPA
     ========================================================= */
  const tam = () => ({ w: app.clientWidth, h: app.clientHeight });
  const sMin = () => { const { w, h } = tam(); return Math.max(w / MUNDO.w, h / MUNDO.h); };
  function limita(v) {
    const { w, h } = tam();
    return { s: v.s, x: Math.min(0, Math.max(w - MUNDO.w * v.s, v.x)), y: Math.min(0, Math.max(h - MUNDO.h * v.s, v.y)) };
  }
  function vInicial() {
    const { w, h } = tam();
    const s = Math.max(w * 1.14 / MUNDO.w, h / MUNDO.h);
    return limita({ s, x: (w - MUNDO.w * s) / 2, y: (h - MUNDO.h * s) / 2 });
  }
  const voaXY = (x, y, s, py) => limita({ s, x: tam().w / 2 - x * s, y: py - y * s });
  const voa = (l, s, py) => { const c = centro(l); return voaXY(c[0], c[1], s, py); };
  function zoomEm(f, px, py) {
    const { w, h } = tam();
    if (px == null) { px = w / 2; py = h / 2; }
    const v = S.v, s = clamp(v.s * f, sMin(), 3.2), k = s / v.s;
    S.v = limita({ s, x: px - (px - v.x) * k, y: py - (py - v.y) * k });
    aplicaV(false);
  }
  function aplicaV(arrastando) {
    const m = $('mundo');
    if (!m) return;
    m.classList.toggle('arrastando', !!arrastando);
    m.style.transform = `translate(${S.v.x}px, ${S.v.y}px) scale(${S.v.s})`;
    m.style.setProperty('--inv', 1 / S.v.s);
  }

  function ranking() {
    const d = S.dados;
    if (!d || !S.rkOn) return [];
    const praca = d.pois.find((p) => p.id === 1);
    const lim = { a: 205000, b: 225000, c: 1e9 }[S.orc];
    const base = d.lotes.filter((l) => stat(l) === 'd');
    const dentro = base.filter((l) => valor(l) <= lim);
    const pool = dentro.length >= 3 ? dentro : base;
    const dist = (l) => { const c = centro(l); return Math.hypot(c[0] - praca.x, c[1] - praca.y) * 0.33; };
    const nota = (l) => {
      let n = 0;
      if (S.prio === 'lazer') n += 60 * (1 - dist(l) / 280);
      if (S.prio === 'plano') n += 60 * (1 - Math.min(l.dec, 12) / 12);
      if (S.prio === 'esquina') n += esq(l) ? 60 : 0;
      if (S.prio === 'sol') n += l.n <= 4 ? 60 : 0;
      n += S.tam === 'amplo' ? (l.a - 250) * 2 : 270 - l.a;
      return n;
    };
    return pool.slice().sort((a, b) => nota(b) - nota(a)).slice(0, 3).map((l) => {
      const m = [];
      if (valor(l) <= lim && S.orc !== 'c') m.push('Dentro do seu orçamento');
      if (S.prio === 'lazer') m.push('A ' + Math.round(dist(l)) + ' m da praça');
      if (S.prio === 'plano') m.push('Terreno com ' + virg(decl(l)) + '% de declividade');
      if (S.prio === 'esquina' && esq(l)) m.push('Lote de esquina');
      if (S.prio === 'sol' && l.n <= 4) m.push('Frente para o norte, com mais sol');
      m.push(virg(l.a) + ' m², com ' + virg(l.fr.toFixed(1)) + ' m de frente');
      return { l, motivos: m.slice(0, 3) };
    });
  }

  function telaMapa() {
    if (!S.v) S.v = vInicial();
    app.innerHTML = `
      <section class="tela mapa" id="mapa">
        <div class="mundo" id="mundo">
          <img class="orto" src="${IMG.orto}" alt="Foto aérea ilustrativa do loteamento" draggable="false">
          <img class="relevo" id="relevo" src="${IMG.relevo}" alt="" draggable="false">
          <div id="camLotes"></div>
          <div id="camPinos"></div>
          <div id="camGps"></div>
        </div>
        <div id="camUi"></div>
      </section>`;
    atualizarMapa();
  }

  function htmlLotes(rk, rkI) {
    return lotes().map((l) => {
      const xs = l.p.map((p) => p[0]), ys = l.p.map((p) => p[1]);
      const x = Math.min(...xs), y = Math.min(...ys), w = Math.max(...xs) - x, h = Math.max(...ys) - y;
      const s = stat(l), e = EST[s], ativo = idL(l) === S.sel;
      const pos = rk.findIndex((r) => r.l === l);
      let bg = ativo ? '#FFFFFF' : e.mapa, fg = ativo ? '#0B1F4B' : e.txt, rot = l.n;
      let op = S.filtro && S.filtro !== s ? 0.14 : 1;
      if (S.rkOn) {
        op = 1;
        if (pos === rkI && !S.sel) { bg = '#F4B63F'; fg = '#0B1F4B'; rot = pos + 1; }
        else if (pos >= 0) { bg = '#FFFFFF'; fg = '#0B1F4B'; rot = pos + 1; }
        else if (!ativo) { bg = 'rgba(11,31,75,.55)'; fg = 'rgba(255,255,255,.65)'; }
      }
      const clip = 'polygon(' + l.p.map((p) => (p[0] - x).toFixed(1) + 'px ' + (p[1] - y).toFixed(1) + 'px').join(',') + ')';
      return `<button type="button" class="lote" data-a="lote" data-v="${idL(l)}" aria-label="Quadra ${l.q}, lote ${l.n}, ${e.nome}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${bg};color:${fg};opacity:${op};clip-path:${clip};-webkit-clip-path:${clip}">${rot}</button>`;
    }).join('');
  }

  function htmlPinos() {
    if (!S.lazer || !S.dados) return '';
    return S.dados.pois.map((p) => {
      const on = S.poi === p.id;
      return `<div class="pino" style="left:${p.x}px;top:${p.y}px">
        <button type="button" class="pino-btn${on ? ' on' : ''}" data-a="poi" data-v="${p.id}" aria-label="${esc(p.nome)}"><span>${p.id}</span></button>
        ${on ? `<span class="pino-nome">${esc(p.nome)}</span>` : ''}
      </div>`;
    }).join('');
  }

  function htmlTopo() {
    const g = loteGps();
    return `<div class="topo ui">
      <div class="topo-linha">
        <a class="btn-ico escuro" href="#/loteamento" aria-label="Voltar para a página do loteamento">${ICO.voltar}</a>
        <div class="marca-caixa"><span class="marca">AGILIZA</span><span>${CONFIG.nomeLoteamento}</span></div>
      </div>
      <div class="chips">${['d', 'r', 'v'].map((s) => `<button type="button" class="chip-st${S.filtro === s ? ' on' : ''}" aria-pressed="${S.filtro === s}" data-a="filtro" data-v="${s}"><span class="qd" style="background:${EST[s].cor}"></span>${EST[s].nome} ${conta(s)}</button>`).join('')}</div>
      ${S.gps && g ? `<div class="gps-faixa"><div><strong>Você está no Lote ${g.n}, Quadra ${g.q}</strong><small>Posição aproximada (simulada no protótipo)</small></div><button type="button" class="btn-branco" data-a="verGps">Ver lote</button></div>` : ''}
    </div>`;
  }

  function htmlCtrl() {
    const b = (a, label, ico, on, extra) => `<button type="button" class="btn-mapa${extra || ''}${on ? ' on' : ''}" data-a="${a}" aria-label="${label}"${on != null ? ` aria-pressed="${!!on}"` : ''}>${ico}</button>`;
    return `<div class="ctrl ui">
        ${b('zoomIn', 'Aproximar', ICO.mais)}
        ${b('zoomOut', 'Afastar', ICO.menos)}
        ${b('relevo', 'Mostrar curvas de nível', ICO.relevo, S.relevo)}
        ${b('lazer', 'Mostrar área de lazer', ICO.arvore, S.lazer)}
        ${b('gps', 'Estou no terreno', ICO.gps, S.gps, ' gps')}
      </div>
      ${S.lazer ? '' : '<button type="button" class="btn pri ajuda ui" data-a="guia">Me ajude a escolher</button>'}`;
  }

  function htmlLazer() {
    return `<div class="painel lazer-lista ui">
      <h2>Lazer e serviços</h2>
      ${S.dados.pois.map((p) => `<button type="button" class="${S.poi === p.id ? 'on' : ''}" data-a="poi" data-v="${p.id}"><span class="num">0${p.id}</span>${esc(p.nome)}</button>`).join('')}
    </div>`;
  }

  function htmlRanking(rk, rkI) {
    const a = rk[rkI];
    return `<div class="painel ui">
      <div class="mono amarelo">Opção ${rkI + 1} de ${rk.length} para você</div>
      <h2>Lote ${a.l.n}, Quadra ${a.l.q}</h2>
      <ul class="motivos">${a.motivos.map((m) => `<li>${ICO.check}${m}</li>`).join('')}</ul>
      <div class="preco-rk">${brl(valor(a.l))}</div>
      <div class="linha-btn">
        <button type="button" class="btn sec" data-a="proxRk">Ver outra</button>
        <button type="button" class="btn pri" data-a="abrirRk">Abrir este lote</button>
      </div>
      <button type="button" class="btn-link" data-a="sairRk">Ver todos os lotes</button>
    </div>`;
  }

  function desenho(l) {
    const sol = [{ x: 0.85, y: 0.45 }, { x: 0, y: 1 }, { x: -0.85, y: 0.45 }][S.hora];
    const xs = l.p.map((p) => p[0]), ys = l.p.map((p) => p[1]);
    const mx = (Math.min(...xs) + Math.max(...xs)) / 2, my = (Math.min(...ys) + Math.max(...ys)) / 2;
    const k = Math.min(96 / (Math.max(...xs) - Math.min(...xs)), 126 / (Math.max(...ys) - Math.min(...ys)));
    const fit = l.p.map((p) => [75 + (p[0] - mx) * k, 95 + (p[1] - my) * k]);
    const str = (a) => a.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
    const casa = [[58, 78], [92, 78], [92, 118], [58, 118]];
    const sombra = casa.map((p) => [p[0] - sol.x * 16, p[1] + sol.y * 16]);
    const frenteNorte = l.n <= 4;
    return {
      svg: `<svg width="150" height="190" viewBox="0 0 150 190" role="img" aria-label="Desenho do lote: frente ${num2(l.fr)} metros, lateral ${num2(l.ld)} metros">
        <polygon points="${str(fit)}" fill="#21407F" stroke="#FFFFFF" stroke-width="1.4"/>
        <polygon points="${str(sombra)}" fill="#000000" opacity=".5"/>
        <polygon points="${str(casa)}" fill="#DDE3EE"/>
        <circle cx="${(75 + sol.x * 62).toFixed(1)}" cy="${(95 - sol.y * 84).toFixed(1)}" r="8" fill="#F4B63F"/>
      </svg>`,
      topY: Math.min(fit[0][1], fit[1][1]) - 17,
      botY: Math.max(fit[2][1], fit[3][1]) + 3,
      lx: Math.min(fit[0][0], fit[3][0]) - 9,
      topTxt: num2(frenteNorte ? l.fr : l.fu) + ' m',
      botTxt: num2(frenteNorte ? l.fu : l.fr) + ' m',
      lado: frenteNorte ? 'na frente' : 'nos fundos'
    };
  }

  function corpoCard(l, s) {
    const d = desenho(l);
    const solTxt = ['De manhã, sol ' + d.lado + ' e na lateral leste.', 'Ao meio-dia, sol ' + d.lado + ' do lote.', 'No fim da tarde, sol ' + d.lado + ' e na lateral oeste.'][S.hora];
    const acoes = s === 'v'
      ? '<button type="button" class="btn sec" data-a="verDisp">Ver lotes disponíveis</button>'
      : `<div class="linha-btn"><button type="button" class="btn sec" data-a="simular">Simular</button><button type="button" class="btn pri" data-a="form">${s === 'r' ? 'Avise-me se liberar' : 'Falar com o corretor'}</button></div>`;
    return `
      <div class="card-lote">
        <div class="desenho">${d.svg}
          <div class="cota" style="top:${d.topY.toFixed(1)}px">${d.topTxt}</div>
          <div class="cota" style="top:${d.botY.toFixed(1)}px">${d.botTxt}</div>
          <div class="cota lat" style="left:${d.lx.toFixed(1)}px">${num2(l.ld)} m</div>
        </div>
        <dl class="dados">
          <div><dt>Preço</dt><dd class="grande">${s === 'v' ? 'Vendido' : brl(valor(l))}</dd></div>
          <div><dt>Área</dt><dd>${virg(l.a)} m²</dd></div>
          <div><dt>Declividade</dt><dd>${virg(decl(l))}%</dd></div>
          <div class="selo">Medido pela Agiliza</div>
        </dl>
      </div>
      <div class="horas" role="group" aria-label="Posição do sol">${['8h', '12h', '17h'].map((h, i) => `<button type="button" class="hora${S.hora === i ? ' on' : ''}" aria-pressed="${S.hora === i}" data-a="hora" data-v="${i}">${h}</button>`).join('')}</div>
      <p class="sol-txt">${solTxt}</p>
      ${acoes}`;
  }

  function corpoSim(l) {
    const v = valor(l), ent = v * S.ent / 100;
    return `
      <div class="sim-caixa"><div class="peq">Parcela mensal, sem juros nesta simulação</div><div class="parcela" id="simParcela">${brl((v - ent) / S.prazo)}</div></div>
      <div class="campo-range"><label for="ent"><span>Entrada (<span id="entPct">${S.ent}</span>%)</span><span id="simEntrada">${brl(ent)}</span></label><input id="ent" type="range" min="10" max="60" step="5" value="${S.ent}" data-in="ent"></div>
      <div class="campo-range"><label for="prz"><span>Prazo</span><span><span id="przTxt">${S.prazo}</span> meses</span></label><input id="prz" type="range" min="12" max="180" step="12" value="${S.prazo}" data-in="prazo"></div>
      <div class="linha-btn"><button type="button" class="btn sec" data-a="card">Voltar</button><button type="button" class="btn pri" data-a="formSim">Enviar ao corretor</button></div>`;
  }
  function atualizaSim() {
    const l = acha(S.sel);
    if (!l) return;
    const v = valor(l), ent = v * S.ent / 100;
    setTxt('simParcela', brl((v - ent) / S.prazo));
    setTxt('simEntrada', brl(ent));
    setTxt('entPct', S.ent);
    setTxt('przTxt', S.prazo);
  }

  function corpoForm() {
    return `
      <p class="txt">Preencha para falar com o corretor de plantão sobre este lote.</p>
      <div class="campo"><label for="fnome">Nome</label><input id="fnome" type="text" autocomplete="name" value="${esc(S.nome)}" data-in="nome"></div>
      <div class="campo"><label for="ftel">WhatsApp</label><input id="ftel" type="tel" inputmode="tel" autocomplete="tel" placeholder="(00) 00000-0000" value="${esc(S.tel)}" data-in="tel"></div>
      ${S.erro ? '<p class="erro" role="alert">Preencha seu nome e um WhatsApp com DDD.</p>' : ''}
      <button type="button" class="btn pri" data-a="enviar">Continuar no WhatsApp</button>
      <p class="mini">Ao continuar, você aceita a Política de Privacidade.</p>`;
  }

  function mensagem(l) {
    let m = `Olá! Meu nome é ${S.nome.trim()}. Tenho interesse no Lote ${l.n} da Quadra ${l.q} do ${CONFIG.nomeLoteamento}.`;
    if (S.deSim) {
      const v = valor(l), ent = v * S.ent / 100;
      m += ` Simulei entrada de ${brl(ent)} e ${S.prazo}x de ${brl((v - ent) / S.prazo)}.`;
    }
    return m;
  }

  function corpoOk(l) {
    const aberto = !!CONFIG.whatsapp;
    return `
      <p class="txt" style="color:#FFFFFF">Pronto, ${esc(S.nome.trim())}! ${aberto ? 'O WhatsApp do corretor foi aberto com a mensagem:' : 'Neste protótipo o WhatsApp não abre. No app final, abre com esta mensagem:'}</p>
      <div class="msg">${esc(mensagem(l))}</div>
      <p class="mini">Seu contato já apareceu na aba Corretor.</p>
      <button type="button" class="btn sec" data-a="fechar">Voltar ao mapa</button>`;
  }

  function htmlFolha(l) {
    const s = stat(l), e = EST[s], i = idL(l), fav = S.favs.indexOf(i) >= 0;
    const etiqueta = s === 'r' && S.res[i] ? `Reservado · libera em <span data-timer="${i}">${timer(i)}</span>` : e.nome;
    const corpo = { card: () => corpoCard(l, s), sim: () => corpoSim(l), form: corpoForm, ok: () => corpoOk(l) }[S.passo]();
    return `<div class="folha ui" role="dialog" aria-label="Lote ${l.n}, Quadra ${l.q}">
      <div class="folha-topo">
        <div>
          <span class="etq" style="background:${e.cor};color:#0B1F4B">${etiqueta}</span>
          <h2>Lote ${l.n}, Quadra ${l.q}</h2>
        </div>
        <div class="folha-acoes">
          <button type="button" class="btn-ico" data-a="fav" aria-label="${fav ? 'Remover da comparação' : 'Adicionar à comparação'}" aria-pressed="${fav}">${fav ? ICO.coracaoCheio : ICO.coracao}</button>
          <button type="button" class="btn-ico" data-a="fechar" aria-label="Fechar">${ICO.fechar}</button>
        </div>
      </div>
      ${corpo}
    </div>`;
  }

  function htmlGuia() {
    const pg = PERGUNTAS[Math.min(S.gp, 2)];
    return `<div class="guia ui" role="dialog" aria-label="Perguntas para escolher o lote">
      <img class="fundo" src="img/capa-1.jpg" alt="">
      <div class="fundo-grad"></div>
      <button type="button" class="btn-ico fechar-guia" data-a="fecharGuia" aria-label="Fechar perguntas">${ICO.fechar}</button>
      <div class="barras">${[0, 1, 2].map((i) => `<span class="${i <= S.gp ? 'on' : ''}"></span>`).join('')}</div>
      <h1>${pg.t}</h1>
      ${pg.ops.map((o) => `<button type="button" class="opcao" data-a="resp" data-v="${o[0]}">${o[1]}</button>`).join('')}
      ${S.gp > 0 ? '<button type="button" class="btn-link" data-a="voltarGuia">Voltar</button>' : ''}
    </div>`;
  }

  function htmlObra() {
    const f = IMG.voos[S.vooI];
    return `<div class="aba obra ui">
      <div class="obra-foto">
        ${IMG.voos.map((x, i) => `<img data-voo="${i}" class="${i === S.vooI ? 'on' : ''}" src="${x.src}" alt="Foto aérea ilustrativa: ${x.titulo}">`).join('')}
        <div class="obra-data" id="vooData">Voo de ${f.data}</div>
      </div>
      <div class="obra-txt">
        <h1 id="vooTit">${f.titulo}</h1>
        <label for="voo">Arraste para comparar os voos do drone</label>
        <input id="voo" type="range" min="0" max="2" step="1" value="${S.vooI}" data-in="voo">
        <div class="obra-meses"><span>Março</span><span>Julho</span><span>Novembro</span></div>
      </div>
    </div>`;
  }
  function atualizaObra() {
    app.querySelectorAll('[data-voo]').forEach((im) => im.classList.toggle('on', +im.dataset.voo === S.vooI));
    setTxt('vooData', 'Voo de ' + IMG.voos[S.vooI].data);
    setTxt('vooTit', IMG.voos[S.vooI].titulo);
  }

  function htmlComparar() {
    const favL = S.favs.map(acha).filter(Boolean);
    if (!favL.length) {
      return `<div class="aba claro ui"><h1>Comparar lotes</h1><div class="cartao-branco">Toque no coração de um lote, no mapa, para comparar aqui.</div></div>`;
    }
    const cols = `grid-template-columns:92px repeat(${favL.length}, minmax(0, 1fr))`;
    const linha = (nome, raw, fmt, menor) => {
      const alvo = menor ? Math.min(...raw) : Math.max(...raw);
      return `<div class="tab-linha" style="${cols}"><span class="nome">${nome}</span>${raw.map((x) => `<span class="${x === alvo && favL.length > 1 ? 'melhor' : ''}">${fmt(x)}</span>`).join('')}</div>`;
    };
    return `<div class="aba claro ui">
      <div><h1>Comparar lotes</h1><p class="txt" style="color:#0B1F4B">O melhor valor de cada linha fica destacado.</p></div>
      <div class="cartao-branco">
        <div class="tab-linha cab" style="${cols}"><span></span>${favL.map((l) => `<span class="cab-lote">${idL(l)}<button type="button" data-a="remFav" data-v="${idL(l)}" aria-label="Remover ${idL(l)} da comparação">×</button></span>`).join('')}</div>
        ${linha('Preço', favL.map(valor), mil, true)}
        ${linha('Área', favL.map((l) => l.a), (x) => virg(x) + ' m²', false)}
        ${linha('R$ por m²', favL.map((l) => Math.round(valor(l) / l.a)), (x) => 'R$ ' + x, true)}
        ${linha('Frente', favL.map((l) => l.fr), (x) => virg(x.toFixed(1)) + ' m', false)}
        ${linha('Declividade', favL.map(decl), (x) => virg(x) + '%', true)}
        <div class="tab-linha" style="${cols}"><span class="nome">Esquina</span>${favL.map((l) => `<span>${esq(l) ? 'Sim' : 'Não'}</span>`).join('')}</div>
      </div>
    </div>`;
  }

  function htmlCorretor() {
    const ed = lotes().find((x) => x.q === S.quadra && x.n === S.selN);
    const edI = ed ? idL(ed) : '';
    const edS = ed ? stat(ed) : 'd';
    return `<div class="aba claro ui">
      <div class="linha"><h1>Plantão</h1><span class="mini" style="color:#0B1F4B">No app final, só com login</span></div>
      <div class="resumo">${['d', 'r', 'v'].map((s) => `<div><strong>${conta(s)}</strong>${{ d: 'Disponíveis', r: 'Reservados', v: 'Vendidos' }[s]}</div>`).join('')}</div>
      <div class="quadras">${'ABCDEFGH'.split('').map((q) => `<button type="button" class="${S.quadra === q ? 'on' : ''}" aria-pressed="${S.quadra === q}" data-a="quadra" data-v="${q}" aria-label="Quadra ${q}">${q}</button>`).join('')}</div>
      <div class="grade">${lotes().filter((x) => x.q === S.quadra).map((x) => {
        const e = EST[stat(x)], on = x.n === S.selN;
        return `<button type="button" class="${on ? 'on' : ''}" aria-pressed="${on}" data-a="selN" data-v="${x.n}" aria-label="Lote ${x.n}, ${e.nome}" style="background:${e.btn};color:${e.btnTxt}"><strong>${x.n}</strong>${e.ab}</button>`;
      }).join('')}</div>
      ${ed ? `<div class="cartao-branco editor">
        <div class="editor-topo"><strong>Lote ${ed.n}, Quadra ${ed.q}</strong><span>${edS === 'r' && S.res[edI] ? `Libera em <span data-timer="${edI}">${timer(edI)}</span>` : ''}</span></div>
        <div class="status-btns">${[['d', 'Disponível'], ['r', 'Reservar 24h'], ['v', 'Vendido']].map((b) => {
          const on = edS === b[0], e = EST[b[0]];
          return `<button type="button" data-a="status" data-v="${b[0]}" aria-pressed="${on}" style="${on ? `background:${e.btn};color:${e.btnTxt};border-color:${e.btn}` : ''}">${b[1]}</button>`;
        }).join('')}</div>
        <div class="preco-edit"><button type="button" data-a="precoMenos" aria-label="Baixar o preço em mil reais">−</button><strong>${brl(valor(ed))}</strong><button type="button" data-a="precoMais" aria-label="Subir o preço em mil reais">+</button></div>
      </div>` : ''}
      <h2>Contatos recebidos</h2>
      ${S.leads.map((c, i) => `<div class="contato"><div><strong>${esc(c.nome)}</strong>${esc(c.lote)}</div><button type="button" class="${c.feito ? 'feito' : ''}" data-a="lead" data-v="${i}">${c.feito ? 'Atendido' : 'Marcar atendido'}</button></div>`).join('')}
    </div>`;
  }

  function atualizarMapa() {
    if (rota() !== 'mapa' || !$('mundo')) return;
    const rk = ranking();
    const rkI = rk.length ? S.rkI % rk.length : 0;
    const l = S.sel ? acha(S.sel) : null;
    $('camLotes').innerHTML = htmlLotes(rk, rkI);
    $('camPinos').innerHTML = htmlPinos();
    const g = loteGps();
    $('camGps').innerHTML = S.gps && g ? `<div class="gps-ponto" style="left:${centro(g)[0]}px;top:${centro(g)[1]}px"></div>` : '';
    $('relevo').classList.toggle('on', S.relevo);

    let ui = '';
    if (S.tab === 'mapa') {
      ui += htmlTopo();
      if (!l && !S.rkOn) ui += htmlCtrl();
      if (!l && S.rkOn && rk.length) ui += htmlRanking(rk, rkI);
      else if (!l && S.lazer) ui += htmlLazer();
    } else if (S.tab === 'obra') ui += htmlObra();
    else if (S.tab === 'comparar') ui += htmlComparar();
    else ui += htmlCorretor();

    const abas = [['mapa', 'Mapa'], ['obra', 'Obra'], ['comparar', 'Comparar' + (S.favs.length ? ` (${S.favs.length})` : '')], ['corretor', 'Corretor']];
    ui += `<nav class="tabs ui" aria-label="Seções">${abas.map((t) => `<button type="button" class="${S.tab === t[0] ? 'on' : ''}" aria-pressed="${S.tab === t[0]}" data-a="tab" data-v="${t[0]}">${t[1]}</button>`).join('')}</nav>`;
    if (l && S.tab === 'mapa') ui += htmlFolha(l);
    if (S.guia) ui += htmlGuia();
    $('camUi').innerHTML = ui;
    aplicaV(false);
  }

  /* ---------- Gestos no mapa: arrastar, pinça e roda do mouse ---------- */
  const ptrs = new Map();
  let gesto = null, moveu = 0;
  function podeArrastar(e) {
    return rota() === 'mapa' && S.tab === 'mapa' && !S.sel && !S.guia && !e.target.closest('.ui');
  }
  function iniciaGesto() {
    const pts = [...ptrs.values()], r = app.getBoundingClientRect();
    if (pts.length === 1) gesto = { tipo: 'pan', x: pts[0].x, y: pts[0].y, v: { ...S.v } };
    else if (pts.length >= 2) {
      const [a, b] = pts;
      gesto = { tipo: 'pinca', d: Math.hypot(a.x - b.x, a.y - b.y) || 1, mx: (a.x + b.x) / 2 - r.left, my: (a.y + b.y) / 2 - r.top, v: { ...S.v } };
    }
  }
  app.addEventListener('pointerdown', (e) => {
    if (!podeArrastar(e)) return;
    if (!ptrs.size) moveu = 0;
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    iniciaGesto();
  });
  window.addEventListener('pointermove', (e) => {
    if (!ptrs.has(e.pointerId) || !gesto) return;
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...ptrs.values()];
    if (gesto.tipo === 'pan' && pts.length === 1) {
      const dx = pts[0].x - gesto.x, dy = pts[0].y - gesto.y;
      moveu = Math.max(moveu, Math.abs(dx) + Math.abs(dy));
      if (moveu > 6) { S.v = limita({ s: gesto.v.s, x: gesto.v.x + dx, y: gesto.v.y + dy }); aplicaV(true); }
    } else if (gesto.tipo === 'pinca' && pts.length >= 2) {
      const [a, b] = pts, r = app.getBoundingClientRect();
      const d = Math.hypot(a.x - b.x, a.y - b.y), mx = (a.x + b.x) / 2 - r.left, my = (a.y + b.y) / 2 - r.top;
      moveu = 99;
      const s = clamp(gesto.v.s * d / gesto.d, sMin(), 3.2), k = s / gesto.v.s;
      S.v = limita({ s, x: mx - (gesto.mx - gesto.v.x) * k, y: my - (gesto.my - gesto.v.y) * k });
      aplicaV(true);
    }
  });
  function fimPonteiro(e) {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.delete(e.pointerId);
    if (ptrs.size) iniciaGesto();
    else { gesto = null; aplicaV(false); setTimeout(() => { moveu = 0; }, 0); }
  }
  window.addEventListener('pointerup', fimPonteiro);
  window.addEventListener('pointercancel', fimPonteiro);
  app.addEventListener('wheel', (e) => {
    if (!podeArrastar(e)) return;
    e.preventDefault();
    const r = app.getBoundingClientRect();
    zoomEm(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - r.left, e.clientY - r.top);
  }, { passive: false });

  /* ---------- Ações (cliques) ---------- */
  const A = {
    filtroIni(v) { S.filtroIni = v; S.iniI = 0; atualizarInicio(); },
    iniProx() { const n = listaIni().length; S.iniI = (Math.min(S.iniI, n - 1) + 1) % n; atualizarInicio(); },
    iniAnt() { const n = listaIni().length; S.iniI = (Math.min(S.iniI, n - 1) - 1 + n) % n; atualizarInicio(); },
    foto(v) { S.foto = +v; atualizarGaleria(); },
    irMapa() { S.tab = 'mapa'; S.sel = null; location.hash = '#/mapa'; },
    irObra() { S.tab = 'obra'; S.sel = null; location.hash = '#/mapa'; },

    lote(v) {
      if (moveu > 6) return;
      const l = acha(v);
      Object.assign(S, { sel: v, passo: 'card', erro: false, poi: null, deSim: false, v: voa(l, 1.7, 175) });
      atualizarMapa();
    },
    filtro(v) { S.filtro = S.filtro === v ? null : v; S.rkOn = false; atualizarMapa(); },
    zoomIn() { zoomEm(1.4); },
    zoomOut() { zoomEm(1 / 1.4); },
    relevo() { S.relevo = !S.relevo; atualizarMapa(); },
    lazer() { S.lazer = !S.lazer; S.poi = null; if (!S.lazer) S.v = vInicial(); atualizarMapa(); },
    poi(v) {
      if (moveu > 6) return;
      const p = S.dados.pois.find((x) => x.id === +v);
      Object.assign(S, { poi: p.id, lazer: true, sel: null, v: voaXY(p.x, p.y, 1.6, tam().h * 0.3) });
      atualizarMapa();
    },
    gps() {
      S.gps = !S.gps;
      const g = loteGps();
      S.v = S.gps && g ? voa(g, 1.25, tam().h * 0.5) : vInicial();
      atualizarMapa();
    },
    verGps() { const g = loteGps(); if (g) { moveu = 0; A.lote(idL(g)); } },
    fechar() {
      Object.assign(S, { sel: null, passo: 'card', erro: false });
      if (!S.rkOn) S.v = vInicial();
      atualizarMapa();
    },
    hora(v) { S.hora = +v; atualizarMapa(); },
    fav() {
      const i = S.sel;
      S.favs = S.favs.indexOf(i) >= 0 ? S.favs.filter((x) => x !== i) : [...S.favs, i].slice(-3);
      atualizarMapa();
    },
    remFav(v) { S.favs = S.favs.filter((x) => x !== v); atualizarMapa(); },
    simular() { S.passo = 'sim'; atualizarMapa(); },
    card() { S.passo = 'card'; atualizarMapa(); },
    form() { S.passo = 'form'; S.deSim = false; S.erro = false; atualizarMapa(); },
    formSim() { S.passo = 'form'; S.deSim = true; S.erro = false; atualizarMapa(); },
    verDisp() { Object.assign(S, { sel: null, filtro: 'd', passo: 'card', v: vInicial() }); atualizarMapa(); },
    enviar() {
      const l = acha(S.sel);
      if (!l || !S.nome.trim() || S.tel.replace(/\D/g, '').length < 10) { S.erro = true; atualizarMapa(); return; }
      S.leads.unshift({ nome: S.nome.trim() + ' · novo', lote: `Lote ${l.n}, Quadra ${l.q}`, feito: false });
      if (CONFIG.whatsapp) window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem(l))}`, '_blank', 'noopener');
      S.passo = 'ok';
      S.erro = false;
      atualizarMapa();
    },

    guia() { S.guia = true; S.gp = 0; atualizarMapa(); },
    fecharGuia() { S.guia = false; atualizarMapa(); },
    voltarGuia() { S.gp = Math.max(0, S.gp - 1); atualizarMapa(); },
    resp(v) {
      S[PERGUNTAS[S.gp].k] = v;
      if (S.gp < 2) { S.gp += 1; atualizarMapa(); return; }
      Object.assign(S, { guia: false, rkOn: true, rkI: 0, sel: null, lazer: false, filtro: null });
      const rk = ranking();
      S.v = rk.length ? voa(rk[0].l, 1.35, tam().h * 0.2) : vInicial();
      atualizarMapa();
    },
    proxRk() {
      const rk = ranking();
      S.rkI = (S.rkI + 1) % rk.length;
      S.v = voa(rk[S.rkI].l, 1.35, tam().h * 0.2);
      atualizarMapa();
    },
    abrirRk() { const rk = ranking(); moveu = 0; A.lote(idL(rk[S.rkI % rk.length].l)); },
    sairRk() { S.rkOn = false; S.v = vInicial(); atualizarMapa(); },

    tab(v) { Object.assign(S, { tab: v, sel: null, passo: 'card' }); atualizarMapa(); },
    quadra(v) { S.quadra = v; S.selN = 1; atualizarMapa(); },
    selN(v) { S.selN = +v; atualizarMapa(); },
    status(v) {
      const ed = lotes().find((x) => x.q === S.quadra && x.n === S.selN);
      if (!ed) return;
      const i = idL(ed);
      S.muda = { ...S.muda, [i]: v };
      const res = { ...S.res };
      if (v === 'r') res[i] = Date.now() + 24 * 3600 * 1000; else delete res[i];
      S.res = res;
      atualizarMapa();
    },
    precoMenos() { const ed = lotes().find((x) => x.q === S.quadra && x.n === S.selN); if (ed) { S.delta[idL(ed)] = (S.delta[idL(ed)] || 0) - 1000; atualizarMapa(); } },
    precoMais() { const ed = lotes().find((x) => x.q === S.quadra && x.n === S.selN); if (ed) { S.delta[idL(ed)] = (S.delta[idL(ed)] || 0) + 1000; atualizarMapa(); } },
    lead(v) { const c = S.leads[+v]; c.feito = !c.feito; atualizarMapa(); }
  };

  app.addEventListener('click', (e) => {
    const t = e.target.closest('[data-a]');
    if (!t || !app.contains(t)) return;
    const f = A[t.dataset.a];
    if (!f) return;
    e.preventDefault();
    f(t.dataset.v);
  });

  app.addEventListener('input', (e) => {
    const t = e.target, k = t.dataset ? t.dataset.in : null;
    if (!k) return;
    if (k === 'nome') S.nome = t.value;
    else if (k === 'tel') {
      const d = t.value.replace(/\D/g, '').slice(0, 11);
      t.value = d.length > 2 ? `(${d.slice(0, 2)}) ${d.length > 7 ? d.slice(2, 7) + '-' + d.slice(7) : d.slice(2)}` : d;
      S.tel = t.value;
    } else if (k === 'ent') { S.ent = +t.value; atualizaSim(); }
    else if (k === 'prazo') { S.prazo = +t.value; atualizaSim(); }
    else if (k === 'voo') { S.vooI = +t.value; atualizaObra(); }
  });

  /* ---------- Relógio das reservas ---------- */
  let vencidas = 0;
  setInterval(() => {
    S.agora = Date.now();
    const v = Object.keys(S.res).filter((k) => S.res[k] < S.agora).length;
    if (v !== vencidas && rota() === 'mapa' && S.passo !== 'form') { vencidas = v; atualizarMapa(); return; }
    vencidas = v;
    app.querySelectorAll('[data-timer]').forEach((el) => { el.textContent = timer(el.dataset.timer); });
  }, 1000);

  window.addEventListener('resize', () => {
    if (rota() === 'mapa' && S.v) { S.v = limita({ ...S.v, s: Math.max(S.v.s, sMin()) }); aplicaV(false); }
  });
  window.addEventListener('hashchange', render);

  /* ---------- Início ---------- */
  fetch('data/lotes.json')
    .then((r) => r.json())
    .then((d) => {
      S.dados = d;
      const agora = Date.now();
      d.lotes.filter((l) => l.s === 'r').forEach((l, i) => { S.res[idL(l)] = agora + (2 + i * 3) * 3600000 + 754000; });
      const disp = d.lotes.filter((l) => l.s === 'd');
      S.favs = [idL(disp[3]), idL(disp[17])];
      render();
    })
    .catch(() => { app.innerHTML = '<p class="carregando">Não foi possível carregar os dados.</p>'; });

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
