// fig.js — utilidades para las figuras de Física 2.º Bachillerato (fondo blanco, SVG en línea).
// Cada HTML llama a lienzo(W, H) y dibuja con estas funciones; render.sh imprime la página a PDF vectorial.
const NS = 'http://www.w3.org/2000/svg';
const C = {
    tinta: '#1d1d1f', gris: '#8a8a8a', claro: '#d9d9e3', morado: '#5e35b1', moradoClaro: '#ede7f6',
    rojo: '#c62828', azul: '#1565c0', verde: '#2e7d32', naranja: '#ef6c00', masa: '#7e57c2'
};
let S = null, DEFS = null, _id = 0;

function lienzo(W, H) {
    const st = document.createElement('style');
    st.textContent = `@page { size: ${W}px ${H}px; margin: 0; }
        html, body { margin: 0; padding: 0; width: ${W}px; height: ${H}px; overflow: hidden; background: #fff; }
        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; } svg { display: block; }`;
    document.head.appendChild(st);
    S = document.createElementNS(NS, 'svg');
    S.setAttribute('width', W); S.setAttribute('height', H); S.setAttribute('viewBox', `0 0 ${W} ${H}`);
    document.body.appendChild(S);
    DEFS = E(S, 'defs');
    return S;
}
function E(p, tag, a = {}, txt) {
    const e = document.createElementNS(NS, tag);
    for (const k in a) if (a[k] !== undefined && a[k] !== null) e.setAttribute(k, a[k]);
    if (txt !== undefined) e.textContent = txt;
    p.appendChild(e);
    return e;
}
function G(p = S, a = {}) { return E(p, 'g', a); }
function linea(x1, y1, x2, y2, o = {}) {
    return E(o.p ?? S, 'line', { x1, y1, x2, y2, stroke: o.c ?? C.tinta, 'stroke-width': o.w ?? 2, 'stroke-dasharray': o.dash, 'stroke-linecap': 'round' });
}
function camino(d, o = {}) {
    return E(o.p ?? S, 'path', { d, fill: o.fill ?? 'none', stroke: o.c ?? C.tinta, 'stroke-width': o.w ?? 2, 'stroke-dasharray': o.dash, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
}
function flecha(x1, y1, x2, y2, o = {}) {
    const c = o.c ?? C.tinta, w = o.w ?? 2.5, h = o.head ?? 12;
    const a = Math.atan2(y2 - y1, x2 - x1);
    const bx = x2 - Math.cos(a) * h * .85, by = y2 - Math.sin(a) * h * .85;
    linea(x1, y1, bx, by, { c, w, dash: o.dash, p: o.p });
    const k = h * .5;
    E(o.p ?? S, 'polygon', {
        fill: c, points: [[x2, y2], [x2 - Math.cos(a) * h + Math.sin(a) * k, y2 - Math.sin(a) * h - Math.cos(a) * k],
            [x2 - Math.cos(a) * h - Math.sin(a) * k, y2 - Math.sin(a) * h + Math.cos(a) * k]].map(q => q.join(',')).join(' ')
    });
    if (o.doble) flecha(x2, y2, x1, y1, { ...o, doble: false });
}
// Texto con cursiva para magnitudes: 'F_{e}', 'v^2', y '\\vec F' (flecha encima)
function texto(x, y, s, o = {}) {
    const size = o.size ?? 20;
    const t = E(o.p ?? S, 'text', {
        x, y, 'font-size': size, fill: o.c ?? C.tinta, 'text-anchor': o.anchor ?? 'middle',
        'font-family': o.family ?? 'Cambria, "Cambria Math", "Times New Roman", serif',
        'font-style': o.italic === false ? 'normal' : (o.italic ? 'italic' : 'normal'), 'font-weight': o.bold ? 700 : 400
    });
    if (o.halo) { t.setAttribute('stroke', '#fff'); t.setAttribute('stroke-width', 5); t.setAttribute('paint-order', 'stroke'); t.setAttribute('stroke-linejoin', 'round'); }
    const partes = s.split(/(_\{[^}]*\}|_[A-Za-z0-9]|\^\{[^}]*\}|\^[0-9+\-])/).filter(q => q !== '');
    let base = 0;
    for (const q of partes) {
        let dy = 0, fs = size, txt = q;
        if (q[0] === '_') { dy = size * .3; fs = size * .68; txt = q.replace(/^_\{?|\}$/g, ''); }
        else if (q[0] === '^') { dy = -size * .38; fs = size * .68; txt = q.replace(/^\^\{?|\}$/g, ''); }
        E(t, 'tspan', { dy: dy - base, 'font-size': fs }, txt);
        base = dy;
    }
    return t;
}
function vecTexto(x, y, s, o = {}) { // letra con flecha de vector encima
    const size = o.size ?? 20;
    const t = texto(x, y, s, { ...o, italic: true });
    const bb = t.getBBox(), w = size * .5, yy = y - size * .82;
    const xa = bb.x + 1, xb = xa + w;
    linea(xa, yy, xb, yy, { c: o.c ?? C.tinta, w: 1.3, p: o.p });
    E(o.p ?? S, 'polygon', { fill: o.c ?? C.tinta, points: `${xb + 2},${yy} ${xb - 3},${yy - 3} ${xb - 3},${yy + 3}` });
}
function muelle(x, y1, y2, o = {}) {
    const w = o.ancho ?? 12, n = o.n ?? 12, h = y2 - y1, e = Math.min(10, h * .1);
    let d = `M${x},${y1} L${x},${y1 + e}`;
    for (let i = 1; i <= n; i++) d += ` L${x + (i % 2 ? w : -w)},${y1 + e + (h - 2 * e) * (i - .5) / n}`;
    d += ` L${x},${y2 - e} L${x},${y2}`;
    return camino(d, { c: o.c ?? C.tinta, w: o.w ?? 2, p: o.p });
}
function muelleH(x1, x2, y, o = {}) { // muelle horizontal
    const w = o.ancho ?? 12, n = o.n ?? 14, L = x2 - x1, e = Math.min(10, L * .08);
    let d = `M${x1},${y} L${x1 + e},${y}`;
    for (let i = 1; i <= n; i++) d += ` L${x1 + e + (L - 2 * e) * (i - .5) / n},${y + (i % 2 ? -w : w)}`;
    d += ` L${x2 - e},${y} L${x2},${y}`;
    return camino(d, { c: o.c ?? C.tinta, w: o.w ?? 2, p: o.p });
}
function rayado(x, y, w, h, o = {}) { // techo o pared rayada
    const id = 'r' + (++_id);
    const pat = E(DEFS, 'pattern', { id, width: 8, height: 8, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' });
    E(pat, 'line', { x1: 0, y1: 0, x2: 0, y2: 8, stroke: C.gris, 'stroke-width': 2 });
    E(o.p ?? S, 'rect', { x, y, width: w, height: h, fill: `url(#${id})` });
}
function caja(x, y, w, h, o = {}) {
    E(o.p ?? S, 'rect', { x, y, width: w, height: h, rx: o.rx ?? 3, fill: o.fill ?? C.moradoClaro, stroke: o.c ?? C.morado, 'stroke-width': o.w ?? 2 });
    if (o.txt) texto(x + w / 2, y + h / 2 + 7, o.txt, { italic: true, size: o.size ?? 20, p: o.p });
}
function bola(x, y, r, o = {}) {
    E(o.p ?? S, 'circle', { cx: x, cy: y, r, fill: o.fill ?? C.masa, stroke: o.c ?? C.tinta, 'stroke-width': o.w ?? 1.5, opacity: o.op, 'stroke-dasharray': o.dash });
}
function punto(x, y, r = 3.5, c = C.tinta) { E(S, 'circle', { cx: x, cy: y, r, fill: c }); }
function arco(cx, cy, r, a0, a1, o = {}) { // ángulos en grados, medidos como en matemáticas (y hacia arriba)
    const p0 = [cx + r * Math.cos(a0 * Math.PI / 180), cy - r * Math.sin(a0 * Math.PI / 180)];
    const p1 = [cx + r * Math.cos(a1 * Math.PI / 180), cy - r * Math.sin(a1 * Math.PI / 180)];
    return camino(`M${p0} A${r},${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0},${a1 > a0 ? 0 : 1} ${p1}`, o);
}
// Trayectoria de una función y = f(x) entre x0 y x1 (coordenadas del lienzo)
function curva(f, x0, x1, paso = 2) {
    let d = '';
    for (let x = x0; x <= x1 + 1e-9; x += paso) d += (d ? ' L' : 'M') + x.toFixed(1) + ',' + f(x).toFixed(1);
    return d;
}
// Onda senoidal: eje en y, amplitud A (px), longitud de onda lam (px), fase en rad
function seno(x0, x1, y, A, lam, fase = 0) {
    return curva(x => y - A * Math.sin(2 * Math.PI * (x - x0) / lam + fase), x0, x1);
}
// Cota con flechas en los dos extremos y texto en medio
function cota(x1, y1, x2, y2, s, o = {}) {
    flecha(x1, y1, x2, y2, { c: o.c ?? C.tinta, w: o.w ?? 1.6, head: o.head ?? 9, doble: true });
    texto((x1 + x2) / 2 + (o.dx ?? 0), (y1 + y2) / 2 + (o.dy ?? -8), s, { italic: true, size: o.size ?? 18, c: o.c ?? C.tinta, anchor: o.anchor });
}
