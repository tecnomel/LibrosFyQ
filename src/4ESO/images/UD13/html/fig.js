// Utilidades comunes de las figuras de la Unidad 13.
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

// Nombre de un vector con flechita encima: vlabel(add, x, y, 'F', '#C0392B', 'neta')
function vlabel(add, x, y, t, col = '#23373B', sub = '', fs = 16) {
    const w = fs * 0.55 * t.length;
    add('text', { x, y, 'font-size': fs, 'font-weight': 700, 'font-style': 'italic', fill: col, 'text-anchor': 'middle' }, t);
    if (sub) add('text', { x: x + w / 2 + 1, y: y + fs * 0.3, 'font-size': fs * 0.65, 'font-weight': 700, fill: col }, sub);
    const yy = y - fs * 0.85;
    add('line', { x1: x - w / 2, y1: yy, x2: x + w / 2 + 1, y2: yy, stroke: col, 'stroke-width': 1.3 });
    add('path', { d: `M${x + w / 2 - 2} ${yy - 2.5} L${x + w / 2 + 2} ${yy} L${x + w / 2 - 2} ${yy + 2.5}`, fill: 'none', stroke: col, 'stroke-width': 1.3 });
}

// Bloque (caja) con sombreado sencillo, centrado en (x, y), girado ang grados
function block(add, x, y, w, h, ang = 0, col = '#F7DC6F') {
    add('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, fill: col, stroke: '#B7950B', 'stroke-width': 2, transform: `rotate(${ang} ${x} ${y})` });
    add('circle', { cx: x, cy: y, r: 3, fill: '#23373B' });
}

// Punto de una circunferencia de centro (cx, cy) y radio r; ángulo en grados, medido como en matemáticas
// (0° a la derecha, sentido antihorario), aunque el eje y del SVG apunte hacia abajo.
function pol(cx, cy, r, deg) {
    const a = deg * Math.PI / 180;
    return [cx + r * Math.cos(a), cy - r * Math.sin(a)];
}

// Arco de circunferencia (path) entre los ángulos a1 y a2 (grados, antihorario)
function arcD(cx, cy, r, a1, a2) {
    const [x1, y1] = pol(cx, cy, r, a1), [x2, y2] = pol(cx, cy, r, a2);
    const large = Math.abs(a2 - a1) > 180 ? 1 : 0, sweep = a2 > a1 ? 0 : 1;
    return `M${x1} ${y1} A${r} ${r} 0 ${large} ${sweep} ${x2} ${y2}`;
}

// Arco con punta de flecha al final (a1 -> a2)
function arcArrow(add, cx, cy, r, a1, a2, col = '#23373B', w = 2.5, head = 10) {
    add('path', { d: arcD(cx, cy, r, a1, a2 - Math.sign(a2 - a1) * head * 40 / r), fill: 'none', stroke: col, 'stroke-width': w });
    const [x2, y2] = pol(cx, cy, r, a2), [x1, y1] = pol(cx, cy, r, a2 - Math.sign(a2 - a1) * head * 57 / r);
    arrow(add, x1, y1, x2, y2, col, 0.1, head);
}

// Recipiente abierto (paredes en U) con líquido. x, y = esquina superior izquierda; lvl = altura del líquido
// medida desde el fondo. Devuelve la coordenada y de la superficie libre.
function tank(add, x, y, w, h, lvl, col = '#AED6F1', wall = '#5D6D7E') {
    const ys = y + h - lvl;
    add('rect', { x, y: ys, width: w, height: lvl, fill: col, opacity: 0.9 });
    add('line', { x1: x, y1: ys, x2: x + w, y2: ys, stroke: '#2E86C1', 'stroke-width': 1.5 });
    add('path', { d: `M${x} ${y} L${x} ${y + h} L${x + w} ${y + h} L${x + w} ${y}`, fill: 'none', stroke: wall, 'stroke-width': 3, 'stroke-linejoin': 'round' });
    return ys;
}

// Cota vertical con flechas en los dos extremos y texto a la izquierda (o a la derecha si right = true);
// 'h_A' escribe la A como subíndice
function vdim(add, x, y1, y2, t, col = '#23373B', right = false) {
    arrow(add, x, (y1 + y2) / 2, x, y1, col, 1.5, 8); arrow(add, x, (y1 + y2) / 2, x, y2, col, 1.5, 8);
    const e = label(add, x + (right ? 8 : -8), (y1 + y2) / 2 + 5, '', { 'font-size': 15, fill: col, 'font-style': 'italic', 'text-anchor': right ? 'start' : 'end' });
    e.innerHTML = t.replace(/_(\w+)/, '<tspan baseline-shift="sub" font-size="70%" font-style="normal">$1</tspan>');
}

// Dinamómetro colgado de (x, y): carcasa de longitud len, escala y gancho; devuelve la y del gancho
function dynamometer(add, x, y, len = 120, ext = 0.5) {
    add('rect', { x: x - 11, y, width: 22, height: len, rx: 5, fill: '#F7DC6F', stroke: '#B7950B', 'stroke-width': 1.8 });
    for (let i = 0; i <= 10; i++) add('line', { x1: x - 11, y1: y + 14 + i * (len - 28) / 10, x2: x - 4, y2: y + 14 + i * (len - 28) / 10, stroke: '#7D6608', 'stroke-width': 1 });
    const yi = y + 14 + ext * (len - 28);
    add('rect', { x: x - 3, y: y + 8, width: 6, height: yi - y - 8, fill: '#C0392B' });
    add('line', { x1: x, y1: y + len, x2: x, y2: y + len + 18, stroke: '#5D6D7E', 'stroke-width': 2 });
    add('path', { d: `M${x} ${y + len + 18} q 7 2 3 9 q -4 4 -8 -1`, fill: 'none', stroke: '#5D6D7E', 'stroke-width': 2 });
    return y + len + 26;
}

// Persona esquemática (monigote). (x, y) = punto entre los pies; altura total ~ 120 * s.
// o.lean: inclinación del cuerpo en grados (positivo hacia la derecha);
// o.armL / o.armR: ángulo de cada brazo en grados (0 = horizontal a la derecha, 90 = arriba, -90 = abajo);
// o.step: separación de los pies; o.col: color.
function person(add, x, y, o = {}) {
    const s = o.s ?? 1, col = o.col ?? '#34495E', lean = (o.lean ?? 0) * Math.PI / 180;
    const hip = [x + Math.sin(lean) * 4 * s, y - 52 * s];
    const neck = [hip[0] + Math.sin(lean) * 42 * s, hip[1] - Math.cos(lean) * 42 * s];
    const st = (o.step ?? 14) * s;
    const line = (a, b, w = 5) => add('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: col, 'stroke-width': w * s, 'stroke-linecap': 'round' });
    line(hip, [x - st, y]); line(hip, [x + st, y]);
    line(hip, neck, 6);
    const sh = [hip[0] + Math.sin(lean) * 36 * s, hip[1] - Math.cos(lean) * 36 * s];
    const arm = deg => { const a = deg * Math.PI / 180; return [sh[0] + Math.cos(a) * 34 * s, sh[1] - Math.sin(a) * 34 * s]; };
    const hL = arm(o.armL ?? -100), hR = arm(o.armR ?? -80);
    line(sh, hL, 4); line(sh, hR, 4);
    add('circle', { cx: neck[0] + Math.sin(lean) * 11 * s, cy: neck[1] - Math.cos(lean) * 11 * s, r: 10 * s, fill: col });
    return { hL, hR, sh, hip };
}

// Barras de energía: Ep (azul), Ec (rojo) y Em (verde), con valores entre 0 y max.
// (x, y) = esquina inferior izquierda del grupo; h = altura de la barra para max.
function energyBars(add, x, y, ep, ec, max, h = 80, o = {}) {
    const w = o.w ?? 16, gap = o.gap ?? 4;
    [[ep, '#2E86C1', 'Ep'], [ec, '#C0392B', 'Ec'], [ep + ec, '#1E8449', 'Em']].forEach(([v, c, n], i) => {
        const bx = x + i * (w + gap), bh = v / max * h;
        add('rect', { x: bx, y: y - h, width: w, height: h, fill: '#F2F3F4', stroke: '#D5D8DC', 'stroke-width': 1 });
        if (bh > 0) add('rect', { x: bx, y: y - bh, width: w, height: bh, fill: c });
        const t = label(add, bx + w / 2, y + 14, '', { 'font-size': 11, fill: c });
        t.innerHTML = n[0] + '<tspan baseline-shift="sub" font-size="75%">' + n.slice(1) + '</tspan>';
    });
}

// ---- Ayudantes propios de la UD12 ----

// Texto con subíndices en cursiva matemática: 'T_1', 'Q_eq'… (la letra en cursiva, el subíndice recto)
function sub(add, x, y, s, o = {}) {
    const t = label(add, x, y, '', o);
    t.innerHTML = s.replace(/([A-Za-zλΔ]+)_\{?([^\s}]+)\}?/g, '<tspan font-style="italic">$1</tspan><tspan baseline-shift="sub" font-size="70%">$2</tspan>');
    return t;
}

// Termómetro vertical: (x, y) = extremo superior; len = longitud; lvl = fracción de la columna (0-1)
function thermometer(add, x, y, len = 120, lvl = 0.5, col = '#C0392B') {
    add('rect', { x: x - 5, y, width: 10, height: len, rx: 5, fill: '#FDFEFE', stroke: '#7F8C8D', 'stroke-width': 1.5 });
    const top = y + 6 + (1 - lvl) * (len - 12);
    add('rect', { x: x - 2, y: top, width: 4, height: y + len - top, fill: col });
    add('circle', { cx: x, cy: y + len + 4, r: 8, fill: col, stroke: '#7F8C8D', 'stroke-width': 1.5 });
    for (let i = 1; i < 8; i++) add('line', { x1: x + 1, y1: y + i * len / 8, x2: x + 5, y2: y + i * len / 8, stroke: '#7F8C8D', 'stroke-width': 1 });
}

// Hornillo (placa calefactora): (x, y) = esquina superior izquierda de la placa; w = anchura
function hotplate(add, x, y, w = 140, on = true) {
    add('rect', { x, y, width: w, height: 8, rx: 2, fill: on ? '#E74C3C' : '#95A5A6' });
    add('path', { d: `M${x - 6} ${y + 8} L${x + w + 6} ${y + 8} L${x + w + 12} ${y + 48} L${x - 12} ${y + 48} Z`, fill: '#E59866', stroke: '#A04000', 'stroke-width': 1.5 });
    [0.25, 0.45].forEach(f => add('circle', { cx: x + w * f, cy: y + 30, r: 7, fill: '#FDFEFE', stroke: '#626567', 'stroke-width': 1.5 }));
    add('rect', { x: x + w * 0.65, y: y + 24, width: 14, height: 10, rx: 2, fill: on ? '#C0392B' : '#626567' });
}

// Llama de gas o de un mechero: (x, y) = base; s = escala
function flame(add, x, y, s = 1) {
    add('path', { d: `M${x} ${y} C${x - 14 * s} ${y - 10 * s} ${x - 8 * s} ${y - 26 * s} ${x} ${y - 40 * s} C${x + 8 * s} ${y - 26 * s} ${x + 14 * s} ${y - 10 * s} ${x} ${y} Z`, fill: '#F39C12' });
    add('path', { d: `M${x} ${y} C${x - 7 * s} ${y - 6 * s} ${x - 4 * s} ${y - 15 * s} ${x} ${y - 24 * s} C${x + 4 * s} ${y - 15 * s} ${x + 7 * s} ${y - 6 * s} ${x} ${y} Z`, fill: '#FCF3CF' });
}

// Flecha ancha (de bloque) para representar un flujo de energía (calor, trabajo)
function fatArrow(add, x1, y1, x2, y2, w = 18, col = '#E74C3C') {
    const a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1), hl = w * 1.1;
    const pts = [[0, -w / 2], [L - hl, -w / 2], [L - hl, -w], [L, 0], [L - hl, w], [L - hl, w / 2], [0, w / 2]]
        .map(([u, v]) => [x1 + u * Math.cos(a) - v * Math.sin(a), y1 + u * Math.sin(a) + v * Math.cos(a)]);
    add('path', { d: 'M' + pts.map(p => p.join(' ')).join(' L') + ' Z', fill: col });
}

