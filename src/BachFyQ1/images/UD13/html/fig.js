// Utilidades comunes de las figuras de la Unidad 9.
// 1) Ajusta el tamaño de página de impresión al contenido (.canvas) para que
//    Chrome genere un PDF vectorial sin márgenes, que luego se pasa a SVG.
// 2) Ayudantes para crear elementos SVG desde JavaScript.
const NS = 'http://www.w3.org/2000/svg';

function svgAdder(id) {
    const s = typeof id === 'string' ? document.getElementById(id) : id;
    return (tag, attrs, text) => {
        const e = document.createElementNS(NS, tag);
        for (const k in attrs) e.setAttribute(k, attrs[k]);
        if (text !== undefined) e.textContent = text;
        s.appendChild(e);
        return e;
    };
}

// Flecha recta con punta
function arrow(add, x1, y1, x2, y2, col = '#23373B', w = 3, head = 12) {
    const a = Math.atan2(y2 - y1, x2 - x1);
    add('line', { x1, y1, x2: x2 - head * 0.8 * Math.cos(a), y2: y2 - head * 0.8 * Math.sin(a), stroke: col, 'stroke-width': w });
    const p = [[x2, y2], [x2 - head * Math.cos(a - 0.4), y2 - head * Math.sin(a - 0.4)], [x2 - head * Math.cos(a + 0.4), y2 - head * Math.sin(a + 0.4)]];
    add('path', { d: 'M' + p.map(q => q.join(' ')).join(' L') + ' Z', fill: col });
}

function label(add, x, y, t, o = {}) {
    return add('text', Object.assign({ x, y, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 700, fill: '#23373B' }, o), t);
}

// Texto con subíndices/superíndices: usa _2 y ^+ (ej. 'H_2O', 'Na^+')
function chemText(add, x, y, s, o = {}) {
    const t = label(add, x, y, '', o);
    const SUBS = '₀₁₂₃₄₅₆₇₈₉';
    t.innerHTML = s.replace(/_(\d+)/g, (m, d) => [...d].map(c => SUBS[+c]).join(''))
        .replace(/\^([0-9]*[+−-])/g, '<tspan baseline-shift="super" font-size="70%">$1</tspan>');
    return t;
}

// Bolita con degradado (partícula de un modelo cinético)
function shade(hex) {
    const n = parseInt(hex.slice(1), 16);
    const f = v => Math.max(0, Math.round(v * 0.55));
    return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
}
function bead(add, x, y, r, col) {
    const id = 'g' + col.slice(1) + Math.round(r * 10);
    if (!document.getElementById(id)) {
        const d = add('defs', {});
        d.innerHTML = `<radialGradient id="${id}" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="${col}"/><stop offset="1" stop-color="${shade(col)}"/></radialGradient>`;
    }
    add('circle', { cx: x, cy: y, r, fill: `url(#${id})`, stroke: shade(col), 'stroke-width': 0.6 });
}

// Generador pseudoaleatorio reproducible (las figuras salen siempre iguales)
function rng(seed) { return () => (seed = (seed * 9301 + 49297) % 233280) / 233280; }

// Vaso de precipitados: x, y = esquina superior izquierda; devuelve el nivel del líquido
function beaker(add, x, y, w, h, o = {}) {
    const lvl = y + h * (1 - (o.fill ?? 0.6));
    if (o.liquid !== false) add('path', { d: `M${x + 3} ${lvl} L${x + w - 3} ${lvl} L${x + w - 3} ${y + h - 6} Q${x + w - 3} ${y + h - 2} ${x + w - 8} ${y + h - 2} L${x + 8} ${y + h - 2} Q${x + 3} ${y + h - 2} ${x + 3} ${y + h - 6} Z`, fill: o.color || '#AED6F1', opacity: 0.85 });
    add('path', { d: `M${x - 6} ${y} L${x} ${y + 6} L${x} ${y + h - 8} Q${x} ${y + h} ${x + 8} ${y + h} L${x + w - 8} ${y + h} Q${x + w} ${y + h} ${x + w} ${y + h - 8} L${x + w} ${y}`, fill: 'none', stroke: '#5D6D7E', 'stroke-width': 2.5, 'stroke-linejoin': 'round' });
    return lvl;
}

