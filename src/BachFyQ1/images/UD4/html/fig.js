// Utilidades comunes de las figuras de la Unidad 3 (Física y Química 1.º Bach).
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

// Molécula de agua orientada: O en (x, y) y los dos H apuntando en la dirección ang (radianes)
function water(add, x, y, r = 7, ang = -Math.PI / 2) {
    const h = r * 0.62, d = r * 0.95;
    [ang - 0.92, ang + 0.92].forEach(a => bead(add, x + d * Math.cos(a), y + d * Math.sin(a), h, CPK.H));
    bead(add, x, y, r, CPK.O);
}

// Ion: bola con su carga en el centro
function ion(add, x, y, r, col, q) {
    bead(add, x, y, r, col);
    label(add, x, y + r * 0.38, q, { 'font-size': r * 1.05, fill: '#1B2631' });
}

// Tubo de ensayo: x, y = esquina superior izquierda; fill = fracción con líquido; devuelve el nivel
function tube(add, x, y, w, h, o = {}) {
    const lvl = y + h * (1 - (o.fill ?? 0.6)), r = w / 2;
    if (o.fill) add('path', { d: `M${x + 2} ${lvl} L${x + w - 2} ${lvl} L${x + w - 2} ${y + h - r} A${r - 2} ${r - 2} 0 0 1 ${x + 2} ${y + h - r} Z`, fill: o.color || '#AED6F1', opacity: 0.9 });
    add('path', { d: `M${x - 4} ${y} L${x} ${y + 4} L${x} ${y + h - r} A${r} ${r} 0 0 0 ${x + w} ${y + h - r} L${x + w} ${y + 4} L${x + w + 4} ${y}`, fill: 'none', stroke: '#5D6D7E', 'stroke-width': 2.5, 'stroke-linejoin': 'round' });
    return lvl;
}

// Matraz aforado: cx = eje, top = boca, R = radio del bulbo; o.level: 'aforo' | fracción del bulbo | 0
// Devuelve { mark, base } (altura de la marca de aforo y del fondo)
function flask(add, cx, top, R = 55, o = {}) {
    const nw = R * 0.36, nh = R * 2.1, cy = top + nh + Math.sqrt(R * R - nw * nw / 4), base = cy + R, mark = top + nh * 0.35;
    const col = o.color || '#AED6F1';
    const outline = `M${cx - nw / 2} ${top} L${cx - nw / 2} ${top + nh} A${R} ${R} 0 1 0 ${cx + nw / 2} ${top + nh} L${cx + nw / 2} ${top}`;
    const lev = o.level ?? 0;
    if (lev) {
        const clipId = 'fl' + Math.round(cx) + Math.round(top);
        const d = add('defs', {});
        d.innerHTML = `<clipPath id="${clipId}"><path d="${outline} Z"/></clipPath>`;
        const yl = lev === 'aforo' ? mark : base - (base - (cy - R)) * lev;
        add('rect', { x: cx - R - 5, y: yl, width: 2 * R + 10, height: base - yl + 5, fill: col, opacity: 0.9, 'clip-path': `url(#${clipId})` });
    }
    add('path', { d: outline, fill: 'none', stroke: '#5D6D7E', 'stroke-width': 2.5, 'stroke-linejoin': 'round' });
    add('line', { x1: cx - nw / 2, y1: mark, x2: cx + nw / 2, y2: mark, stroke: '#C0392B', 'stroke-width': 2 });
    if (o.stopper) add('rect', { x: cx - nw / 2 - 3, y: top - 16, width: nw + 6, height: 18, rx: 4, fill: '#85929E' });
    return { mark, base, cy };
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

// ---- Añadidos de la Unidad 3 ----
// Color aproximado de una radiación visible de longitud de onda wl (nm)
function wlColor(wl) {
    let r = 0, g = 0, b = 0;
    if (wl < 440) { r = (440 - wl) / 60; b = 1; }
    else if (wl < 490) { g = (wl - 440) / 50; b = 1; }
    else if (wl < 510) { g = 1; b = (510 - wl) / 20; }
    else if (wl < 580) { r = (wl - 510) / 70; g = 1; }
    else if (wl < 645) { r = 1; g = (645 - wl) / 65; }
    else { r = 1; }
    let f = 1;
    if (wl < 420) f = 0.3 + 0.7 * (wl - 380) / 40; else if (wl > 700) f = 0.3 + 0.7 * (780 - wl) / 80;
    const k = v => Math.round(255 * Math.pow(Math.max(0, Math.min(1, v * f)), 0.8));
    return `rgb(${k(r)},${k(g)},${k(b)})`;
}

// Degradado lineal horizontal del espectro visible (x0..x1 = 380..750 nm); devuelve su url()
function spectrumGrad(add, id, wl0 = 380, wl1 = 750) {
    const d = add('defs', {});
    let st = '';
    for (let k = 0; k <= 40; k++) { const wl = wl0 + (wl1 - wl0) * k / 40; st += `<stop offset="${k / 40}" stop-color="${wlColor(wl)}"/>`; }
    d.innerHTML = `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0">${st}</linearGradient>`;
    return `url(#${id})`;
}

// Nube de puntos (densidad electrónica) alrededor de (x, y); rx, ry = semiejes; n = número de puntos
function cloud(add, x, y, rx, ry, n, col, seed = 1, rmin = 0) {
    const r = rng(seed);
    for (let k = 0; k < n; k++) {
        const a = r() * 2 * Math.PI;
        const u = r(), v = r();
        const rr = rmin + (1 - rmin) * Math.sqrt(-2 * Math.log(u + 1e-9)) * 0.38 * (0.6 + 0.4 * v);
        if (rr > 1) continue;
        add('circle', { cx: x + rr * rx * Math.cos(a), cy: y + rr * ry * Math.sin(a), r: 1.3, fill: col, opacity: 0.55 });
    }
}

// Núcleo: protones y neutrones apiñados
function nucleus(add, x, y, np, nn, r = 6, seed = 5) {
    const R = rng(seed), P = [];
    const tot = np + nn; const ids = [];
    for (let k = 0; k < tot; k++) ids.push(k < np ? 'p' : 'n');
    ids.sort(() => R() - 0.5);
    const rad = r * Math.sqrt(tot) * 0.62;
    ids.forEach((t, k) => {
        const a = k * 2.39996, d = rad * Math.sqrt((k + 0.5) / tot);
        P.push([x + d * Math.cos(a), y + d * Math.sin(a), t]);
    });
    P.sort((a, b) => a[1] - b[1]).forEach(([px, py, t]) => bead(add, px, py, r, t === 'p' ? '#E74C3C' : '#AAB7B8'));
}
