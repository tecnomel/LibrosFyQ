// Utilidades comunes de las figuras de la Unidad 1 (Física y Química 1.º Bach).
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

// Colores de los átomos (CPK) y radios relativos, para dibujar moléculas con bolas
const CPK = { H: '#ECF0F1', O: '#E74C3C', C: '#566573', N: '#3498DB', Cl: '#58D68D', S: '#F4D03F', Na: '#AF7AC5', Fe: '#CA6F1E', He: '#F5B7B1', A: '#2E86C1', B: '#F4D03F' };
const RAD = { H: 0.62, O: 0.95, C: 1, N: 0.95, Cl: 1.15, S: 1.15, Na: 1.2, Fe: 1.15, He: 0.6, A: 1, B: 0.75 };

// Molécula: lista de [elemento, dx, dy] en unidades del radio r; se dibuja de atrás adelante
function molecule(add, x, y, atoms, r = 12) {
    atoms.forEach(([el, dx, dy]) => bead(add, x + dx * r, y + dy * r, r * (RAD[el] || 1), CPK[el] || '#999'));
}

// Moléculas habituales (en unidades de r)
const MOL = {
    H2: [['H', -0.55, 0], ['H', 0.55, 0]],
    O2: [['O', -0.75, 0], ['O', 0.75, 0]],
    N2: [['N', -0.75, 0], ['N', 0.75, 0]],
    Cl2: [['Cl', -0.85, 0], ['Cl', 0.85, 0]],
    HCl: [['H', -0.95, 0], ['Cl', 0.35, 0]],
    H2O: [['H', -0.85, 0.55], ['H', 0.85, 0.55], ['O', 0, 0]],
    NH3: [['H', -0.9, 0.55], ['H', 0.9, 0.55], ['N', 0, 0], ['H', 0, -0.95]],
    CO: [['C', -0.7, 0], ['O', 0.7, 0]],
    CO2: [['O', -1.35, 0], ['O', 1.35, 0], ['C', 0, 0]],
    CS2: [['S', -1.5, 0], ['S', 1.5, 0], ['C', 0, 0]],
    SO: [['O', 0.85, 0], ['S', -0.6, 0]],
    SO2: [['O', -1.1, 0.75], ['O', 1.1, 0.75], ['S', 0, 0]],
    SO3: [['O', -1.2, 0.7], ['O', 1.2, 0.7], ['O', 0, -1.35], ['S', 0, 0]],
    He: [['He', 0, 0]],
};

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