window.addEventListener('load', () => {
    const c = document.querySelector('.canvas');
    if (!c) return;
    const r = c.getBoundingClientRect();
    const w = Math.ceil(r.width) + 2, h = Math.ceil(r.height) + 2;
    const st = document.createElement('style');
    st.textContent = `@page { size: ${w}px ${h}px; margin: 0; } html, body { width: ${w}px; height: ${h}px; overflow: hidden; }`;
    document.head.appendChild(st);
});

// Diagrama de energía potencial de una reacción.
// o = { x0, y0 (origen de ejes), w, h, r, p, peak (alturas 0-1 de reactivos, productos y complejo activado),
//       col, rl, pl (rótulos de reactivos y productos), ea (dibujar energía de activación), de (dibujar ΔE),
//       axes (false para no dibujar ejes), dash }
function energyProfile(add, o) {
    const { x0, y0, w, h } = o, col = o.col || '#1E8449';
    const Y = f => y0 - f * h;
    if (o.axes !== false) {
        arrow(add, x0, y0, x0 + w + 12, y0, '#23373B', 2, 10);
        arrow(add, x0, y0, x0, y0 - h - 18, '#23373B', 2, 10);
        label(add, x0 + w / 2, y0 + 22, 'coordenada de reacción', { 'font-size': 13, 'font-weight': 600 });
        label(add, x0 - 12, y0 - h / 2, 'energía potencial', { 'font-size': 13, 'font-weight': 600, transform: `rotate(-90 ${x0 - 12} ${y0 - h / 2})` });
    }
    const xa = x0 + 0.08 * w, xb = x0 + 0.28 * w, xm = x0 + 0.5 * w, xc = x0 + 0.72 * w, xd = x0 + 0.95 * w;
    const yr = Y(o.r), yp = Y(o.p), ym = Y(o.peak);
    add('path', { d: `M${xa} ${yr} L${xb} ${yr} C ${xb + 0.12 * w} ${yr} ${xm - 0.1 * w} ${ym} ${xm} ${ym} C ${xm + 0.1 * w} ${ym} ${xc - 0.12 * w} ${yp} ${xc} ${yp} L${xd} ${yp}`,
        fill: 'none', stroke: col, 'stroke-width': 3, 'stroke-dasharray': o.dash || '' });
    add('line', { x1: xa, y1: yr, x2: xb, y2: yr, stroke: '#2471A3', 'stroke-width': 6 });
    add('line', { x1: xc, y1: yp, x2: xd, y2: yp, stroke: '#C0392B', 'stroke-width': 6 });
    if (o.rl !== '') chemText(add, (xa + xb) / 2, yr - 10, o.rl || 'reactivos', { 'font-size': 13, fill: '#2471A3' });
    if (o.pl !== '') chemText(add, (xc + xd) / 2, yp - 10, o.pl || 'productos', { 'font-size': 13, fill: '#C0392B' });
    if (o.ea !== false) {
        add('line', { x1: xb, y1: yr, x2: xm + 4, y2: yr, stroke: '#7F8C8D', 'stroke-dasharray': '4 4' });
        arrow(add, xm, yr, xm, ym + 3, '#6C3483', 2, 9); arrow(add, xm, ym + 3, xm, yr, '#6C3483', 2, 9);
        label(add, xm + 8, (yr + ym) / 2 + 4, o.eaLabel || 'Eₐ', { 'font-size': 14, fill: '#6C3483', 'text-anchor': 'start' });
        if (o.ca !== false) label(add, xm, ym - 10, 'complejo activado', { 'font-size': 12, fill: '#525252' });
    }
    if (o.de) {
        const xe = xd - 0.04 * w;
        add('line', { x1: xb, y1: yr, x2: xd, y2: yr, stroke: '#7F8C8D', 'stroke-dasharray': '4 4' });
        arrow(add, xe, yr, xe, yp, '#B9770E', 2, 9);
        label(add, xe + 8, (yr + yp) / 2 + 4, o.de, { 'font-size': 13, fill: '#B9770E', 'text-anchor': 'start' });
    }
}