// Línea de referencia (rótulo con guía): del punto (x1, y1) al texto en (x2, y2)
function callout(add, x1, y1, x2, y2, t, anchor = 'start') {
    add('line', { x1, y1, x2, y2, stroke: '#525252', 'stroke-width': 1 });
    add('circle', { cx: x1, cy: y1, r: 2, fill: '#525252' });
    return label(add, x2 + (anchor === 'start' ? 4 : anchor === 'end' ? -4 : 0), y2 + 5, t, { 'font-size': 14, 'font-weight': 600, 'text-anchor': anchor, fill: '#23373B' });
}

// ---- Ayudantes propios de la UD13 (ondas, luz y sonido) ----

// Trazado de una onda sinusoidal: desde x0 hasta x0 + len, eje en y0, amplitud A, longitud de onda lam (px);
// phase en radianes. f(x) opcional para modular la amplitud. Devuelve el atributo d de un path.
function waveD(x0, y0, len, A, lam, phase = 0, step = 2) {
    let d = '';
    for (let x = 0; x <= len; x += step) {
        const y = y0 - A * Math.sin(2 * Math.PI * x / lam + phase);
        d += (x ? ' L' : 'M') + (x0 + x).toFixed(1) + ' ' + y.toFixed(1);
    }
    return d;
}
function wave(add, x0, y0, len, A, lam, o = {}) {
    return add('path', { d: waveD(x0, y0, len, A, lam, o.phase ?? 0), fill: 'none', stroke: o.col ?? '#2E86C1', 'stroke-width': o.w ?? 3, 'stroke-linecap': 'round' });
}

