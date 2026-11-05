/* =====================================================================
   comun.js — Utilidades compartidas para generar las figuras SVG del
   libro 3º ESO (versión inglesa).
   Cada archivo de fuentes/*.html construye su figura con estas funciones
   dentro de un <svg id="figura">; exportar.js extrae ese SVG y lo
   convierte a PDF vectorial para incluirlo con \includegraphics.
   ===================================================================== */

const NS = 'http://www.w3.org/2000/svg';

/* Fuentes: sans para rótulos, serif itálica para magnitudes (estilo LaTeX) */
const FUENTE = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const FUENTE_MATE = "'Cambria Math', 'Cambria', 'Times New Roman', serif";

/* Colores CPK (convenio habitual en modelos moleculares) */
const CPK = {
  H:  { base: '#f4f6f8', luz: '#ffffff', sombra: '#a9b4c0', texto: '#333' },
  C:  { base: '#3b3f45', luz: '#8a9099', sombra: '#15171a', texto: '#fff' },
  O:  { base: '#d62828', luz: '#ff8a80', sombra: '#7a0c0c', texto: '#fff' },
  Cl: { base: '#2fa84f', luz: '#8fe3a4', sombra: '#135c26', texto: '#fff' },
};

/* Crea un elemento SVG con atributos y lo añade al padre */
function el(tag, attrs = {}, padre) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'text') e.textContent = v;
    else e.setAttribute(k, v);
  }
  if (padre) padre.appendChild(e);
  return e;
}

/* Lienzo principal: <svg id="figura"> con su <defs> */
function crearLienzo(ancho, alto) {
  const svg = el('svg', {
    xmlns: NS, id: 'figura', width: ancho, height: alto,
    viewBox: `0 0 ${ancho} ${alto}`,
  }, document.body);
  const defs = el('defs', {}, svg);
  return { svg, defs };
}

/* Degradado radial con brillo en la parte superior izquierda (esfera 3D) */
function degradadoEsfera(defs, id, c) {
  if (defs.querySelector('#' + id)) return `url(#${id})`;
  const g = el('radialGradient', { id, cx: '35%', cy: '30%', r: '70%' }, defs);
  el('stop', { offset: '0%', 'stop-color': c.luz }, g);
  el('stop', { offset: '55%', 'stop-color': c.base }, g);
  el('stop', { offset: '100%', 'stop-color': c.sombra }, g);
  return `url(#${id})`;
}

/* Degradado lineal genérico: paradas = [[offset, color], ...] */
function degradadoLineal(defs, id, paradas, x1 = 0, y1 = 0, x2 = 0, y2 = 1) {
  if (defs.querySelector('#' + id)) return `url(#${id})`;
  const g = el('linearGradient', { id, x1, y1, x2, y2 }, defs);
  for (const [o, c, op = 1] of paradas)
    el('stop', { offset: o, 'stop-color': c, 'stop-opacity': op }, g);
  return `url(#${id})`;
}

/* Átomo como esfera con símbolo opcional */
function atomo(padre, defs, x, y, r, simbolo, { etiqueta = true } = {}) {
  const c = CPK[simbolo];
  const g = el('g', {}, padre);
  el('circle', {
    cx: x, cy: y, r, fill: degradadoEsfera(defs, 'esf_' + simbolo, c),
    stroke: c.sombra, 'stroke-width': Math.max(1, r * 0.05),
  }, g);
  if (etiqueta && r >= 12)
    texto(g, x, y + r * 0.2, simbolo, {
      size: r * 0.62, fill: c.texto, weight: 700,
    });
  return g;
}

/* Texto con soporte sencillo de subíndices _{..} y superíndices ^{..}
   (también _2 / ^+ de un solo carácter). */
function texto(padre, x, y, cadena, {
  size = 16, fill = '#222', weight = 400, anchor = 'middle',
  family = FUENTE, italic = false,
} = {}) {
  const t = el('text', {
    x, y, 'font-size': size, fill, 'font-weight': weight,
    'text-anchor': anchor, 'font-family': family,
  }, padre);
  if (italic) t.setAttribute('font-style', 'italic');
  const re = /([_^])(\{([^}]*)\}|(.))/g;
  // 'nivel' es el desplazamiento vertical actual respecto a la línea base
  let ultimo = 0, m, nivel = 0;
  const tramo = (txt, objetivo, tam) => {
    if (!txt) return;
    el('tspan', { dy: objetivo - nivel, 'font-size': tam, text: txt }, t);
    nivel = objetivo;
  };
  while ((m = re.exec(cadena)) !== null) {
    tramo(cadena.slice(ultimo, m.index), 0, size);
    const contenido = m[3] ?? m[4];
    tramo(contenido, m[1] === '_' ? size * 0.3 : -size * 0.4, size * 0.68);
    ultimo = re.lastIndex;
  }
  tramo(cadena.slice(ultimo), 0, size);
  return t;
}

/* Marcador de punta de flecha reutilizable */
function puntaFlecha(defs, id, color, tam = 8) {
  if (defs.querySelector('#' + id)) return `url(#${id})`;
  const m = el('marker', {
    id, viewBox: '0 0 10 10', refX: 8, refY: 5,
    markerWidth: tam, markerHeight: tam, orient: 'auto-start-reverse',
    markerUnits: 'userSpaceOnUse',
  }, defs);
  el('path', { d: 'M0,0 L10,5 L0,10 L3,5 Z', fill: color }, m);
  return `url(#${id})`;
}

