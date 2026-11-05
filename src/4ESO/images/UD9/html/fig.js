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

// Imán de barra centrado en (x, y), horizontal; N a la izquierda salvo flip = true
function magnet(add, x, y, w = 160, h = 40, flip = false) {
    const L = flip ? ['S', '#2E86C1'] : ['N', '#C0392B'], R = flip ? ['N', '#C0392B'] : ['S', '#2E86C1'];
    add('rect', { x: x - w / 2, y: y - h / 2, width: w / 2, height: h, fill: L[1], stroke: '#23373B', 'stroke-width': 1.5 });
    add('rect', { x, y: y - h / 2, width: w / 2, height: h, fill: R[1], stroke: '#23373B', 'stroke-width': 1.5 });
    label(add, x - w / 2 + 16, y + 6, L[0], { fill: '#fff', 'font-size': 17 });
    label(add, x + w / 2 - 16, y + 6, R[0], { fill: '#fff', 'font-size': 17 });
}

// Brújula: aguja que apunta (extremo norte, rojo) en la dirección ang (grados, antihorario)
function compass(add, x, y, r = 22, ang = 90) {
    add('circle', { cx: x, cy: y, r, fill: '#FDFEFE', stroke: '#5D6D7E', 'stroke-width': 2 });
    const [nx, ny] = pol(x, y, r - 4, ang), [sx, sy] = pol(x, y, r - 4, ang + 180);
    const [px, py] = pol(x, y, 4, ang + 90), [qx, qy] = pol(x, y, 4, ang - 90);
    add('path', { d: `M${nx} ${ny} L${px} ${py} L${qx} ${qy} Z`, fill: '#C0392B' });
    add('path', { d: `M${sx} ${sy} L${px} ${py} L${qx} ${qy} Z`, fill: '#5D6D7E' });
    add('circle', { cx: x, cy: y, r: 2.5, fill: '#23373B' });
}

// Carga puntual: círculo con signo
function charge(add, x, y, sgn, r = 18) {
    const c = sgn > 0 ? '#C0392B' : '#2471A3';
    bead(add, x, y, r, c);
    label(add, x, y + r * 0.38, sgn > 0 ? '+' : '−', { fill: '#fff', 'font-size': r * 1.15 });
}