// Muelle visto de lado: espiras desde x0 hasta x1 a la altura y; dens(u) (u entre 0 y 1) da la densidad
// relativa de espiras en cada punto (1 = normal; > 1 comprimido). n = número de espiras en reposo.
function spring(add, x0, x1, y, r = 12, n = 40, dens = () => 1, col = '#7F8C8D') {
    // integra la densidad para repartir las espiras
    const N = 400, cum = [0];
    for (let i = 1; i <= N; i++) cum.push(cum[i - 1] + dens((i - 0.5) / N));
    const tot = cum[N], xs = [];
    for (let k = 0; k <= n; k++) {
        const target = k / n * tot;
        let i = 0; while (i < N && cum[i + 1] < target) i++;
        const u = (i + (target - cum[i]) / Math.max(1e-9, cum[i + 1] - cum[i])) / N;
        xs.push(x0 + Math.min(1, u) * (x1 - x0));
    }
    let d = `M${xs[0]} ${y}`;
    for (let k = 0; k < n; k++) {
        const a = xs[k], b = xs[k + 1], m = (a + b) / 2;
        d += ` C${a} ${y - r * 1.3} ${m} ${y - r * 1.3} ${m} ${y} C${m} ${y + r * 1.3} ${b} ${y + r * 1.3} ${b} ${y}`;
    }
    add('path', { d, fill: 'none', stroke: col, 'stroke-width': 1.8 });
}