/* Flecha recta simple (inicio → fin) */
function flecha(padre, defs, x1, y1, x2, y2, {
  color = '#222', ancho = 2, tam = 12, dash = null, doble = false,
} = {}) {
  const id = 'punta_' + color.replace('#', '') + '_' + tam;
  const punta = puntaFlecha(defs, id, color, tam);
  const l = el('line', {
    x1, y1, x2, y2, stroke: color, 'stroke-width': ancho,
    'marker-end': punta,
  }, padre);
  if (doble) l.setAttribute('marker-start', punta);
  if (dash) l.setAttribute('stroke-dasharray', dash);
  return l;
}

/* Flecha gruesa de reacción (bloque con degradado) */
function flechaReaccion(padre, defs, x, y, largo, grosor, colores = ['#f6c343', '#e76f24']) {
  const f = degradadoLineal(defs, 'grad_flecha_' + colores.join('').replace(/#/g, ''),
    [['0%', colores[0]], ['100%', colores[1]]], 0, 0, 1, 0);
  const h = grosor / 2, cab = grosor * 1.1;
  const d = `M${x},${y - h} L${x + largo - cab},${y - h} L${x + largo - cab},${y - grosor}
             L${x + largo},${y} L${x + largo - cab},${y + grosor} L${x + largo - cab},${y + h}
             L${x},${y + h} L${x + grosor * 0.4},${y} Z`;
  return el('path', { d, fill: f, stroke: '#b5541b', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, padre);
}

/* Estallido (estrella de n puntas) para representar un choque eficaz */
function estallido(padre, defs, cx, cy, rExt, rInt, n = 16, colores = ['#fff7c2', '#f6c343']) {
  const f = degradadoLineal(defs, 'grad_estallido', [['0%', colores[0]], ['100%', colores[1]]]);
  const pts = [];
  for (let i = 0; i < 2 * n; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2;
    const r = i % 2 ? rInt : rExt * (0.85 + 0.15 * Math.cos(i * 1.7));
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return el('polygon', { points: pts.join(' '), fill: f, stroke: '#e9a31a', 'stroke-width': 1.2 }, padre);
}

/* Fórmula estructural (desarrollada) a partir de SMILES.
   SmilesDrawer interpreta el SMILES y calcula la geometría 2D de la
   molécula; los enlaces y símbolos se dibujan aquí con SVG simple
   (sin máscaras ni transformaciones CSS) para que el resultado sea
   idéntico en el navegador, en el SVG y en el PDF.
   (cx, cy) es el centro de la fórmula; 'enlace' es la longitud de un
   enlace en px; 'espejo' refleja la fórmula en horizontal. Los H deben ir explícitos: [H]O[H], [H]C([H])([H])[H]... */
const COLOR_ELEMENTO = { H: '#555', C: '#222', O: '#d62828', Cl: '#1f8a3e', N: '#2a5bd7' };

function estructuraSMILES(padre, smiles, cx, cy, { enlace = 34, tam = 16, grosor = 1.8, espejo = false } = {}) {
  const g = el('g', { 'data-smiles': smiles }, padre);
  const dibujante = new SmilesDrawer.SvgDrawer({ explicitHydrogens: true, terminalCarbons: true });
  const pre = dibujante.preprocessor;
  SmilesDrawer.parse(smiles, arbol => {
    pre.initDraw(arbol, 'light', false);
    pre.processGraph();
    const V = pre.graph.vertices, E = pre.graph.edges;
    const k = enlace / pre.opts.bondLength;
    const xs = V.map(v => v.position.x), ys = V.map(v => v.position.y);
    const mx = (Math.min(...xs) + Math.max(...xs)) / 2, my = (Math.min(...ys) + Math.max(...ys)) / 2;
    const sx = espejo ? -k : k;   // espejo: refleja en horizontal (p. ej. H–Cl en vez de Cl–H)
    const P = V.map(v => ({ x: cx + (v.position.x - mx) * sx, y: cy + (v.position.y - my) * k }));
    // espacio libre alrededor de cada símbolo (mayor para símbolos de 2 letras)
    const hueco = i => tam * (0.4 + 0.22 * V[i].value.element.length);

    for (const e of E) {
      const a = P[e.sourceId], b = P[e.targetId];
      const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy);
      const ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
      const ha = hueco(e.sourceId), hb = hueco(e.targetId);
      const n = e.bondType === '=' ? 2 : e.bondType === '#' ? 3 : 1;
      for (let i = 0; i < n; i++) {
        const off = (i - (n - 1) / 2) * tam * 0.28;
        el('line', {
          x1: a.x + ux * ha + nx * off, y1: a.y + uy * ha + ny * off,
          x2: b.x - ux * hb + nx * off, y2: b.y - uy * hb + ny * off,
          stroke: '#333', 'stroke-width': grosor, 'stroke-linecap': 'round',
        }, g);
      }
    }
    V.forEach((v, i) => {
      const s = v.value.element;
      texto(g, P[i].x, P[i].y + tam * 0.36, s, {
        size: tam, weight: 600, fill: COLOR_ELEMENTO[s] || '#222',
      });
    });
  }, err => registrarError(`SMILES ${smiles}: ${err && (err.message || err)}`));
  return g;
}

/* Errores acumulados: exportar.js los muestra por consola */
function registrarError(msg) {
  const previo = document.body.getAttribute('data-errores') || '';
  document.body.setAttribute('data-errores', previo + msg.replace(/"/g, "'") + ' | ');
}

/* Serializa la figura y la deja en <body data-svg="..."> (base64) para
   que exportar.js la recoja con Chrome en modo headless. */
function finalizar() {
  const xml = new XMLSerializer().serializeToString(document.getElementById('figura'));
  document.body.setAttribute('data-svg', btoa(unescape(encodeURIComponent(xml))));
}
