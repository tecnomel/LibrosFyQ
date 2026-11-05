// Generador de mapas conceptuales (uno por tema). Lo usa mapa.html?tema=UD1.
// Los datos de cada tema están en temas.js:
//   TEMAS.UD1 = { titulo, ramas: [ { enlace, t, sub, hijos: ['…', …] }, … ] }
//     enlace = palabras de enlace entre el título del tema y la rama («se mide con»…)
//     t      = concepto de la rama;  sub = palabras de enlace hacia sus hijos (opcional)
//     hijos  = conceptos que cuelgan de la rama (admiten HTML: <sub>, <sup>, <i>…)
//   COLOR = color del libro (el mismo que \definecolor{ocre} del principal).
// La maquetación la hace CSS (columnas flex); las líneas y flechas se dibujan después en SVG
// midiendo las cajas. Al final se ajusta @page al tamaño del dibujo para que Chrome imprima
// un PDF vectorial sin márgenes.
const NS = 'http://www.w3.org/2000/svg';

function el(tag, cls, html, parent) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
}

function mix(hex, f) { // mezcla el color con blanco (f = 0 → color, f = 1 → blanco)
    const n = parseInt(hex.slice(1), 16);
    const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v + (255 - v) * f));
    return `rgb(${c.join(',')})`;
}

function dibujarMapa(tema, color) {
    const root = document.documentElement.style;
    root.setProperty('--c', color);
    root.setProperty('--c-soft', mix(color, 0.86));
    root.setProperty('--c-line', mix(color, 0.25));

    const canvas = el('div', 'canvas', undefined, document.body);
    const raiz = el('div', 'raiz', tema.titulo, el('div', 'fila-raiz', undefined, canvas));
    const fila = el('div', 'ramas', undefined, canvas);
    const ramas = tema.ramas.map(r => {
        const col = el('div', 'col', undefined, fila);
        const banda = el('div', 'banda', undefined, col);
        const enl = r.enlace ? el('div', 'enlace', r.enlace, banda) : null;
        const caja = el('div', 'rama', r.t, col);
        const sub = el('div', 'sub', r.sub ? `<span>${r.sub}</span>` : '', col);
        const hijos = (r.hijos || []).map(h => el('div', 'hijo', h, col));
        return { col, banda, enl, caja, sub, hijos };
    });

    // Si una palabra o fórmula no cabe en su caja, se reduce la letra de esa caja hasta que quepa
    canvas.querySelectorAll('.hijo, .rama, .enlace').forEach(e => {
        let fs = parseFloat(getComputedStyle(e).fontSize);
        while (e.scrollWidth > e.clientWidth + 0.5 && fs > 9) e.style.fontSize = (fs -= 0.5) + 'px';
    });

    const bb = canvas.getBoundingClientRect(), W = Math.ceil(bb.width), H = Math.ceil(bb.height);
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', W); svg.setAttribute('height', H);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    canvas.insertBefore(svg, canvas.firstChild);
    const add = (tag, a) => {
        const e = document.createElementNS(NS, tag);
        for (const k in a) e.setAttribute(k, a[k]);
        svg.appendChild(e); return e;
    };
    const o = canvas.getBoundingClientRect();
    const R = e => { const b = e.getBoundingClientRect(); return { l: b.left - o.left, r: b.right - o.left, t: b.top - o.top, b: b.bottom - o.top, cx: (b.left + b.right) / 2 - o.left, cy: (b.top + b.bottom) / 2 - o.top }; };
    const lc = 'var(--c-line)';
    const linea = d => add('path', { d, fill: 'none', stroke: lc, 'stroke-width': 2, 'stroke-linejoin': 'round' });
    const punta = (x, y, dir) => { // dir: 'abajo' | 'dcha'
        const s = 7, p = dir === 'abajo' ? [[x, y], [x - s * 0.6, y - s], [x + s * 0.6, y - s]] : [[x, y], [x - s, y - s * 0.6], [x - s, y + s * 0.6]];
        add('path', { d: 'M' + p.map(q => q.join(' ')).join(' L') + ' Z', fill: lc });
    };

    // Título del tema → ramas (bus horizontal y una bajada a cada rama)
    const rr = R(raiz), cajas = ramas.map(r => R(r.caja));
    const yBus = R(ramas[0].banda).t + 8;
    linea(`M${rr.cx} ${rr.b} V${yBus}`);
    if (cajas.length > 1) linea(`M${cajas[0].cx} ${yBus} H${cajas[cajas.length - 1].cx}`);
    cajas.forEach(c => { linea(`M${c.cx} ${yBus} V${c.t - 1}`); punta(c.cx, c.t, 'abajo'); });

    // Rama → hijos (columna vertical a la izquierda con una flecha a cada hijo)
    ramas.forEach((r, i) => {
        if (!r.hijos.length) return;
        const c = cajas[i], hs = r.hijos.map(R), x = hs[0].l - 10;
        linea(`M${x} ${c.b} V${hs[hs.length - 1].cy}`);
        hs.forEach(h => { linea(`M${x} ${h.cy} H${h.l - 1}`); punta(h.l, h.cy, 'dcha'); });
    });

    const css = document.createElement('style');
    css.textContent = `@page { size: ${W}px ${H + 2}px; margin: 0; } html, body { height: ${H}px; overflow: hidden; }`;
    document.head.appendChild(css);
}

const q = new URLSearchParams(location.search);
const clave = q.get('tema') || Object.keys(TEMAS)[0];
document.title = 'mapa_' + clave;
dibujarMapa(TEMAS[clave], q.get('color') ? '#' + q.get('color') : COLOR);