// Altavoz mirando a la derecha; (x, y) = centro de la membrana; s = escala
function speaker(add, x, y, s = 1) {
    add('rect', { x: x - 44 * s, y: y - 20 * s, width: 26 * s, height: 40 * s, rx: 3 * s, fill: '#5D6D7E', stroke: '#2C3E50', 'stroke-width': 1.5 });
    add('path', { d: `M${x - 18 * s} ${y - 14 * s} L${x} ${y - 42 * s} L${x + 6 * s} ${y - 42 * s} L${x + 6 * s} ${y + 42 * s} L${x} ${y + 42 * s} L${x - 18 * s} ${y + 14 * s} Z`, fill: '#AEB6BF', stroke: '#2C3E50', 'stroke-width': 1.5 });
    add('line', { x1: x + 6 * s, y1: y - 42 * s, x2: x + 6 * s, y2: y + 42 * s, stroke: '#2C3E50', 'stroke-width': 3 * s });
}

// Partículas de aire con zonas de compresión y enrarecimiento: x0..x1, y0..y1; lam = longitud de onda (px)
function airParticles(add, x0, x1, y0, y1, lam, n = 600, seed = 7, col = '#2E86C1', phase = 0) {
    const R = rng(seed);
    let placed = 0, tries = 0;
    while (placed < n && tries < n * 20) {
        tries++;
        const x = x0 + R() * (x1 - x0), y = y0 + R() * (y1 - y0);
        const p = 0.5 + 0.5 * Math.cos(2 * Math.PI * (x - x0) / lam + phase);   // 1 = compresión
        if (R() < 0.15 + 0.85 * p) { add('circle', { cx: x, cy: y, r: 1.8, fill: col }); placed++; }
    }
}

// Línea discontinua
function dashed(add, x1, y1, x2, y2, col = '#7F8C8D', w = 1.5) {
    return add('line', { x1, y1, x2, y2, stroke: col, 'stroke-width': w, 'stroke-dasharray': '6 5' });
}

