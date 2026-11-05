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
// Carga puntual: círculo rojo (+) o azul (−) con su signo
function carga(x, y, r, q, o = {}) {
    E(o.p ?? S, 'circle', { cx: x, cy: y, r, fill: q > 0 ? '#ef5350' : '#42a5f5', stroke: C.tinta, 'stroke-width': 1.4 });
    const s = r * 0.5;
    linea(x - s, y, x + s, y, { c: '#fff', w: 2.4, p: o.p });
    if (q > 0) linea(x, y - s, x, y + s, { c: '#fff', w: 2.4, p: o.p });
}
// Líneas de campo de un conjunto de cargas [x, y, q, r]; salen de las positivas (n líneas por unidad de carga).
// Si no hay positivas, se trazan desde las negativas hacia fuera. Devuelve nada; dibuja en el grupo g.
function lineasCampo(cargas, caja, nPorUnidad, o = {}) {
    const g = o.p ?? S;
    const campoE = (x, y) => { let ex = 0, ey = 0; cargas.forEach(([cx, cy, q]) => { const dx = x - cx, dy = y - cy, r2 = dx * dx + dy * dy, r = Math.sqrt(r2); ex += q * dx / (r2 * r); ey += q * dy / (r2 * r); }); return [ex, ey]; };
    const fuentes = cargas.filter(c => c[2] > 0).length ? cargas.filter(c => c[2] > 0) : cargas;
    const signo = cargas.some(c => c[2] > 0) ? 1 : -1;
    fuentes.forEach(([cx, cy, q, rad]) => {
        const n = Math.round(nPorUnidad * Math.abs(q));
        for (let k = 0; k < n; k++) {
            const a = 2 * Math.PI * (k + 0.5) / n + (o.giro ?? 0);
            let x = cx + (rad + 1) * Math.cos(a), y = cy + (rad + 1) * Math.sin(a); const pts = [[x, y]];
            for (let s = 0; s < 1500; s++) {
                const [ex, ey] = campoE(x, y), l = Math.hypot(ex, ey); if (l < 1e-14) break;
                x += signo * 1.5 * ex / l; y += signo * 1.5 * ey / l; pts.push([x, y]);
                if (x < caja[0] - 10 || x > caja[2] + 10 || y < caja[1] - 10 || y > caja[3] + 10) break;
                if (cargas.some(([qx, qy, qq, qr]) => (qx !== cx || qy !== cy) && Math.hypot(qx - x, qy - y) < qr)) break;
            }
            E(g, 'path', { d: 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L'), fill: 'none', stroke: o.c ?? C.morado, 'stroke-width': 1.2 });
            const i = Math.min(Math.floor(pts.length / 2), 40);
            if (pts.length > 12) {
                const [p0, p1] = signo > 0 ? [pts[i], pts[i + 1]] : [pts[i + 1], pts[i]];
                flecha(p0[0], p0[1], p0[0] + (p1[0] - p0[0]) * 4, p0[1] + (p1[1] - p0[1]) * 4, { c: o.c ?? C.morado, w: 1.2, head: 8, p: g });
            }
        }
    });
}
function recorteCaja(caja) {
    const id = 'c' + (++_id); const cp = E(DEFS, 'clipPath', { id });
    E(cp, 'rect', { x: caja[0], y: caja[1], width: caja[2] - caja[0], height: caja[3] - caja[1] });
    return G(S, { 'clip-path': `url(#${id})` });
}
// ---------- campo magnético (UD6) ----------
// Corriente perpendicular al papel: sale (⊙) si sale = true; entra (⊗) si no.
function corriente(x, y, r, sale, o = {}) {
    E(o.p ?? S, 'circle', { cx: x, cy: y, r, fill: '#fff', stroke: o.c ?? C.tinta, 'stroke-width': 1.6 });
    if (sale) E(o.p ?? S, 'circle', { cx: x, cy: y, r: r * 0.28, fill: o.c ?? C.tinta });
    else { const s = r * 0.6; linea(x - s, y - s, x + s, y + s, { c: o.c ?? C.tinta, w: 1.6, p: o.p }); linea(x - s, y + s, x + s, y - s, { c: o.c ?? C.tinta, w: 1.6, p: o.p }); }
}
// Rejilla de símbolos de campo perpendicular (× entrante, • saliente)
function aspas(x0, y0, x1, y1, paso, sale, o = {}) {
    for (let x = x0; x <= x1; x += paso) for (let y = y0; y <= y1; y += paso) {
        if (sale) E(o.p ?? S, 'circle', { cx: x, cy: y, r: 2.6, fill: o.c ?? C.gris });
        else { linea(x - 4, y - 4, x + 4, y + 4, { c: o.c ?? C.gris, w: 1.3, p: o.p }); linea(x - 4, y + 4, x + 4, y - 4, { c: o.c ?? C.gris, w: 1.3, p: o.p }); }
    }
}
// Campo B (dirección en el lienzo, y hacia abajo) de corrientes rectilíneas [x, y, I] (I > 0: sale del papel)
function campoB(cor, x, y) {
    let bx = 0, by = 0;
    cor.forEach(([cx, cy, I]) => { const dx = x - cx, dy = y - cy, r2 = dx * dx + dy * dy; bx += I * dy / r2; by += -I * dx / r2; });
    return [bx, by];
}
// Líneas de campo: curvas de nivel de la función de corriente Ψ = Σ I·ln r (marching squares)
function lineasB(cor, caja, niveles, o = {}) {
    const g = o.p ?? S, paso = o.paso ?? 3;
    const psi = (x, y) => cor.reduce((s, [cx, cy, I]) => s + I * Math.log(Math.hypot(x - cx, y - cy) + 1e-9), 0);
    niveles.forEach(v0 => {
        let d = '';
        for (let x = caja[0]; x < caja[2]; x += paso) for (let y = caja[1]; y < caja[3]; y += paso) {
            const c = [[x, y], [x + paso, y], [x + paso, y + paso], [x, y + paso]], vs = c.map(([a, b]) => psi(a, b) - v0), pts = [];
            for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; if ((vs[i] > 0) !== (vs[j] > 0)) { const t = vs[i] / (vs[i] - vs[j]); pts.push([c[i][0] + t * (c[j][0] - c[i][0]), c[i][1] + t * (c[j][1] - c[i][1])]); } }
            if (pts.length >= 2) d += `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)} L${pts[1][0].toFixed(1)},${pts[1][1].toFixed(1)} `;
        }
        E(g, 'path', { d, fill: 'none', stroke: o.c ?? C.morado, 'stroke-width': o.w ?? 1.3 });
    });
}
// Punta de flecha que indica el sentido de B en el punto (x, y)
function sentidoB(cor, x, y, o = {}) {
    const [bx, by] = campoB(cor, x, y), l = Math.hypot(bx, by), u = [bx / l, by / l], h = o.h ?? 9;
    flecha(x - u[0] * h, y - u[1] * h, x + u[0] * h * 0.3, y + u[1] * h * 0.3, { c: o.c ?? C.morado, w: 1.2, head: h, p: o.p });
}
// Imán de barra horizontal (N a la derecha si nDer)
function imanBarra(x, y, w, h, nDer = true, o = {}) {
    const [cN, cS] = ['#e53935', '#1e88e5'];
    E(o.p ?? S, 'rect', { x, y, width: w / 2, height: h, fill: nDer ? cS : cN, stroke: C.tinta, 'stroke-width': 1.4 });
    E(o.p ?? S, 'rect', { x: x + w / 2, y, width: w / 2, height: h, fill: nDer ? cN : cS, stroke: C.tinta, 'stroke-width': 1.4 });
    texto(x + w / 4, y + h / 2 + 7, nDer ? 'S' : 'N', { c: '#fff', bold: true, size: o.size ?? 20 });
    texto(x + 3 * w / 4, y + h / 2 + 7, nDer ? 'N' : 'S', { c: '#fff', bold: true, size: o.size ?? 20 });
}
// Niveles de Ψ para que las líneas pasen por n puntos equiespaciados del segmento (x0,y0)-(x1,y1)
function nivelesPor(cor, x0, y0, x1, y1, n) {
    const psi = (x, y) => cor.reduce((s, [cx, cy, I]) => s + I * Math.log(Math.hypot(x - cx, y - cy) + 1e-9), 0);
    const v = []; for (let k = 0; k < n; k++) { const t = (k + 0.5) / n; v.push(psi(x0 + t * (x1 - x0), y0 + t * (y1 - y0))); } return v;
}
// Solenoide de N espiras visto en corte: fila superior saliente y fila inferior entrante (campo interior hacia la derecha)
function corteSolenoide(x0, x1, yTop, yBot, n, I = 1) {
    const c = []; for (let k = 0; k < n; k++) { const x = x0 + (x1 - x0) * (k + 0.5) / n; c.push([x, yTop, I]); c.push([x, yBot, -I]); } return c;
}
// Núcleo dibujado como racimo de protones (rojos) y neutrones (grises), con posiciones pseudoaleatorias reproducibles
function nucleoDibujo(cx, cy, Z, N, r = 7, o = {}) {
    let s = o.semilla ?? 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const n = Z + N, R = r * 1.05 * Math.cbrt(n) * 1.25, pts = [];
    for (let k = 0; k < n; k++) { const a = rnd() * 2 * Math.PI, d = R * Math.sqrt(rnd()) * 0.85; pts.push([cx + d * Math.cos(a), cy + d * Math.sin(a), rnd()]); }
    pts.sort((p, q) => p[2] - q[2]);
    let zp = Z; pts.forEach((p, k) => { const prot = zp > 0 && (k % 2 === 0 || n - k <= zp); if (prot) zp--; bola(p[0], p[1], r, { fill: prot ? '#ef5350' : '#b0bec5', c: C.tinta, w: 1 }); });
}
function neutron(x, y, r = 7) { bola(x, y, r, { fill: '#b0bec5', c: C.tinta, w: 1 }); }