// Molécula diatómica o de dos bolas: centro, ángulo (rad), radios y colores
function dimer(add, x, y, ang, r1, c1, r2, c2, d) {
    const dx = Math.cos(ang) * d / 2, dy = Math.sin(ang) * d / 2;
    bead(add, x - dx, y - dy, r1, c1); bead(add, x + dx, y + dy, r2, c2);
}

// ---------- Ayudantes de cinemática (Unidad 9) ----------
// Etiqueta de vector: letra en cursiva con flechita encima y subíndice opcional, p. ej. vlab(add, x, y, 'v', 'BA', '#C0392B')
function vlab(add, x, y, s, sub = '', col = '#23373B', fs = 17) {
    // x es el centro de la letra principal
    const w = fs * 0.5;
    const t = add('text', { x: x - w / 2, y, 'font-size': fs, 'font-weight': 700, 'font-style': 'italic', fill: col, 'text-anchor': 'start' });
    t.innerHTML = s + (sub ? `<tspan dy="${fs * 0.3}" font-size="${fs * 0.66}" font-style="normal">${sub}</tspan>` : '');
    const y0 = y - fs * 0.92, xa = x - w * 0.55, xb = x + w * 0.75;
    add('line', { x1: xa, y1: y0, x2: xb - 3, y2: y0, stroke: col, 'stroke-width': 1.4 });
    add('path', { d: `M${xb} ${y0} L${xb - 5} ${y0 - 3} L${xb - 5} ${y0 + 3} Z`, fill: col });
    return t;
}
// Ejes cartesianos con nombres
function axes(add, ox, oy, w, h, nx = 'X', ny = 'Y', col = '#23373B') {
    arrow(add, ox, oy, ox + w, oy, col, 2, 10); arrow(add, ox, oy, ox, oy - h, col, 2, 10);
    label(add, ox + w - 4, oy + 20, nx, { 'font-size': 14 }); label(add, ox - 14, oy - h + 8, ny, { 'font-size': 14 });
    label(add, ox - 10, oy + 18, 'O', { 'font-size': 14 });
}
function dot(add, x, y, col = '#23373B', r = 4.5) { return add('circle', { cx: x, cy: y, r, fill: col }); }
// Curva a partir de una función paramétrica t -> [x, y]
function curve(add, f, t0, t1, col = '#1E8449', w = 3, extra = {}) {
    const pts = []; for (let k = 0; k <= 80; k++) pts.push(f(t0 + (t1 - t0) * k / 80));
    return add('polyline', Object.assign({ points: pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' '), fill: 'none', stroke: col, 'stroke-width': w }, extra));
}
function dashed(add, x1, y1, x2, y2, col = '#7F8C8D', w = 1.5) { add('line', { x1, y1, x2, y2, stroke: col, 'stroke-width': w, 'stroke-dasharray': '5 4' }); }

// ---------- Ayudantes de dinámica (Unidad 10) ----------
// Texto con marcado sencillo: _x -> subíndice, ^2 -> superíndice, *F* -> cursiva
function rich(add, x, y, s, o = {}) {
    const t = label(add, x, y, '', o);
    t.innerHTML = s.replace(/\*([^*]+)\*/g, '<tspan font-style="italic">$1</tspan>')
        .replace(/_\{([^}]+)\}|_(\w)/g, (m, a, b) => `<tspan baseline-shift="sub" font-size="70%">${a || b}</tspan>`)
        .replace(/\^(\w)/g, '<tspan baseline-shift="super" font-size="70%">$1</tspan>');
    return t;
}
// Bloque (caja) con sombreado suave
function box(add, x, y, w, h, col = '#F7DC6F', st = '#B9770E') {
    add('rect', { x, y, width: w, height: h, rx: 3, fill: col, stroke: st, 'stroke-width': 2 });
}