// Arco de ángulo con rótulo, ángulos en grados (convención matemática, como pol)
function angleArc(add, cx, cy, r, a1, a2, t, col = '#23373B', o = {}) {
    add('path', { d: arcD(cx, cy, r, a1, a2), fill: 'none', stroke: col, 'stroke-width': o.w ?? 1.8 });
    if (t) {
        const [lx, ly] = pol(cx, cy, r + (o.dr ?? 14), (a1 + a2) / 2);
        const e = label(add, lx, ly + 5, '', { 'font-size': o.fs ?? 16, fill: col, 'font-style': 'italic' });
        e.innerHTML = t.replace(/_(\w+)/, '<tspan baseline-shift="sub" font-size="70%" font-style="normal">$1</tspan>');
    }
}

// Rayo con flecha a mitad de camino (de (x1, y1) a (x2, y2))
function ray(add, x1, y1, x2, y2, col = '#C0392B', w = 2.5, frac = 0.55) {
    add('line', { x1, y1, x2, y2, stroke: col, 'stroke-width': w });
    const xm = x1 + (x2 - x1) * frac, ym = y1 + (y2 - y1) * frac;
    const a = Math.atan2(y2 - y1, x2 - x1), h = 11;
    add('path', { d: `M${xm + h * 0.6 * Math.cos(a)} ${ym + h * 0.6 * Math.sin(a)} L${xm - h * Math.cos(a - 0.45)} ${ym - h * Math.sin(a - 0.45)} L${xm - h * Math.cos(a + 0.45)} ${ym - h * Math.sin(a + 0.45)} Z`, fill: col });
}

// Color aproximado de una longitud de onda visible (nm), como en la UD2
function wl2rgb(wl) {
    let r = 0, g = 0, b = 0;
    if (wl < 440) { r = -(wl - 440) / 60; b = 1; }
    else if (wl < 490) { g = (wl - 440) / 50; b = 1; }
    else if (wl < 510) { g = 1; b = -(wl - 510) / 20; }
    else if (wl < 580) { r = (wl - 510) / 70; g = 1; }
    else if (wl < 645) { r = 1; g = -(wl - 645) / 65; }
    else r = 1;
    let f = 1;
    if (wl < 420) f = 0.3 + 0.7 * (wl - 380) / 40;
    else if (wl > 700) f = 0.3 + 0.7 * (750 - wl) / 50;
    const c = v => Math.round(255 * Math.pow(v * f, 0.8));
    return `rgb(${c(r)},${c(g)},${c(b)})`;
}
// Gradiente arco iris (horizontal; reverse = violeta a la izquierda)
function rainbowGradient(add, id, reverse = false) {
    let stops = '';
    for (let wl = 380; wl <= 750; wl += 10) {
        const u = (wl - 380) / 370;
        stops += `<stop offset="${reverse ? u : 1 - u}" stop-color="${wl2rgb(wl)}"/>`;
    }
    add('defs', {}).innerHTML = `<linearGradient id="${id}" x1="0" x2="1">${stops}</linearGradient>`;
}

// Diapasón sobre su caja de resonancia; (x, y) = centro de la base de la caja; open = lado de la abertura
function tuningFork(add, x, y, s = 1, open = 'right') {
    add('rect', { x: x - 60 * s, y: y - 40 * s, width: 120 * s, height: 40 * s, fill: '#E59866', stroke: '#A04000', 'stroke-width': 1.5 });
    const ox = open === 'right' ? x + 60 * s - 3 : x - 60 * s - 3;
    add('rect', { x: ox, y: y - 32 * s, width: 6, height: 24 * s, fill: '#6E2C00' });
    add('rect', { x: x - 6 * s, y: y - 56 * s, width: 12 * s, height: 16 * s, fill: '#909497' });
    add('path', { d: `M${x - 3 * s} ${y - 56 * s} L${x - 3 * s} ${y - 66 * s} Q${x - 3 * s} ${y - 80 * s} ${x - 16 * s} ${y - 80 * s} L${x - 16 * s} ${y - 160 * s} M${x + 3 * s} ${y - 66 * s} Q${x + 3 * s} ${y - 80 * s} ${x + 16 * s} ${y - 80 * s} L${x + 16 * s} ${y - 160 * s} M${x - 3 * s} ${y - 66 * s} L${x + 3 * s} ${y - 66 * s}`, fill: 'none', stroke: '#85929E', 'stroke-width': 7 * s, 'stroke-linecap': 'round' });
}
