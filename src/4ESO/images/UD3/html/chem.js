// Utilidades de química para las figuras de la Unidad 3 (requiere fig.js)

// Colores CPK sencillos para modelos de bolas
const CPK = { H: '#ECF0F1', C: '#4D5656', N: '#2E86C1', O: '#E74C3C', F: '#58D68D', Cl: '#27AE60',
    Br: '#A04000', I: '#7D3C98', S: '#F4D03F', Si: '#D4AC0D', Na: '#AF7AC5', Mg: '#45B39D' };

// Diagrama de Lewis de un átomo: símbolo con n electrones de valencia como puntos.
// pairs (opcional): array de 4 números (arriba, derecha, abajo, izquierda) con los electrones de cada lado.
function lewis(add, x, y, sym, n, o = {}) {
    const fs = o.size || 30, col = o.color || '#23373B', dot = o.dot || '#C0392B';
    add('text', { x, y: y + fs * 0.35, 'text-anchor': 'middle', 'font-size': fs, 'font-weight': 800, fill: col }, sym);
    let sides = o.pairs;
    if (!sides) {
        sides = [0, 0, 0, 0];
        if (n === 2 && o.he) sides = [0, 2, 0, 0];
        else for (let i = 0; i < n; i++) sides[i % 4]++;
    }
    const w = fs * (sym.length > 1 ? 0.62 : 0.45) + 6, h = fs * 0.55 + 4, r = o.r || 3.4, g = 5.5;
    const pos = [[x, y - h, 1, 0], [x + w, y, 0, 1], [x, y + h, 1, 0], [x - w, y, 0, 1]];
    sides.forEach((k, i) => {
        const [px, py, dx, dy] = pos[i];
        const pts = k === 1 ? [[px, py]] : k === 2 ? [[px - g * dx, py - g * dy], [px + g * dx, py + g * dy]] : [];
        pts.forEach(([a, b]) => {
            if (o.cross && o.cross[i]) {   // aspa (×) para distinguir electrones de otro átomo
                add('path', { d: `M${a - r} ${b - r} L${a + r} ${b + r} M${a - r} ${b + r} L${a + r} ${b - r}`, stroke: o.crossColor || '#2471A3', 'stroke-width': 2 });
            } else add('circle', { cx: a, cy: b, r, fill: dot });
        });
    });
}

// Bola de un modelo de bolas y varillas
function ball(add, x, y, el, r = 18, label = true) {
    const id = 'g' + el + Math.round(r);
    if (!document.getElementById(id)) {
        const d = add('defs', {});
        d.innerHTML = `<radialGradient id="${id}" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="${CPK[el] || '#AAB7B8'}"/><stop offset="1" stop-color="${shade(CPK[el] || '#AAB7B8')}"/></radialGradient>`;
    }
    add('circle', { cx: x, cy: y, r, fill: `url(#${id})`, stroke: '#5D6D7E', 'stroke-width': 1 });
    if (label) add('text', { x, y: y + r * 0.35, 'text-anchor': 'middle', 'font-size': r * 0.9, 'font-weight': 800, fill: el === 'H' ? '#23373B' : '#fff' }, el);
}

function shade(hex) {
    const n = parseInt(hex.slice(1), 16);
    const f = v => Math.max(0, Math.round(v * 0.55));
    return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
}

function bond(add, x1, y1, x2, y2, order = 1, col = '#7F8C8D') {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, s = 5;
    const offs = order === 1 ? [0] : order === 2 ? [-s, s] : [-2 * s, 0, 2 * s];
    offs.forEach(k => add('line', { x1: x1 + nx * k, y1: y1 + ny * k, x2: x2 + nx * k, y2: y2 + ny * k, stroke: col, 'stroke-width': 5, 'stroke-linecap': 'round' }));
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
        .replace(/\^([0-9]*[+−-])/g, '<tspan baseline-shift="super" font-size="70%">$1</tspan>')
        .replace(/\^(δ[+−])/g, '<tspan baseline-shift="super" font-size="70%">$1</tspan>');
    return t;
}
