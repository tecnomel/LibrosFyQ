// =====================================================================
// dibujos.js — librería de dibujo para la portada y las cabeceras de
// capítulo (\chapterimage). Todo es SVG vectorial: degradados lineales y
// radiales y opacidades (sin filtros SVG, que Chrome rasteriza al imprimir).
//
// Uso:  iniciar(svg, PALETAS.azul);  fondo(svg, W, H);  ESCENAS.atomo(svg);
// Las escenas están pensadas para un lienzo de 1520 x 704 (proporción de
// las cabeceras antiguas). El recuadro del título del capítulo tapa la franja
// y = 488–610, así que el dibujo importante va en y < 480.
// Se copia igual en 2ESO/, 4ESO/ y 2BachQuimica/ (solo cambia la paleta).
// =====================================================================

const NS = 'http://www.w3.org/2000/svg';
let P = null, DEFS = null, _id = 0, _seed = 7, _escBokeh = 1;

const PALETAS = {
    azul: {
        bg0: '#030d24', bg1: '#08306a', bg2: '#1565c0', line: '#d8edff', glow: '#4fc3f7',
        acc: '#ffc94d', acc2: '#ff7a59', acc3: '#6ff0c4', liq: '#29b6f6', violet: '#b388ff'
    },
    verde: {
        bg0: '#021a12', bg1: '#06432c', bg2: '#1f8a52', line: '#e0ffee', glow: '#5ef0a8',
        acc: '#ffd54f', acc2: '#ff8a65', acc3: '#80d8ff', liq: '#4dd0e1', violet: '#ce93d8'
    },
    ocre: {
        bg0: '#1e0902', bg1: '#6a2606', bg2: '#d9590f', line: '#fff2e8', glow: '#ffb27a',
        acc: '#ffe08a', acc2: '#7fd4ff', acc3: '#a6f2b6', liq: '#5ec8ff', violet: '#d7a6ff'
    },
    rojo: {
        bg0: '#1c0206', bg1: '#560914', bg2: '#ad1f2f', line: '#ffe8e8', glow: '#ff7f8c',
        acc: '#ffd166', acc2: '#7fdbff', acc3: '#b8f28a', liq: '#7fdbff', violet: '#d7a6ff'
    },
    morado: {
        bg0: '#0e0520', bg1: '#2f1366', bg2: '#5e35b1', line: '#efe8ff', glow: '#b39dff',
        acc: '#ffd166', acc2: '#ff7a8a', acc3: '#7ff0d0', liq: '#64c8ff', violet: '#f48fb1'
    },
};

// Colores de los átomos (tipo CPK, aclarados para fondo oscuro)
const ATOMO = {
    H: '#f2f5f8', O: '#ff5a5a', C: '#8d9db3', N: '#6c8cff', Na: '#b48cff', Cl: '#6fe36b',
    S: '#ffd84d', Fe: '#d98c5f'
};

// ---------- utilidades ----------
function semilla(s) { _seed = s; }
function rnd() { _seed = (_seed * 16807) % 2147483647; return (_seed - 1) / 2147483646; }
function E(p, tag, a = {}, txt) {
    const e = document.createElementNS(NS, tag);
    for (const k in a) if (a[k] !== undefined && a[k] !== null) e.setAttribute(k, a[k]);
    if (txt !== undefined) e.textContent = txt;
    p.appendChild(e);
    return e;
}
function G(p, a = {}) { return E(p, 'g', a); }
function hex2rgb(h) { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); }
function mix(a, b, t) {
    const A = hex2rgb(a), B = hex2rgb(b);
    return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
}
function lin(stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1, user = false) {
    const id = 'g' + (++_id);
    const g = E(DEFS, 'linearGradient', { id, x1, y1, x2, y2, gradientUnits: user ? 'userSpaceOnUse' : undefined });
    stops.forEach(([o, c, op = 1]) => E(g, 'stop', { offset: o, 'stop-color': c, 'stop-opacity': op }));
    return `url(#${id})`;
}
function rad(stops, cx = .5, cy = .5, r = .5, fx, fy) {
    const id = 'g' + (++_id);
    const g = E(DEFS, 'radialGradient', { id, cx, cy, r, fx, fy });
    stops.forEach(([o, c, op = 1]) => E(g, 'stop', { offset: o, 'stop-color': c, 'stop-opacity': op }));
    return `url(#${id})`;
}
function recorte(build) {
    const id = 'c' + (++_id);
    build(E(DEFS, 'clipPath', { id }));
    return `url(#${id})`;
}
function iniciar(svg, pal) { P = pal; DEFS = E(svg, 'defs'); }

// ---------- primitivas con brillo ----------
function brillo(p, d, color, w = 3, extra = {}) {
    const g = G(p);
    [[w * 5, .07], [w * 2.6, .16], [w, 1]].forEach(([sw, op]) =>
        E(g, 'path', {
            d, fill: 'none', stroke: color, 'stroke-width': sw, 'stroke-opacity': op,
            'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra
        }));
    return g;
}
function halo(p, x, y, r, color, op = .55) {
    return E(p, 'circle', { cx: x, cy: y, r, fill: rad([[0, color, op], [.4, color, op * .35], [1, color, 0]]) });
}
function esfera(p, x, y, r, c, conHalo = false) {
    if (conHalo) halo(p, x, y, r * 2.4, c, .45);
    E(p, 'circle', {
        cx: x, cy: y, r,
        fill: rad([[0, mix(c, '#ffffff', .75)], [.45, c], [1, mix(c, '#000000', .55)]], .5, .5, .55, .35, .3)
    });
}
function elipseD(cx, cy, rx, ry) {
    return `M${cx - rx},${cy} a${rx},${ry} 0 1,0 ${2 * rx},0 a${rx},${ry} 0 1,0 ${-2 * rx},0`;
}
function flecha(p, x1, y1, x2, y2, color, w = 4, head = 18, etiqueta, opts = {}) {
    const a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1);
    const bx = x1 + Math.cos(a) * (L - head * .8), by = y1 + Math.sin(a) * (L - head * .8);
    brillo(p, `M${x1},${y1} L${bx},${by}`, color, w);
    const hx = head * .55;
    const pts = [[x2, y2],
        [x2 - Math.cos(a) * head + Math.sin(a) * hx, y2 - Math.sin(a) * head - Math.cos(a) * hx],
        [x2 - Math.cos(a) * head - Math.sin(a) * hx, y2 - Math.sin(a) * head + Math.cos(a) * hx]];
    halo(p, x2, y2, head * 1.2, color, .3);
    E(p, 'polygon', { points: pts.map(q => q.join(',')).join(' '), fill: color });
    if (etiqueta) {
        const ox = opts.dx ?? 0, oy = opts.dy ?? -14;
        texto(p, x2 + ox, y2 + oy, etiqueta, { size: opts.size ?? 30, fill: color, italic: true, weight: 700 });
    }
}
// Texto con subíndices (_2, _{10}) y superíndices (^2, ^{-}, ^+)
function texto(p, x, y, str, o = {}) {
    const size = o.size ?? 28;
    const t = E(p, 'text', {
        x, y, 'font-size': size, fill: o.fill ?? P.line, 'text-anchor': o.anchor ?? 'middle',
        'font-weight': o.weight ?? 400, 'font-family': o.family ?? 'Cambria, "Cambria Math", Georgia, serif',
        'font-style': o.italic ? 'italic' : undefined, opacity: o.op, 'letter-spacing': o.spacing,
        transform: o.rot ? `rotate(${o.rot} ${x} ${y})` : undefined
    });
    const partes = str.split(/(_\{[^}]*\}|_[0-9]+|_[A-Za-z]|\^\{[^}]*\}|\^[0-9+\-]+|\^[a-z])/).filter(s => s !== '');
    let base = 0;
    for (const s of partes) {
        let dy = 0, fs = size, txt = s;
        if (s[0] === '_') { dy = size * .28; fs = size * .65; txt = s.replace(/^_\{?|\}$/g, ''); }
        else if (s[0] === '^') { dy = -size * .38; fs = size * .65; txt = s.replace(/^\^\{?|\}$/g, ''); }
        E(t, 'tspan', { dy: dy - base, 'font-size': fs }, txt);
        base = dy;
    }
    return t;
}

// ---------- fondo común ----------
function rejillaHex(p, x0, y0, w, h, s, op, opFn) {
    const g = G(p);
    const dx = s * Math.sqrt(3), dy = s * 1.5;
    for (let r = -1; r * dy < h + s; r++) {
        for (let c = -1; c * dx < w + dx; c++) {
            const cx = x0 + c * dx + (r % 2 ? dx / 2 : 0), cy = y0 + r * dy;
            const o = op * (opFn ? opFn(cx, cy) : 1);
            if (o < .004) continue;
            let d = '';
            for (let k = 0; k < 6; k++) {
                const a = Math.PI / 3 * k + Math.PI / 6;
                d += (k ? 'L' : 'M') + (cx + s * Math.cos(a)).toFixed(1) + ',' + (cy + s * Math.sin(a)).toFixed(1);
            }
            E(g, 'path', { d: d + 'Z', fill: 'none', stroke: P.line, 'stroke-width': 1.4, 'stroke-opacity': o });
        }
    }
    return g;
}
function bokeh(p, n, x0, y0, w, h, rmin = 6, rmax = 40) {
    rmin *= _escBokeh; rmax *= _escBokeh;
    for (let i = 0; i < n; i++) {
        const x = x0 + rnd() * w, y = y0 + rnd() * h, r = rmin + rnd() * (rmax - rmin);
        const c = [P.glow, P.line, P.acc, P.glow][Math.floor(rnd() * 4)];
        E(p, 'circle', { cx: x, cy: y, r, fill: rad([[0, c, .32], [.7, c, .12], [1, c, 0]]) });
    }
}
function estrellas(p, n, x0, y0, w, h) {
    for (let i = 0; i < n; i++) {
        const x = x0 + rnd() * w, y = y0 + rnd() * h, r = .8 + rnd() * 2.2;
        E(p, 'circle', { cx: x, cy: y, r, fill: P.line, opacity: .25 + rnd() * .6 });
    }
}
function fondo(p, W, H, o = {}) {
    E(p, 'rect', { width: W, height: H, fill: lin([[0, P.bg0], [.55, P.bg1], [1, P.bg2]], 0, 0, 1, 1) });
    E(p, 'rect', { width: W, height: H, fill: rad([[0, P.glow, .30], [1, P.glow, 0]], o.gx ?? .7, o.gy ?? .32, .55) });
    E(p, 'rect', { width: W, height: H, fill: rad([[0, P.acc, .10], [1, P.acc, 0]], o.ax ?? .12, o.ay ?? .2, .45) });
    rejillaHex(p, 0, 0, W, H, o.hex ?? 34, .07, (x, y) => .35 + .65 * (x / W));
    _escBokeh = o.escBokeh ?? 1;
    bokeh(p, o.nbokeh ?? 26, 0, 0, W, H);
    E(p, 'rect', { width: W, height: H, fill: lin([[0, '#000', 0], [.6, '#000', 0], [1, '#000', .35]]) });
}

// ---------- material de laboratorio ----------
function vidrio(p, d, w = 3) {
    E(p, 'path', { d, fill: lin([[0, '#ffffff', .10], [.5, '#ffffff', .03], [1, '#ffffff', .12]], 0, 0, 1, 0) });
    brillo(p, d, P.line, w);
}
function burbujas(p, x0, y0, w, h, n, color = '#ffffff') {
    for (let i = 0; i < n; i++) {
        const r = 2.5 + rnd() * 7;
        E(p, 'circle', {
            cx: x0 + rnd() * w, cy: y0 + rnd() * h, r, fill: color, 'fill-opacity': .12,
            stroke: color, 'stroke-opacity': .7, 'stroke-width': 1.5
        });
    }
}
function liquido(c) { return lin([[0, mix(c, '#ffffff', .25), .85], [1, mix(c, '#000000', .35), .9]]); }

function erlenmeyer(p, cx, base, h, w, liq, f = .45) {
    const nw = w * .26, nh = h * .38, top = base - h;
    const xs = (y) => { // semiancho del cuerpo a la altura y
        const t = (y - (top + nh)) / (base - 8 - (top + nh));
        return nw / 2 + (w / 2 - 10 - nw / 2) * Math.max(0, Math.min(1, t));
    };
    const yl = base - (base - top - nh) * f;
    const dl = `M${cx - xs(yl)},${yl} L${cx - w / 2 + 10},${base - 8} Q${cx - w / 2},${base} ${cx - w / 2 + 14},${base}
        L${cx + w / 2 - 14},${base} Q${cx + w / 2},${base} ${cx + w / 2 - 10},${base - 8} L${cx + xs(yl)},${yl}Z`;
    E(p, 'path', { d: dl, fill: liquido(liq) });
    E(p, 'ellipse', { cx, cy: yl, rx: xs(yl), ry: 5, fill: mix(liq, '#ffffff', .5), opacity: .7 });
    burbujas(p, cx - xs(yl) * .6, yl + 10, xs(yl) * 1.2, base - yl - 20, 7);
    const d = `M${cx - nw / 2 - 9},${top} L${cx + nw / 2 + 9},${top} M${cx - nw / 2},${top} L${cx - nw / 2},${top + nh}
        L${cx - w / 2 + 10},${base - 8} Q${cx - w / 2},${base} ${cx - w / 2 + 14},${base} L${cx + w / 2 - 14},${base}
        Q${cx + w / 2},${base} ${cx + w / 2 - 10},${base - 8} L${cx + nw / 2},${top + nh} L${cx + nw / 2},${top}`;
    vidrio(p, d);
    brillo(p, `M${cx - nw / 2 + 6},${top + 12} L${cx - nw / 2 + 6},${top + nh - 6}`, '#ffffff', 2, { 'stroke-opacity': .5 });
}
function vaso(p, x, y, w, h, liq, f = .55, marcas = true) {
    const d = `M${x - 8},${y} Q${x},${y} ${x},${y + 10} L${x},${y + h - 12} Q${x},${y + h} ${x + 12},${y + h}
        L${x + w - 12},${y + h} Q${x + w},${y + h} ${x + w},${y + h - 12} L${x + w},${y}`;
    if (liq) {
        const yl = y + h - h * f;
        E(p, 'path', {
            d: `M${x + 2},${yl} L${x + 2},${y + h - 12} Q${x + 2},${y + h - 2} ${x + 12},${y + h - 2} L${x + w - 12},${y + h - 2}
            Q${x + w - 2},${y + h - 2} ${x + w - 2},${y + h - 12} L${x + w - 2},${yl}Z`, fill: liquido(liq)
        });
        E(p, 'ellipse', { cx: x + w / 2, cy: yl, rx: w / 2 - 2, ry: 5, fill: mix(liq, '#ffffff', .5), opacity: .6 });
    }
    vidrio(p, d);
    if (marcas) for (let i = 1; i <= 4; i++) {
        const yy = y + h - h * i / 5;
        E(p, 'line', { x1: x + w - 6, x2: x + w - 6 - (i % 2 ? 14 : 24), y1: yy, y2: yy, stroke: P.line, 'stroke-width': 2, opacity: .7 });
    }
}
function balon(p, cx, cy, R, liq, f = .5) {
    const nw = R * .36, top = cy - R * 1.9;
    const yl = cy + R - 2 * R * f;
    const clip = recorte(c => E(c, 'circle', { cx, cy, r: R - 2 }));
    E(p, 'rect', { x: cx - R, y: yl, width: 2 * R, height: R * 2, fill: liquido(liq), 'clip-path': clip });
    const hw = Math.sqrt(Math.max(0, (R - 2) ** 2 - (yl - cy) ** 2));
    E(p, 'ellipse', { cx, cy: yl, rx: hw, ry: 6, fill: mix(liq, '#ffffff', .5), opacity: .6 });
    burbujas(p, cx - hw * .7, yl + 8, hw * 1.4, cy + R - yl - 20, 9);
    const a = Math.asin(nw / 2 / R);
    const xL = cx - nw / 2, xR = cx + nw / 2, yN = cy - R * Math.cos(a);
    const d = `M${xL - 9},${top} L${xR + 9},${top} M${xL},${top} L${xL},${yN} A${R},${R} 0 1,0 ${xR},${yN} L${xR},${top}`;
    vidrio(p, d);
    brillo(p, `M${cx - R * .62},${cy - R * .35} A${R * .75},${R * .75} 0 0,1 ${cx - R * .2},${cy - R * .72}`, '#ffffff', 3, { 'stroke-opacity': .45 });
}
function probeta(p, x, y, w, h, liq, f = .6) {
    const yl = y + h - h * f;
    E(p, 'rect', { x: x + 2, y: yl, width: w - 4, height: y + h - yl - 2, fill: liquido(liq) });
    E(p, 'ellipse', { cx: x + w / 2, cy: yl, rx: w / 2 - 2, ry: 4, fill: mix(liq, '#ffffff', .5), opacity: .6 });
    vidrio(p, `M${x - 6},${y} L${x},${y + 6} L${x},${y + h} L${x + w},${y + h} L${x + w},${y}`);
    brillo(p, `M${x - w * .35},${y + h + 12} L${x + w * 1.35},${y + h + 12}`, P.line, 4);
    for (let i = 1; i < 10; i++) {
        const yy = y + h - h * i / 10;
        E(p, 'line', { x1: x + 4, x2: x + 4 + (i % 5 ? 10 : 20), y1: yy, y2: yy, stroke: P.line, 'stroke-width': 1.6, opacity: .8 });
    }
}
function tubo(p, x, y, w, h, liq, f = .5) {
    const yl = y + h - h * f;
    E(p, 'path', { d: `M${x + 2},${yl} L${x + 2},${y + h - w / 2} A${w / 2 - 2},${w / 2 - 2} 0 0,0 ${x + w - 2},${y + h - w / 2} L${x + w - 2},${yl}Z`, fill: liquido(liq) });
    vidrio(p, `M${x - 4},${y} L${x},${y + 4} L${x},${y + h - w / 2} A${w / 2},${w / 2} 0 0,0 ${x + w},${y + h - w / 2} L${x + w},${y + 4} L${x + w + 4},${y}`, 2.5);
}

// ---------- átomos y moléculas ----------
function bolas(p, atomos, enlaces = [], s = 1) {
    for (const [i, j, orden = 1] of enlaces) {
        const A = atomos[i], B = atomos[j];
        const nx = -(B[1] - A[1]), ny = B[0] - A[0], L = Math.hypot(nx, ny) || 1;
        const offs = orden === 1 ? [0] : orden === 2 ? [-6, 6] : [-9, 0, 9];
        for (const o of offs) {
            const ox = nx / L * o * s, oy = ny / L * o * s;
            E(p, 'line', { x1: A[0] + ox, y1: A[1] + oy, x2: B[0] + ox, y2: B[1] + oy, stroke: '#cfd8e3', 'stroke-width': (orden === 1 ? 11 : 6) * s, 'stroke-linecap': 'round', opacity: .9 });
        }
    }
    for (const [x, y, el, r] of atomos) esfera(p, x, y, r * s, ATOMO[el] ?? el);
}
function agua(p, cx, cy, s = 1, rot = 0) {
    const g = G(p, { transform: `rotate(${rot} ${cx} ${cy})` });
    const a = 52.25 * Math.PI / 180, d = 62 * s;
    bolas(g, [[cx - Math.sin(a) * d, cy + Math.cos(a) * d, 'H', 24], [cx + Math.sin(a) * d, cy + Math.cos(a) * d, 'H', 24], [cx, cy, 'O', 38]], [[2, 0], [2, 1]], s);
}
function atomoBohr(p, cx, cy, s = 1, nNuc = 13, angs = [0, 60, 120]) {
    const rx = 300 * s, ry = 88 * s;
    halo(p, cx, cy, 110 * s, P.glow, .5);
    angs.forEach((ang, k) => {
        const g = G(p, { transform: `rotate(${ang} ${cx} ${cy})` });
        brillo(g, elipseD(cx, cy, rx, ry), P.line, 2.2 * Math.max(s, .6), { 'stroke-opacity': .9 });
        const t = 1.1 + k * 2.2;
        esfera(g, cx + rx * Math.cos(t), cy + ry * Math.sin(t), 14 * s, P.glow, true);
    });
    const nuc = [];
    for (let i = 0; i < nNuc; i++) {
        const rr = 13 * s * Math.sqrt(i), an = i * 2.39996;
        nuc.push([cx + rr * Math.cos(an), cy + rr * Math.sin(an), i % 2 ? '#9fb6cc' : P.acc2, 17 * s]);
    }
    nuc.reverse().forEach(([x, y, c, r]) => esfera(p, x, y, r, c));
}
function ptMini(p, x, y, cel, simbolos = true) {
    const sym = {
        '1,1': 'H', '1,18': 'He', '2,1': 'Li', '2,2': 'Be', '2,13': 'B', '2,14': 'C', '2,15': 'N', '2,16': 'O', '2,17': 'F', '2,18': 'Ne',
        '3,1': 'Na', '3,2': 'Mg', '3,13': 'Al', '3,14': 'Si', '3,17': 'Cl', '4,1': 'K', '4,2': 'Ca', '4,8': 'Fe', '4,11': 'Cu', '4,12': 'Zn'
    };
    const g = G(p);
    for (let r = 1; r <= 7; r++) for (let c = 1; c <= 18; c++) {
        if (r === 1 && c > 1 && c < 18) continue;
        if (r <= 3 && c > 2 && c < 13) continue;
        const col = c <= 2 ? P.acc2 : c >= 13 ? P.acc3 : P.glow;
        const xx = x + (c - 1) * cel * 1.12, yy = y + (r - 1) * cel * 1.12;
        E(g, 'rect', { x: xx, y: yy, width: cel, height: cel, rx: cel * .12, fill: col, 'fill-opacity': .22, stroke: col, 'stroke-opacity': .75, 'stroke-width': 1.4 });
        const sy = sym[r + ',' + c];
        if (sy && simbolos) texto(g, xx + cel / 2, yy + cel * .68, sy, { size: cel * .5, fill: P.line, weight: 700, family: 'Segoe UI, Arial, sans-serif' });
    }
    return g;
}
function benceno(p, cx, cy, R, s = 1, conH = true) {
    const v = [...Array(6)].map((_, k) => { const a = Math.PI / 3 * k - Math.PI / 2; return [cx + R * Math.cos(a), cy + R * Math.sin(a), Math.cos(a), Math.sin(a)]; });
    const at = [], en = [];
    v.forEach(([x, y, c, sn], k) => {
        at.push([x, y, 'C', 22]);
        en.push([k, (k + 1) % 6, k % 2 ? 1 : 2]);
    });
    if (conH) v.forEach(([x, y, c, sn], k) => { at.push([x + c * R * .62, y + sn * R * .62, 'H', 14]); en.push([k, 6 + k]); });
    bolas(p, at, en, s);
}
function redNaCl(p, cx, cy, a, n = 3) {
    const pts = [];
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) {
        const m = (n - 1) / 2;
        pts.push({ i, j, k, x: cx + (i - m) * a + (k - m) * a * .5, y: cy + (j - m) * a - (k - m) * a * .38, t: (i + j + k) % 2 });
    }
    const idx = (i, j, k) => (i * n + j) * n + k;
    const g = G(p);
    for (const q of pts) for (const [di, dj, dk] of [[1, 0, 0], [0, 1, 0], [0, 0, 1]]) {
        const i2 = q.i + di, j2 = q.j + dj, k2 = q.k + dk;
        if (i2 >= n || j2 >= n || k2 >= n) continue;
        const r = pts[idx(i2, j2, k2)];
        E(g, 'line', { x1: q.x, y1: q.y, x2: r.x, y2: r.y, stroke: mix(P.line, P.bg1, .5), 'stroke-width': 2.5 });
    }
    pts.sort((A, B) => B.k - A.k || A.j - B.j);
    for (const q of pts) esfera(g, q.x, q.y, q.t ? a * .2 : a * .3, q.t ? ATOMO.Na : ATOMO.Cl);
}
function particulas(p, x, y, w, h, n, modo, color) {
    // modo: 'solido' (red ordenada), 'liquido', 'gas' (con estela de velocidad)
    const r = modo === 'gas' ? 11 : 13;
    if (modo === 'solido') {
        const cols = Math.round(Math.sqrt(n * w / h)), filas = Math.ceil(n / cols);
        for (let i = 0; i < filas; i++) for (let j = 0; j < cols; j++)
            esfera(p, x + (j + .5) * w / cols, y + h - (i + .5) * (2 * r + 2), r, color);
        return;
    }
    for (let i = 0; i < n; i++) {
        const px = x + r + rnd() * (w - 2 * r);
        const py = modo === 'liquido' ? y + h - r - rnd() * h * .55 : y + r + rnd() * (h - 2 * r);
        if (modo === 'gas') {
            const a = rnd() * Math.PI * 2, L = 22 + rnd() * 26;
            E(p, 'line', { x1: px, y1: py, x2: px - Math.cos(a) * L, y2: py - Math.sin(a) * L, stroke: color, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-opacity': .3 });
        }
        esfera(p, px, py, r, color);
    }
}

// ---------- física ----------
function ondaSeno(p, x0, x1, y, A, lambda, color, w = 3, fase = 0) {
    let d = '';
    for (let x = x0; x <= x1; x += 4) d += (x === x0 ? 'M' : 'L') + x + ',' + (y - A * Math.sin(2 * Math.PI * (x - x0) / lambda + fase)).toFixed(1);
    brillo(p, d, color, w);
}
function prisma(p, cx, cy, s, xIn, yIn, xFin, abanico) {
    const T = [cx, cy - 150 * s], BL = [cx - 132 * s, cy + 90 * s], BR = [cx + 132 * s, cy + 90 * s];
    const L = [(T[0] + BL[0]) / 2, (T[1] + BL[1]) / 2], R = [(T[0] + BR[0]) / 2 - 6 * s, (T[1] + BR[1]) / 2 + 10 * s];
    brillo(p, `M${xIn},${yIn} L${L[0]},${L[1]}`, '#ffffff', 5);
    const cols = ['#ff3b30', '#ff9500', '#ffd60a', '#34c759', '#00c7ff', '#3a6bff', '#a050ff'];
    cols.forEach((c, i) => {
        const yf = R[1] + abanico[0] + (abanico[1] - abanico[0]) * i / (cols.length - 1);
        E(p, 'polygon', { points: `${R[0]},${R[1] - 2} ${xFin},${yf - 9} ${xFin},${yf + 9} ${R[0]},${R[1] + 2}`, fill: lin([[0, c, .95], [1, c, .35]], 0, 0, 1, 0), });
        brillo(p, `M${R[0]},${R[1]} L${xFin},${yf}`, c, 2.5);
    });
    E(p, 'path', { d: `M${L[0]},${L[1]} L${R[0]},${R[1]}`, stroke: '#ffffff', 'stroke-width': 6, 'stroke-opacity': .55 });
    const d = `M${T[0]},${T[1]} L${BR[0]},${BR[1]} L${BL[0]},${BL[1]}Z`;
    E(p, 'path', { d, fill: lin([[0, P.glow, .30], [1, P.line, .08]], 0, 0, 1, 1) });
    brillo(p, d, P.line, 3);
}
function altavoz(p, x, y, s = 1, ondas = 4) {
    E(p, 'rect', { x: x - 30 * s, y: y - 32 * s, width: 34 * s, height: 64 * s, rx: 6 * s, fill: lin([[0, '#5d6d80'], [1, '#26313d']]) });
    E(p, 'polygon', { points: `${x + 4 * s},${y - 32 * s} ${x + 58 * s},${y - 78 * s} ${x + 58 * s},${y + 78 * s} ${x + 4 * s},${y + 32 * s}`, fill: lin([[0, '#8fa3b8'], [1, '#3b4856']], 0, 0, 1, 0) });
    for (let i = 1; i <= ondas; i++) {
        const r = (60 + 48 * i) * s, a = .75;
        brillo(p, `M${x + r * Math.cos(-a)},${y + r * Math.sin(-a)} A${r},${r} 0 0,1 ${x + r * Math.cos(a)},${y + r * Math.sin(a)}`, P.glow, 3.5, { 'stroke-opacity': 1 - i * .17 });
    }
}
function planeta(p, cx, cy, r) {
    halo(p, cx, cy, r * 1.45, P.glow, .55);
    E(p, 'circle', { cx, cy, r, fill: rad([[0, mix(P.liq, '#ffffff', .4)], [.6, P.liq], [1, mix(P.liq, '#000000', .6)]], .5, .5, .6, .35, .3) });
    const clip = recorte(c => E(c, 'circle', { cx, cy, r }));
    const g = G(p, { 'clip-path': clip });
    [[-.35, -.25, .45, .22, -20], [.25, .2, .5, .25, 25], [-.1, .55, .35, .14, 5], [.45, -.45, .25, .12, -30]].forEach(([dx, dy, rx, ry, rot]) =>
        E(g, 'ellipse', { cx: cx + dx * r, cy: cy + dy * r, rx: rx * r, ry: ry * r, transform: `rotate(${rot} ${cx + dx * r} ${cy + dy * r})`, fill: P.acc3, opacity: .55 }));
    E(g, 'circle', { cx, cy, r, fill: rad([[0, '#000', 0], [.55, '#000', 0], [1, '#000', .7]], .3, .3, .85) });
}
function planetaOrbita(p, cx, cy, R, rx, ry, rot, lunaT = 2.2, rl = 26) {
    const g1 = G(p, { transform: `rotate(${rot} ${cx} ${cy})` });
    brillo(g1, `M${cx - rx},${cy} A${rx},${ry} 0 0,1 ${cx + rx},${cy}`, P.line, 2.2, { 'stroke-opacity': .6, 'stroke-dasharray': '10 10' });
    planeta(p, cx, cy, R);
    const g2 = G(p, { transform: `rotate(${rot} ${cx} ${cy})` });
    brillo(g2, `M${cx + rx},${cy} A${rx},${ry} 0 0,1 ${cx - rx},${cy}`, P.line, 2.2);
    esfera(g2, cx + rx * Math.cos(lunaT), cy + ry * Math.sin(lunaT), rl, '#cfd8dc', true);
}
function termometro(p, x, top, h, nivel = .7, s = 1) {
    const w = 30 * s, rb = 30 * s, base = top + h;
    const yl = base - (h - 10) * nivel;
    E(p, 'rect', { x: x - w * .22, y: yl, width: w * .44, height: base - yl, fill: lin([[0, '#ff8a80'], [1, '#d50000']], 0, 0, 1, 0) });
    halo(p, x, base + rb * .2, rb * 2.2, '#ff5252', .45);
    E(p, 'circle', { cx: x, cy: base + rb * .2, r: rb * .72, fill: rad([[0, '#ffcdd2'], [.5, '#ff1744'], [1, '#8b0000']], .5, .5, .6, .35, .3) });
    vidrio(p, `M${x - w / 2},${base - 4} L${x - w / 2},${top + w / 2} A${w / 2},${w / 2} 0 0,1 ${x + w / 2},${top + w / 2} L${x + w / 2},${base - 4}
        A${rb},${rb} 0 1,1 ${x - w / 2},${base - 4}`);
    for (let i = 0; i <= 10; i++) {
        const yy = base - 10 - (h - 30) * i / 10;
        E(p, 'line', { x1: x + w / 2 + 4, x2: x + w / 2 + (i % 5 ? 14 : 24), y1: yy, y2: yy, stroke: P.line, 'stroke-width': 2, opacity: .85 });
    }
}
function llama(p, cx, base, h, w) {
    const forma = (h, w) => `M${cx},${base - h} C${cx + .15 * w},${base - .7 * h} ${cx + .6 * w},${base - .45 * h} ${cx + .5 * w},${base - .18 * h}
        C${cx + .42 * w},${base + .04 * h} ${cx - .42 * w},${base + .04 * h} ${cx - .5 * w},${base - .18 * h}
        C${cx - .6 * w},${base - .45 * h} ${cx - .15 * w},${base - .7 * h} ${cx},${base - h}Z`;
    halo(p, cx, base - h * .4, h * .9, '#ff9100', .5);
    E(p, 'path', { d: forma(h, w), fill: lin([[0, '#ff3d00', .2], [.5, '#ff6d00', .85], [1, '#ffab00', .95]]) });
    E(p, 'path', { d: forma(h * .68, w * .6), fill: lin([[0, '#ffd740', .5], [1, '#fff59d', .95]]) });
    E(p, 'path', { d: forma(h * .3, w * .3), fill: lin([[0, '#80d8ff', .7], [1, '#e1f5fe', .9]]) });
}
function bombilla(p, cx, cy, s = 1) {
    halo(p, cx, cy, 150 * s, P.acc, .6);
    const r = 55 * s;
    E(p, 'path', { d: `M${cx - 24 * s},${cy + 70 * s} L${cx - 24 * s},${cy + 46 * s} A${r},${r} 0 1,1 ${cx + 24 * s},${cy + 46 * s} L${cx + 24 * s},${cy + 70 * s}Z`, fill: rad([[0, '#fffde7', .95], [.6, P.acc, .55], [1, P.acc, .25]], .5, .4, .6) });
    brillo(p, `M${cx - 14 * s},${cy + 40 * s} L${cx - 8 * s},${cy - 6 * s} L${cx - 2 * s},${cy + 6 * s} L${cx + 4 * s},${cy - 6 * s} L${cx + 14 * s},${cy + 40 * s}`, '#ffffff', 2.5);
    for (let i = 0; i < 4; i++) E(p, 'rect', { x: cx - 26 * s, y: cy + (72 + i * 11) * s, width: 52 * s, height: 8 * s, rx: 4 * s, fill: lin([[0, '#cfd8dc'], [1, '#607d8b']], 0, 0, 1, 0) });
    for (let k = 0; k < 8; k++) {
        const a = -Math.PI / 2 + (k - 3.5) * .38;
        brillo(p, `M${cx + Math.cos(a) * 80 * s},${cy + Math.sin(a) * 80 * s} L${cx + Math.cos(a) * 112 * s},${cy + Math.sin(a) * 112 * s}`, P.acc, 3);
    }
}
function sol(p, cx, cy, r) {
    halo(p, cx, cy, r * 3.2, P.acc, .55);
    for (let k = 0; k < 16; k++) {
        const a = k * Math.PI / 8;
        brillo(p, `M${cx + Math.cos(a) * r * 1.25},${cy + Math.sin(a) * r * 1.25} L${cx + Math.cos(a) * r * (k % 2 ? 1.6 : 1.9)},${cy + Math.sin(a) * r * (k % 2 ? 1.6 : 1.9)}`, P.acc, 4);
    }
    E(p, 'circle', { cx, cy, r, fill: rad([[0, '#fffde7'], [.5, P.acc], [1, mix(P.acc, '#ff6d00', .6)]], .5, .5, .55, .4, .35) });
}
function aerogenerador(p, x, base, h, s = 1, rot = 15) {
    E(p, 'polygon', { points: `${x - 9 * s},${base} ${x + 9 * s},${base} ${x + 4 * s},${base - h} ${x - 4 * s},${base - h}`, fill: lin([[0, '#eceff1'], [1, '#90a4ae']], 0, 0, 1, 0) });
    for (let k = 0; k < 3; k++) {
        const a = rot + k * 120;
        E(p, 'path', { d: `M${x},${base - h} C${x + 10 * s},${base - h - 40 * s} ${x + 8 * s},${base - h - 120 * s} ${x},${base - h - 150 * s} C${x - 6 * s},${base - h - 110 * s} ${x - 9 * s},${base - h - 40 * s} ${x},${base - h}Z`, transform: `rotate(${a} ${x} ${base - h})`, fill: lin([[0, '#ffffff'], [1, '#b0bec5']], 0, 0, 1, 0) });
    }
    esfera(p, x, base - h, 11 * s, '#cfd8dc');
}
function rayo(p, x, y, s = 1) {
    const pts = [[0, 0], [60, 0], [28, 70], [70, 70], [-10, 190], [18, 98], [-24, 98]].map(([a, b]) => `${x + a * s},${y + b * s}`).join(' ');
    halo(p, x + 25 * s, y + 90 * s, 130 * s, P.acc, .45);
    E(p, 'polygon', { points: pts, fill: lin([[0, '#fff9c4'], [1, P.acc]]) });
    brillo(p, 'M' + pts.replace(/ /g, ' L') + 'Z', '#ffffff', 2);
}

// ---------- instrumentos y gráficas ----------
function regla(p, x, y, len, ang = 0, s = 1) {
    const g = G(p, { transform: `rotate(${ang} ${x} ${y})` });
    E(g, 'rect', { x, y, width: len, height: 54 * s, rx: 6, fill: lin([[0, P.acc, .55], [1, P.acc, .25]]), stroke: P.acc, 'stroke-width': 2 });
    const n = Math.floor(len / (12 * s));
    for (let i = 1; i < n; i++) {
        const xx = x + i * 12 * s, l = i % 10 === 0 ? 24 : i % 5 === 0 ? 17 : 10;
        E(g, 'line', { x1: xx, x2: xx, y1: y, y2: y + l * s, stroke: '#fff8e1', 'stroke-width': 1.6 });
        if (i % 10 === 0) texto(g, xx, y + 44 * s, String(i / 10), { size: 15 * s, fill: '#fff8e1', family: 'Segoe UI, Arial' });
    }
}
function lupa(p, cx, cy, r, ang = 45) {
    const a = ang * Math.PI / 180;
    const x1 = cx + Math.cos(a) * r * 1.05, y1 = cy + Math.sin(a) * r * 1.05, x2 = cx + Math.cos(a) * r * 2.1, y2 = cy + Math.sin(a) * r * 2.1;
    E(p, 'line', { x1, y1, x2, y2, stroke: '#3e2723', 'stroke-width': r * .3, 'stroke-linecap': 'round' });
    E(p, 'line', { x1, y1, x2, y2, stroke: P.acc2, 'stroke-width': r * .2, 'stroke-linecap': 'round' });
    E(p, 'circle', { cx, cy, r, fill: rad([[0, '#ffffff', .05], [.8, P.glow, .12], [1, P.glow, .3]]) });
    brillo(p, elipseD(cx, cy, r, r), P.line, r * .07);
    brillo(p, `M${cx - r * .6},${cy - r * .25} A${r * .65},${r * .65} 0 0,1 ${cx - r * .2},${cy - r * .62}`, '#ffffff', 3, { 'stroke-opacity': .6 });
}
function grafica(p, x0, y0, w, h, fn, o = {}) {
    // eje x desde (x0,y0) hacia la derecha, eje y hacia arriba; fn: t∈[0,1] -> [0,1]
    const g = G(p);
    E(g, 'rect', { x: x0 - 20, y: y0 - h - 20, width: w + 50, height: h + 50, rx: 14, fill: P.bg0, 'fill-opacity': .35, stroke: P.line, 'stroke-opacity': .25 });
    for (let i = 1; i <= 5; i++) {
        E(g, 'line', { x1: x0, x2: x0 + w, y1: y0 - h * i / 5, y2: y0 - h * i / 5, stroke: P.line, 'stroke-opacity': .12, 'stroke-width': 1.5 });
        E(g, 'line', { x1: x0 + w * i / 6, x2: x0 + w * i / 6, y1: y0, y2: y0 - h, stroke: P.line, 'stroke-opacity': .12, 'stroke-width': 1.5 });
    }
    flecha(g, x0, y0, x0 + w + 20, y0, P.line, 3, 14);
    flecha(g, x0, y0, x0, y0 - h - 20, P.line, 3, 14);
    let d = '';
    for (let i = 0; i <= 60; i++) { const t = i / 60; d += (i ? 'L' : 'M') + (x0 + t * w) + ',' + (y0 - fn(t) * h); }
    brillo(g, d, o.color ?? P.acc, o.w ?? 4);
    if (o.puntos) for (let i = 1; i <= o.puntos; i++) {
        const t = i / (o.puntos + 1), yy = y0 - (fn(t) + (rnd() - .5) * .08) * h, xx = x0 + t * w;
        E(g, 'line', { x1: xx, x2: xx, y1: yy - 14, y2: yy + 14, stroke: P.line, 'stroke-width': 2, opacity: .8 });
        esfera(g, xx, yy, 7, o.cpuntos ?? P.acc2);
    }
    if (o.ex) texto(g, x0 + w + 18, y0 + 34, o.ex, { size: 26, italic: true });
    if (o.ey) texto(g, x0 - 2, y0 - h - 32, o.ey, { size: 26, italic: true });
    return g;
}
function velocimetro(p, cx, cy, r, valor = .7) {
    E(p, 'circle', { cx, cy, r: r * 1.12, fill: rad([[0, P.bg1, .9], [1, P.bg0, .9]]), stroke: P.line, 'stroke-opacity': .5, 'stroke-width': 3 });
    const a0 = Math.PI * .8, a1 = Math.PI * 2.2;
    const arco = (ra, t0, t1) => `M${cx + ra * Math.cos(t0)},${cy + ra * Math.sin(t0)} A${ra},${ra} 0 ${t1 - t0 > Math.PI ? 1 : 0},1 ${cx + ra * Math.cos(t1)},${cy + ra * Math.sin(t1)}`;
    brillo(p, arco(r * .9, a0, a0 + (a1 - a0) * .6), P.acc3, 6);
    brillo(p, arco(r * .9, a0 + (a1 - a0) * .6, a0 + (a1 - a0) * .82), P.acc, 6);
    brillo(p, arco(r * .9, a0 + (a1 - a0) * .82, a1), P.acc2, 6);
    for (let i = 0; i <= 12; i++) {
        const a = a0 + (a1 - a0) * i / 12;
        E(p, 'line', { x1: cx + Math.cos(a) * r * .72, y1: cy + Math.sin(a) * r * .72, x2: cx + Math.cos(a) * r * (i % 2 ? .78 : .66), y2: cy + Math.sin(a) * r * (i % 2 ? .78 : .66), stroke: P.line, 'stroke-width': 2.5 });
    }
    const an = a0 + (a1 - a0) * valor;
    brillo(p, `M${cx},${cy} L${cx + Math.cos(an) * r * .8},${cy + Math.sin(an) * r * .8}`, P.acc2, 5);
    esfera(p, cx, cy, r * .1, P.line);
}
function cronometro(p, cx, cy, r) {
    E(p, 'rect', { x: cx - r * .14, y: cy - r * 1.32, width: r * .28, height: r * .3, rx: 4, fill: P.line, opacity: .85 });
    E(p, 'circle', { cx, cy, r: r * 1.06, fill: rad([[0, P.bg1, .9], [1, P.bg0, .95]]) });
    brillo(p, elipseD(cx, cy, r, r), P.line, 4);
    for (let i = 0; i < 60; i++) {
        const a = i * Math.PI / 30, l = i % 5 ? .9 : .78;
        E(p, 'line', { x1: cx + Math.cos(a) * r * .96, y1: cy + Math.sin(a) * r * .96, x2: cx + Math.cos(a) * r * l, y2: cy + Math.sin(a) * r * l, stroke: P.line, 'stroke-width': i % 5 ? 1.2 : 3 });
    }
    brillo(p, `M${cx},${cy} L${cx + r * .55},${cy - r * .45}`, P.acc2, 4);
    brillo(p, `M${cx},${cy} L${cx},${cy - r * .8}`, P.acc, 3);
    esfera(p, cx, cy, r * .08, P.line);
}
function balanza(p, cx, top, s = 1) {
    const L = 230 * s, ang = -6 * Math.PI / 180;
    const xL = cx - L * Math.cos(ang), yL = top - L * Math.sin(ang), xR = cx + L * Math.cos(ang), yR = top + L * Math.sin(ang);
    E(p, 'polygon', { points: `${cx - 90 * s},${top + 330 * s} ${cx + 90 * s},${top + 330 * s} ${cx + 60 * s},${top + 305 * s} ${cx - 60 * s},${top + 305 * s}`, fill: lin([[0, '#cfd8dc'], [1, '#546e7a']]) });
    E(p, 'rect', { x: cx - 10 * s, y: top, width: 20 * s, height: 305 * s, fill: lin([[0, '#eceff1'], [1, '#78909c']], 0, 0, 1, 0) });
    brillo(p, `M${xL},${yL} L${xR},${yR}`, P.line, 7 * s);
    esfera(p, cx, top, 16 * s, P.acc);
    const plato = (x, y, carga) => {
        const yp = y + 150 * s;
        brillo(p, `M${x},${y} L${x - 70 * s},${yp} M${x},${y} L${x + 70 * s},${yp}`, P.line, 1.8);
        if (carga === 'pesas') {
            E(p, 'rect', { x: x - 50 * s, y: yp - 42 * s, width: 40 * s, height: 42 * s, rx: 5, fill: lin([[0, P.acc], [1, mix(P.acc, '#000', .4)]], 0, 0, 1, 0) });
            E(p, 'rect', { x: x - 5 * s, y: yp - 30 * s, width: 30 * s, height: 30 * s, rx: 4, fill: lin([[0, P.acc], [1, mix(P.acc, '#000', .4)]], 0, 0, 1, 0) });
            E(p, 'rect', { x: x + 30 * s, y: yp - 20 * s, width: 22 * s, height: 20 * s, rx: 3, fill: lin([[0, P.acc], [1, mix(P.acc, '#000', .4)]], 0, 0, 1, 0) });
        } else esfera(p, x, yp - 38 * s, 38 * s, P.acc2);
        E(p, 'path', { d: `M${x - 88 * s},${yp} Q${x},${yp + 34 * s} ${x + 88 * s},${yp}Z`, fill: lin([[0, '#eceff1'], [1, '#607d8b']]) });
    };
    plato(xL, yL, 'pesas');
    plato(xR, yR, 'bola');
}
function dinamometro(p, x, top, h, s = 1) {
    E(p, 'rect', { x: x - 28 * s, y: top, width: 56 * s, height: h, rx: 12, fill: lin([[0, '#ffffff', .12], [1, '#ffffff', .04]], 0, 0, 1, 0) });
    brillo(p, `M${x - 28 * s},${top + 12} L${x - 28 * s},${top + h} M${x + 28 * s},${top + 12} L${x + 28 * s},${top + h}`, P.line, 3);
    brillo(p, `M${x},${top - 30} L${x},${top + 10} M${x - 16},${top - 30} A16,16 0 1,1 ${x},${top - 46}`, P.line, 3);
    let d = `M${x},${top + 10}`;
    const n = 12, hs = h * .62;
    for (let i = 1; i <= n; i++) d += ` L${x + (i % 2 ? 18 : -18) * s},${top + 10 + hs * i / n}`;
    d += ` L${x},${top + 10 + hs + 10}`;
    brillo(p, d, P.acc, 3);
    for (let i = 0; i <= 10; i++) E(p, 'line', { x1: x + 28 * s, x2: x + (i % 5 ? 40 : 48) * s, y1: top + 20 + (h - 40) * i / 10, y2: top + 20 + (h - 40) * i / 10, stroke: P.line, 'stroke-width': 2, opacity: .8 });
    brillo(p, `M${x},${top + hs + 20} L${x},${top + h + 30}`, P.line, 3);
    E(p, 'rect', { x: x - 38 * s, y: top + h + 30, width: 76 * s, height: 70 * s, rx: 8, fill: lin([[0, P.acc2], [1, mix(P.acc2, '#000', .45)]], 0, 0, 1, 1) });
    flecha(p, x, top + h + 100 + 4, x, top + h + 190, P.acc2, 4, 18, 'P', { dx: 26, dy: -10 });
}

// ---------- oscilaciones y campos (Física de 2.º Bachillerato) ----------
function muelle(p, x, y1, y2, w = 26, n = 14, color = P.line, grosor = 3) {
    const h = y2 - y1, e = Math.min(14, h * .08);
    let d = `M${x},${y1} L${x},${y1 + e}`;
    for (let i = 1; i <= n; i++) d += ` L${x + (i % 2 ? w : -w)},${y1 + e + (h - 2 * e) * (i - .5) / n}`;
    d += ` L${x},${y2 - e} L${x},${y2}`;
    brillo(p, d, color, grosor);
}
function bloque(p, x, y, w, h, c) {
    E(p, 'rect', { x: x - w / 2, y, width: w, height: h, rx: 8, fill: lin([[0, mix(c, '#ffffff', .35)], [1, mix(c, '#000000', .45)]], 0, 0, 1, 1) });
}
function pendulo(p, x, y, L, angs, rb = 24, c = P.acc) {
    brillo(p, `M${x - 70},${y} L${x + 70},${y}`, P.line, 5);
    const a0 = Math.min(...angs) * Math.PI / 180, a1 = Math.max(...angs) * Math.PI / 180;
    brillo(p, `M${x + L * Math.sin(a0)},${y + L * Math.cos(a0)} A${L},${L} 0 0,0 ${x + L * Math.sin(a1)},${y + L * Math.cos(a1)}`, P.glow, 2, { 'stroke-dasharray': '3 10' });
    brillo(p, `M${x},${y} L${x},${y + L + rb + 20}`, P.line, 1.5, { 'stroke-dasharray': '8 8', 'stroke-opacity': .5 });
    angs.forEach((a, i) => {
        const r = a * Math.PI / 180, bx = x + L * Math.sin(r), by = y + L * Math.cos(r);
        const g = G(p, { opacity: i === angs.length - 1 ? 1 : .22 + .2 * i / angs.length });
        brillo(g, `M${x},${y} L${bx},${by}`, P.line, 2);
        esfera(g, bx, by, rb, c, i === angs.length - 1);
    });
}
function dipolo(p, cx, cy, d, s = 1) {
    const q1 = [cx - d / 2, cy], q2 = [cx + d / 2, cy];
    for (let k = 1; k <= 4; k++) {
        const h = k * 46 * s;
        [-1, 1].forEach(sg => brillo(p, `M${q1[0] + 22 * s},${cy + sg * 8 * s} C${q1[0] + d * .2},${cy + sg * h * 1.5} ${q2[0] - d * .2},${cy + sg * h * 1.5} ${q2[0] - 22 * s},${cy + sg * 8 * s}`, P.glow, 2, { 'stroke-opacity': .9 - k * .14 }));
    }
    brillo(p, `M${q1[0] + 26 * s},${cy} L${q2[0] - 26 * s},${cy}`, P.glow, 2);
    esfera(p, q1[0], q1[1], 24 * s, P.acc2, true);
    esfera(p, q2[0], q2[1], 24 * s, P.liq, true);
    texto(p, q1[0], cy + 11 * s, '+', { size: 34 * s, weight: 700, fill: '#ffffff', family: 'Segoe UI, Arial' });
    texto(p, q2[0], cy + 10 * s, '−', { size: 34 * s, weight: 700, fill: '#ffffff', family: 'Segoe UI, Arial' });
}

// =====================================================================
//  ESCENAS (lienzo 1520 x 704)
// =====================================================================
const ESCENAS = {
    mas(p) {
        // muelle con masa que deja su traza sinusoidal; MCU proyectado; péndulo
        const x = 170, top = 30, yc = 270, A = 110;
        brillo(p, `M${x - 70},${top} L${x + 70},${top}`, P.line, 5);
        muelle(p, x, top, yc - 40, 24, 14, P.line, 3);
        bloque(p, x, yc - 40, 90, 80, P.acc2);
        brillo(p, `M${x + 50},${yc - A} L${x + 50},${yc + A}`, P.acc, 2.5);
        texto(p, x + 76, yc - A + 10, '+A', { size: 26, italic: true, fill: P.acc, anchor: 'start' });
        texto(p, x + 76, yc + A + 6, '−A', { size: 26, italic: true, fill: P.acc, anchor: 'start' });
        brillo(p, `M${x + 50},${yc} L${x + 100},${yc}`, P.line, 1.5, { 'stroke-dasharray': '6 6' });
        let d = '';
        for (let xx = 0; xx <= 620; xx += 4) d += (xx ? 'L' : 'M') + (x + 120 + xx) + ',' + (yc - A * Math.sin(xx / 620 * 4 * Math.PI)).toFixed(1);
        brillo(p, `M${x + 120},${yc} L${x + 760},${yc}`, P.line, 1.5, { 'stroke-opacity': .5 });
        brillo(p, d, P.acc, 4);
        texto(p, 600, 80, 'y = A · sen(ωt + φ_0)', { size: 44, italic: true });
        // MCU y su proyección
        const cx = 1060, cy = 260, r = 120, t = .9;
        brillo(p, elipseD(cx, cy, r, r), P.glow, 2.5);
        const px = cx + r * Math.cos(t), py = cy - r * Math.sin(t);
        brillo(p, `M${cx},${cy} L${px},${py}`, P.line, 2);
        brillo(p, `M${px},${py} L${cx - r - 30},${py}`, P.line, 1.5, { 'stroke-dasharray': '6 6' });
        brillo(p, `M${cx - r - 30},${cy - r} L${cx - r - 30},${cy + r}`, P.acc3, 2.5);
        esfera(p, px, py, 15, P.acc, true);
        esfera(p, cx - r - 30, py, 13, P.acc3, true);
        brillo(p, `M${cx + 40},${cy} A40,40 0 0,0 ${cx + 40 * Math.cos(t)},${cy - 40 * Math.sin(t)}`, P.acc, 2);
        texto(p, cx + 62, cy - 14, 'ωt', { size: 26, italic: true, fill: P.acc, anchor: 'start' });
        // péndulo
        pendulo(p, 1360, 20, 330, [-22, -11, 0, 11, 22], 24, P.acc3);
    },
    nuclear(p) {
        // fisión de un núcleo pesado, curva de desintegración exponencial y símbolo de radiactividad
        let sd = 13; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
        const nucleo = (cx, cy, n, r) => { for (let k = 0; k < n; k++) { const a = rnd() * 6.283, d = r * Math.sqrt(rnd()); esfera(p, cx + d * Math.cos(a), cy + d * Math.sin(a), 13, rnd() < .45 ? '#ff6b6b' : '#b0bec5'); } };
        esfera(p, 80, 250, 11, '#b0bec5', true); flecha(p, 95, 250, 170, 250, P.line, 3, 14);
        nucleo(250, 250, 40, 62);
        flecha(p, 330, 230, 400, 160, P.acc, 3, 16); flecha(p, 330, 270, 400, 340, P.acc, 3, 16);
        nucleo(460, 130, 18, 38); nucleo(460, 370, 15, 34);
        [[560, 220], [590, 260], [560, 300]].forEach(([x, y]) => { esfera(p, x, y, 11, '#b0bec5', true); flecha(p, x + 14, y, x + 60, y + (y - 260) * .6, P.line, 2.5, 12); });
        texto(p, 760, 90, 'N = N₀ · e^{−λt}', { size: 46, italic: true });
        // curva de desintegración
        const x0 = 880, y0 = 430, w = 560, h = 290;
        brillo(p, `M${x0},${y0} L${x0 + w},${y0}`, P.line, 1.6); brillo(p, `M${x0},${y0} L${x0},${y0 - h - 20}`, P.line, 1.6);
        let d = ''; for (let t = 0; t <= 1; t += 0.005) d += (d ? ' L' : 'M') + (x0 + t * w).toFixed(1) + ',' + (y0 - h * Math.exp(-3.6 * t)).toFixed(1);
        brillo(p, d, P.acc2, 3.5);
        [1, 2, 3].forEach(k => { const t = k * Math.LN2 / 3.6, x = x0 + t * w, y = y0 - h * Math.pow(.5, k);
            brillo(p, `M${x},${y0} L${x},${y} L${x0},${y}`, P.glow, 1.2, { 'stroke-dasharray': '6 6', 'stroke-opacity': .7 }); });
    },
    cuantica(p) {
        // fotones que arrancan electrones de un metal, curvas del cuerpo negro y E = h·ν
        E(p, 'rect', { x: 120, y: 330, width: 520, height: 70, fill: lin([[0, '#b0bec5'], [1, '#455a64']]) });
        [[180, 120, '#b388ff'], [300, 90, '#7c4dff'], [420, 120, '#b388ff']].forEach(([x, y, c]) => {
            let d = ''; for (let t = 0; t <= 1; t += 0.01) { const px = x + t * 120, py = y + t * 210, w = 12 * Math.sin(t * 40); d += (d ? ' L' : 'M') + (px + w * 0.86).toFixed(1) + ',' + (py - w * 0.5).toFixed(1); }
            brillo(p, d, c, 3);
        });
        [[310, 324], [430, 324], [550, 324]].forEach(([x, y]) => { esfera(p, x, y, 13, '#5aa9ff', true); flecha(p, x, y, x + 70, y - 70, P.acc3, 3, 14); });
        texto(p, 760, 90, 'E = h · ν', { size: 50, italic: true });
        // espectro del cuerpo negro (ley de Planck) para tres temperaturas
        const x0 = 880, y0 = 430, sx = 260, sy = 280;
        brillo(p, `M${x0},${y0} L${x0 + 580},${y0}`, P.line, 1.6); brillo(p, `M${x0},${y0} L${x0},${y0 - 320}`, P.line, 1.6);
        const planck = (l, T) => 1 / (l ** 5 * (Math.exp(1 / (l * T)) - 1));
        let Imax = 0; for (let l = 0.05; l <= 2.2; l += 0.01) Imax = Math.max(Imax, planck(l, 0.5));
        [[0.5, P.acc2], [0.42, P.acc], [0.35, P.acc3]].forEach(([T, c]) => {
            let d = ''; for (let l = 0.08; l <= 2.2; l += 0.01) { const I = planck(l, T) / Imax; d += (d ? ' L' : 'M') + (x0 + l * sx).toFixed(1) + ',' + (y0 - I * sy).toFixed(1); }
            brillo(p, d, c, 3);
        });
    },
    magnetico(p) {
        // imán con líneas de campo, partícula en órbita circular dentro de un campo entrante y bobina con corriente inducida
        const cx = 330, cy = 250, w = 260, h = 64;
        for (let k = 1; k <= 6; k++) {
            const a = 50 + k * 50, b = 22 + k * 26;
            brillo(p, `M${cx + w / 2},${cy} C${cx + w / 2 + a},${cy - b * 1.6} ${cx - w / 2 - a},${cy - b * 1.6} ${cx - w / 2},${cy}`, P.glow, 1.4, { 'stroke-opacity': .8 });
            brillo(p, `M${cx + w / 2},${cy} C${cx + w / 2 + a},${cy + b * 1.6} ${cx - w / 2 - a},${cy + b * 1.6} ${cx - w / 2},${cy}`, P.glow, 1.4, { 'stroke-opacity': .8 });
        }
        E(p, 'rect', { x: cx - w / 2, y: cy - h / 2, width: w / 2, height: h, fill: '#5aa9ff' });
        E(p, 'rect', { x: cx, y: cy - h / 2, width: w / 2, height: h, fill: '#ff6b6b' });
        texto(p, cx - w / 4, cy + 14, 'S', { size: 40, weight: 700, fill: '#fff', family: 'Segoe UI, Arial' });
        texto(p, cx + w / 4, cy + 14, 'N', { size: 40, weight: 700, fill: '#fff', family: 'Segoe UI, Arial' });
        texto(p, 1060, 90, 'F = q · v × B', { size: 46, italic: true });
        // campo entrante y órbita
        for (let x = 900; x <= 1460; x += 56) for (let y = 160; y <= 440; y += 56) {
            brillo(p, `M${x - 7},${y - 7} L${x + 7},${y + 7} M${x - 7},${y + 7} L${x + 7},${y - 7}`, P.line, 1.2, { 'stroke-opacity': .5 });
        }
        brillo(p, elipseD(1180, 300, 120, 120), P.acc, 3);
        esfera(p, 1180, 180, 16, '#ff6b6b', true);
        flecha(p, 1180, 180, 1090, 180, P.acc3, 4, 18, 'v', { dx: -10, dy: -14 });
    },
    electrico(p) {
        // líneas de campo de un dipolo, ley de Coulomb y placas paralelas con campo uniforme
        const Q = [[300, 250, 1], [620, 250, -1]];
        const E1 = (x, y) => { let ex = 0, ey = 0; Q.forEach(([cx, cy, q]) => { const dx = x - cx, dy = y - cy, r3 = Math.pow(dx * dx + dy * dy, 1.5); ex += q * dx / r3; ey += q * dy / r3; }); return [ex, ey]; };
        for (let k = 0; k < 16; k++) {
            const a = 2 * Math.PI * (k + .5) / 16;
            let x = 300 + 30 * Math.cos(a), y = 250 + 30 * Math.sin(a), d = `M${x.toFixed(1)},${y.toFixed(1)}`;
            for (let s = 0; s < 900; s++) {
                const [ex, ey] = E1(x, y), l = Math.hypot(ex, ey); x += 3 * ex / l; y += 3 * ey / l;
                d += ` L${x.toFixed(1)},${y.toFixed(1)}`;
                if (Math.hypot(x - 620, y - 250) < 28 || x < -40 || x > 960 || y < -40 || y > 560) break;
            }
            brillo(p, d, P.glow, 1.2, { 'stroke-opacity': .7 });
        }
        esfera(p, 300, 250, 30, '#ff6b6b', true); texto(p, 300, 262, '+', { size: 40, weight: 700, fill: '#fff', family: 'Segoe UI, Arial' });
        esfera(p, 620, 250, 30, '#5aa9ff', true); texto(p, 620, 262, '−', { size: 40, weight: 700, fill: '#fff', family: 'Segoe UI, Arial' });
        texto(p, 1060, 90, 'F = k·Qq/r²', { size: 46, italic: true });
        // placas
        const xa = 1040, xb = 1400, ya = 150, yb = 430;
        E(p, 'rect', { x: xa - 14, y: ya, width: 14, height: yb - ya, fill: '#ff6b6b', opacity: .85 });
        E(p, 'rect', { x: xb, y: ya, width: 14, height: yb - ya, fill: '#5aa9ff', opacity: .85 });
        for (let y = ya + 30; y < yb; y += 50) flecha(p, xa + 10, y, xb - 10, y, P.acc, 3, 16);
    },
    gravitacion(p) {
        // órbita elíptica con áreas barridas, ley de Newton y líneas de campo de un planeta
        estrellas(p, 90, 0, 0, 1520, 480);
        const cx = 420, cy = 262, a = 290, e = .55, b = a * Math.sqrt(1 - e * e), fx = cx + a * e;
        const pos = M => { let E1 = M; for (let k = 0; k < 30; k++) E1 = M + e * Math.sin(E1); return [cx + a * Math.cos(E1), cy - b * Math.sin(E1)]; };
        [[-.32, .32, P.acc], [Math.PI - .32, Math.PI + .32, P.acc3]].forEach(([m0, m1, c]) => {
            let d = `M${fx},${cy}`;
            for (let k = 0; k <= 24; k++) { const q = pos(m0 + (m1 - m0) * k / 24); d += ` L${q[0].toFixed(1)},${q[1].toFixed(1)}`; }
            E(p, 'path', { d: d + ' Z', fill: c, 'fill-opacity': .28 });
            brillo(p, d + ' Z', c, 1.6);
        });
        brillo(p, elipseD(cx, cy, a, b), P.glow, 2.5);
        sol(p, fx, cy, 46);
        const q = pos(2.1); esfera(p, q[0], q[1], 18, '#64b5f6', true);
        flecha(p, q[0], q[1], q[0] + (fx - q[0]) * .3, q[1] + (cy - q[1]) * .3, P.acc2, 4, 18, 'F', { dx: 18, dy: 30 });
        texto(p, 1010, 90, 'F = G·Mm/r²', { size: 46, italic: true });
        // planeta con líneas de campo radiales
        const px = 1260, py = 290;
        for (let k = 0; k < 16; k++) {
            const t = k * Math.PI / 8;
            flecha(p, px + 190 * Math.cos(t), py + 190 * Math.sin(t), px + 92 * Math.cos(t), py + 92 * Math.sin(t), P.glow, 2.5, 14);
        }
        planeta(p, px, py, 78);
    },
    optica(p) {
        // lente convergente que enfoca un haz paralelo, ecuación de las lentes y prisma que dispersa la luz blanca
        const X = 330, Y = 240, f = 230;
        [-110, -55, 55, 110].forEach(dy => {
            brillo(p, `M20,${Y + dy} L${X},${Y + dy}`, P.acc, 3);
            brillo(p, `M${X},${Y + dy} L${X + f},${Y} L${X + 1.45 * f},${Y - 0.45 * dy}`, P.acc, 3);
        });
        brillo(p, `M0,${Y} L${X + 1.6 * f},${Y}`, P.line, 1.4, { 'stroke-opacity': .45 });
        E(p, 'path', { d: `M${X},${Y - 150} Q${X + 62},${Y} ${X},${Y + 150} Q${X - 62},${Y} ${X},${Y - 150} Z`,
            fill: lin([[0, P.glow, .45], [1, P.line, .12]], 0, 0, 1, 0) });
        brillo(p, `M${X},${Y - 150} Q${X + 62},${Y} ${X},${Y + 150} Q${X - 62},${Y} ${X},${Y - 150} Z`, P.line, 2.5);
        esfera(p, X + f, Y, 11, P.acc3, true);
        texto(p, X + f + 4, Y + 46, "F'", { size: 30, italic: true, fill: P.acc3 });
        texto(p, 760, 80, "1/s' − 1/s = 1/f'", { size: 44, italic: true });
        prisma(p, 1150, 270, 1.0, 880, 340, 1520, [-30, 160]);
    },
    ondulatorio(p) {
        // altavoz emitiendo, onda viajera con su ecuación, onda estacionaria e interferencia de dos focos
        altavoz(p, 120, 230, 1.15, 4);
        brillo(p, 'M400,230 L940,230', P.line, 1.5, { 'stroke-opacity': .45 });
        ondaSeno(p, 400, 940, 230, 70, 240, P.acc, 4);
        flecha(p, 820, 120, 930, 120, P.acc, 4, 18, 'v', { dx: -50, dy: -16, size: 30 });
        texto(p, 600, 92, 'y = A · sen(ωt − kx)', { size: 44, italic: true });
        // onda estacionaria: tres husos entre dos nodos fijos
        const x0 = 420, L = 500, yE = 400;
        [1, -1].forEach(s => {
            let d = '';
            for (let x = 0; x <= L; x += 4) d += (x ? 'L' : 'M') + (x0 + x) + ',' + (yE - s * 46 * Math.sin(3 * Math.PI * x / L)).toFixed(1);
            brillo(p, d, P.acc3, s > 0 ? 3.5 : 2, s > 0 ? {} : { 'stroke-dasharray': '10 8' });
        });
        [0, 1, 2, 3].forEach(k => esfera(p, x0 + k * L / 3, yE, 9, P.acc2, true));
        // interferencia de dos focos coherentes
        [[1250, 140, P.acc], [1250, 320, P.acc3]].forEach(([cx, cy, c]) => {
            for (let r = 36; r <= 216; r += 36) brillo(p, elipseD(cx, cy, r, r), c, 1.6, { 'stroke-opacity': 1 - r / 250 });
        });
        esfera(p, 1250, 140, 14, P.acc, true);
        esfera(p, 1250, 320, 14, P.acc3, true);
    },
    fisica(p) {
        // los cuatro bloques de Física de 2.º Bach: gravitación, electromagnetismo, ondas y física moderna
        estrellas(p, 60, 900, 0, 620, 470);
        planetaOrbita(p, 1240, 230, 95, 210, 58, -14, 2.5, 18);
        dipolo(p, 600, 230, 300, 1);
        ondaSeno(p, 60, 380, 120, 40, 160, P.acc, 3.5);
        ondaSeno(p, 60, 380, 120, 26, 100, P.glow, 2.5, 1);
        atomoBohr(p, 220, 330, .33, 7);
        texto(p, 1420, 450, 'E = h · ν', { size: 40, italic: true, anchor: 'end' });
    },
    general(p) {
        atomoBohr(p, 1130, 235, .62);
        ondaSeno(p, 60, 640, 130, 42, 190, P.acc, 3.5);
        ondaSeno(p, 60, 640, 130, 26, 120, P.glow, 2.5, 1);
        benceno(p, 400, 330, 70, .7);
        erlenmeyer(p, 760, 440, 250, 190, P.liq, .45);
        agua(p, 1430, 380, .7, -20);
        ptMini(p, 1260, 40, 14, false);
    },
    cientifico(p) {
        grafica(p, 720, 430, 400, 330, t => .08 + .82 * t, { puntos: 7, ex: 'x', ey: 'y' });
        lupa(p, 1300, 165, 95, 45);
        regla(p, 80, 270, 440, -14);
        erlenmeyer(p, 560, 450, 220, 160, P.acc3, .5);
        cronometro(p, 210, 120, 70);
        texto(p, 1310, 172, 'Δx', { size: 64, italic: true, fill: P.acc, weight: 700 });
    },
    matematicas(p) {
        grafica(p, 760, 430, 380, 320, t => 1 - 3.6 * (t - .5) ** 2 - .08, { ex: 'x', ey: 'y' });
        const g = G(p);
        brillo(g, 'M780,410 L1140,130', P.acc3, 3);
        [['a · 10^n', 230, 120, 58], ['√x', 520, 90, 64], ['A = π r^2', 1350, 90, 46], ['Δy / Δx', 1340, 270, 46], ['x^2 + y^2', 330, 300, 48]]
            .forEach(([s, x, y, sz]) => texto(g, x, y, s, { size: sz, italic: true, fill: P.line }));
        const cx = 560, cy = 440, r = 140;
        E(p, 'path', { d: `M${cx - r},${cy} A${r},${r} 0 0,1 ${cx + r},${cy}Z`, fill: P.acc, 'fill-opacity': .18 });
        brillo(p, `M${cx - r},${cy} A${r},${r} 0 0,1 ${cx + r},${cy}Z`, P.acc, 3);
        for (let i = 0; i <= 18; i++) {
            const a = Math.PI + i * Math.PI / 18;
            E(p, 'line', { x1: cx + Math.cos(a) * r, y1: cy + Math.sin(a) * r, x2: cx + Math.cos(a) * r * (i % 3 ? .9 : .82), y2: cy + Math.sin(a) * r * (i % 3 ? .9 : .82), stroke: P.acc, 'stroke-width': 2 });
        }
        brillo(p, 'M80,440 L260,440 L260,300 Z', P.glow, 3);
        E(p, 'rect', { x: 236, y: 416, width: 24, height: 24, fill: 'none', stroke: P.glow, 'stroke-width': 2 });
    },
    medida(p) {
        balanza(p, 1000, 90, .95);
        probeta(p, 1360, 70, 70, 360, P.liq, .62);
        regla(p, 70, 330, 520, -10);
        cronometro(p, 330, 160, 95);
        texto(p, 640, 140, 'kg · m · s', { size: 44, italic: true, fill: P.acc });
    },
    atomo(p) {
        ptMini(p, 70, 60, 23);
        atomoBohr(p, 1080, 245, .85);
        esfera(p, 1430, 90, 16, P.glow, true);
        texto(p, 1430, 150, 'e^-', { size: 34, italic: true });
    },
    enlace(p) {
        redNaCl(p, 1150, 250, 92);
        agua(p, 640, 220, 1.1, 0);
        // enlace covalente: dos orbitales que se solapan con el par compartido
        E(p, 'circle', { cx: 270, cy: 230, r: 110, fill: P.glow, 'fill-opacity': .14 });
        E(p, 'circle', { cx: 400, cy: 230, r: 110, fill: P.acc, 'fill-opacity': .14 });
        brillo(p, elipseD(270, 230, 110, 110), P.glow, 2.5);
        brillo(p, elipseD(400, 230, 110, 110), P.acc, 2.5);
        esfera(p, 270, 230, 26, ATOMO.H); esfera(p, 400, 230, 26, ATOMO.H);
        esfera(p, 335, 212, 9, P.acc2, true); esfera(p, 335, 250, 9, P.acc2, true);
        texto(p, 1450, 470, 'Na^+Cl^-', { size: 34, anchor: 'end' });
    },
    carbono(p) {
        rejillaHex(p, 820, 0, 700, 470, 42, .5, (x, y) => Math.max(0, Math.min(1, (x - 820) / 500)) * Math.max(0, 1 - y / 520));
        benceno(p, 1110, 230, 105, 1);
        // cadena de hexano en zigzag
        const at = [], en = [];
        for (let i = 0; i < 6; i++) {
            const x = 110 + i * 105, y = 250 + (i % 2 ? -45 : 45);
            at.push([x, y, 'C', 24]);
            if (i) en.push([i - 1, i]);
        }
        for (let i = 0; i < 6; i++) {
            const [x, y] = at[i], up = i % 2 ? -1 : 1;
            at.push([x - 32, y + up * 66, 'H', 15]); en.push([i, at.length - 1]);
            at.push([x + 32, y + up * 66, 'H', 15]); en.push([i, at.length - 1]);
        }
        bolas(p, at, en, .95);
        // fullereno estilizado
        const cx = 1390, cy = 110, r = 85;
        halo(p, cx, cy, r * 1.6, P.glow, .4);
        E(p, 'circle', { cx, cy, r, fill: rad([[0, '#ffffff', .25], [.7, P.glow, .15], [1, P.glow, .35]], .5, .5, .55, .35, .3) });
        const clip = recorte(c => E(c, 'circle', { cx, cy, r }));
        const g = G(p, { 'clip-path': clip });
        rejillaHex(g, cx - r, cy - r, 2 * r, 2 * r, 20, .9, (x, y) => 1 - Math.hypot(x - cx, y - cy) / r * .7);
        brillo(p, elipseD(cx, cy, r, r), P.line, 2);
    },
    materia(p) {
        // cilindro con émbolo y gas
        const x = 1120, y = 110, w = 300, h = 345;
        E(p, 'rect', { x: x + 4, y: y + 90, width: w - 8, height: h - 94, fill: P.glow, 'fill-opacity': .08 });
        particulas(p, x + 10, y + 100, w - 20, h - 110, 16, 'gas', P.acc2);
        vidrio(p, `M${x},${y} L${x},${y + h} L${x + w},${y + h} L${x + w},${y}`, 3.5);
        E(p, 'rect', { x: x + 4, y: y + 68, width: w - 8, height: 22, rx: 4, fill: lin([[0, '#eceff1'], [1, '#78909c']]) });
        E(p, 'rect', { x: x + w / 2 - 10, y: y - 40, width: 20, height: 110, fill: lin([[0, '#eceff1'], [1, '#78909c']], 0, 0, 1, 0) });
        flecha(p, x + w / 2, y - 100, x + w / 2, y - 46, P.acc, 4, 18);
        velocimetro(p, 920, 150, 85, .55);
        vaso(p, 560, 190, 210, 260, P.liq, .62);
        particulas(p, 575, 300, 180, 140, 9, 'liquido', P.violet);
        termometro(p, 360, 70, 330, .5, 1);
        particulas(p, 70, 250, 200, 200, 14, 'solido', P.acc3);
    },
    estados(p) {
        // sólido – líquido – gas
        const cajas = [[300, 'solido', P.glow], [720, 'liquido', P.liq], [1140, 'gas', P.acc2]];
        cajas.forEach(([x, m, c], k) => {
            const y = 70, w = 300, h = 380;
            if (m !== 'solido') vidrio(p, `M${x},${y} L${x},${y + h} L${x + w},${y + h} L${x + w},${y}`, 3);
            if (m === 'solido') {
                E(p, 'rect', { x: x + 40, y: y + 150, width: 220, height: 220, rx: 18, fill: lin([[0, '#ffffff', .25], [1, P.glow, .12]]), stroke: P.line, 'stroke-opacity': .6, 'stroke-width': 3 });
                particulas(p, x + 50, y + 160, 200, 200, 49, 'solido', c);
            } else if (m === 'liquido') {
                E(p, 'rect', { x: x + 3, y: y + 200, width: w - 6, height: h - 203, fill: liquido(c), opacity: .45 });
                particulas(p, x + 6, y + 190, w - 12, h - 196, 30, 'liquido', c);
            } else particulas(p, x + 6, y + 6, w - 12, h - 12, 16, 'gas', c);
            if (k < 2) {
                brillo(p, `M${x + w + 25},${y + 120} Q${x + w + 60},${y + 60} ${x + w + 95},${y + 120}`, P.acc, 4);
                E(p, 'polygon', { points: `${x + w + 95},${y + 120} ${x + w + 78},${y + 104} ${x + w + 100},${y + 100}`, fill: P.acc });
            }
        });
    },
    mezclas(p) {
        // filtración
        const fx = 470;
        E(p, 'path', { d: `M${fx - 110},90 L${fx + 110},90 L${fx + 14},230 L${fx + 14},300 L${fx - 14},300 L${fx - 14},230Z`, fill: '#ffffff', 'fill-opacity': .06 });
        E(p, 'path', { d: `M${fx - 92},100 L${fx + 92},100 L${fx},226Z`, fill: '#fff8e1', 'fill-opacity': .55 });
        E(p, 'path', { d: `M${fx - 60},128 L${fx + 60},128 L${fx},212Z`, fill: '#a1887f', 'fill-opacity': .85 });
        vidrio(p, `M${fx - 110},90 L${fx - 14},230 L${fx - 14},300 M${fx + 110},90 L${fx + 14},230 L${fx + 14},300`);
        brillo(p, `M${fx},310 L${fx},350`, P.liq, 3);
        erlenmeyer(p, fx, 470, 190, 200, P.liq, .35);
        // embudo de decantación
        const dx = 900;
        E(p, 'path', { d: `M${dx - 90},150 Q${dx},120 ${dx + 90},150 L${dx},330Z`, fill: '#ffffff', 'fill-opacity': .05 });
        E(p, 'path', { d: `M${dx - 70},180 L${dx + 70},180 L${dx + 40},230 L${dx - 40},230Z`, fill: liquido(P.acc), opacity: .85 });
        E(p, 'path', { d: `M${dx - 40},230 L${dx + 40},230 L${dx},320Z`, fill: liquido(P.liq), opacity: .9 });
        vidrio(p, `M${dx - 20},90 L${dx - 20},140 L${dx - 90},150 Q${dx - 100},160 ${dx - 90},170 L${dx},330 L${dx + 90},170 Q${dx + 100},160 ${dx + 90},150 L${dx + 20},140 L${dx + 20},90`);
        brillo(p, `M${dx},330 L${dx},420`, P.line, 3);
        E(p, 'rect', { x: dx - 26, y: 360, width: 52, height: 14, rx: 6, fill: P.acc2 });
        // vaso con mezcla heterogénea (arena + agua)
        vaso(p, 1150, 160, 230, 280, P.liq, .7, false);
        for (let i = 0; i < 90; i++) E(p, 'circle', { cx: 1160 + rnd() * 210, cy: 430 - rnd() * rnd() * 70, r: 3 + rnd() * 4, fill: mix('#d7b98e', '#8d6e63', rnd()) });
        burbujas(p, 1170, 240, 190, 120, 8);
        // imán
        brillo(p, 'M120,120 L120,300 A70,70 0 0,0 260,300 L260,120', P.acc2, 22);
        E(p, 'rect', { x: 100, y: 110, width: 40, height: 50, fill: '#eceff1' });
        E(p, 'rect', { x: 240, y: 110, width: 40, height: 50, fill: '#eceff1' });
    },
    reacciones(p) {
        balon(p, 1230, 290, 140, P.acc2, .55);
        llama(p, 1230, 520, 90, 90);
        for (let k = 0; k < 7; k++) {
            const x = 1060 + rnd() * 360, y = 40 + rnd() * 120;
            brillo(p, `M${x - 10},${y} L${x + 10},${y} M${x},${y - 10} L${x},${y + 10}`, P.acc, 2.2);
        }
        const s = .62, y = 220;
        const H2 = (x) => bolas(p, [[x - 22, y, 'H', 26], [x + 22, y, 'H', 26]], [[0, 1]], s);
        H2(120); H2(250);
        texto(p, 330, y + 14, '+', { size: 54, weight: 700 });
        bolas(p, [[415 - 26, y, 'O', 36], [415 + 26, y, 'O', 36]], [[0, 1, 2]], s);
        flecha(p, 510, y, 680, y, P.acc, 5, 24);
        agua(p, 770, y - 25, .62, 0);
        agua(p, 900, y - 25, .62, 0);
        texto(p, 400, 380, '2 H_2 + O_2 → 2 H_2O', { size: 46, italic: false, fill: P.line });
    },
    formulacion(p) {
        const fichas = [['H', 1, 120, 80, -8], ['O', 8, 300, 190, 6], ['Na', 11, 520, 70, -4], ['Cl', 17, 760, 170, 8], ['S', 16, 1000, 60, -6], ['Fe', 26, 1200, 200, 5], ['N', 7, 1390, 70, -7]];
        fichas.forEach(([s, z, x, y, r], i) => {
            const g = G(p, { transform: `rotate(${r} ${x + 60} ${y + 60})` });
            const col = [P.acc2, P.acc3, P.glow, P.acc][i % 4];
            E(g, 'rect', { x: x + 6, y: y + 8, width: 120, height: 120, rx: 14, fill: '#000', 'fill-opacity': .25 });
            E(g, 'rect', { x, y, width: 120, height: 120, rx: 14, fill: lin([[0, col, .45], [1, col, .15]], 0, 0, 1, 1), stroke: col, 'stroke-width': 3 });
            texto(g, x + 12, y + 28, String(z), { size: 22, anchor: 'start', family: 'Segoe UI, Arial', weight: 600 });
            texto(g, x + 60, y + 88, s, { size: 58, weight: 700, family: 'Segoe UI, Arial' });
        });
        [['H_2SO_4', 230, 400], ['NaCl', 640, 330], ['CO_2', 950, 420], ['Fe_2O_3', 1150, 380], ['NH_3', 1420, 300], ['HNO_3', 500, 450]]
            .forEach(([f, x, y]) => texto(p, x, y, f, { size: 50, fill: P.line, op: .9 }));
    },
    cinematica(p) {
        const y = 400;
        brillo(p, `M60,${y + 40} L1480,${y + 40}`, P.line, 3);
        for (let x = 80; x < 1480; x += 50) E(p, 'line', { x1: x, x2: x, y1: y + 40, y2: y + (x % 250 === 80 % 250 ? 22 : 30), stroke: P.line, 'stroke-width': 2, opacity: .7 });
        const xs = [100, 150, 230, 340, 480, 650, 850];
        xs.forEach((x, i) => {
            const op = .25 + .75 * i / (xs.length - 1);
            const g = G(p, { opacity: op });
            esfera(g, x, y, 26, P.acc2, i === xs.length - 1);
            if (i) flecha(g, x, y - 50, x + 22 + i * 18, y - 50, P.acc, 3.5, 14);
        });
        texto(p, 890, y - 70, 'v', { size: 40, italic: true, fill: P.acc, weight: 700 });
        grafica(p, 1100, 330, 330, 260, t => t * t * .95, { ex: 't', ey: 'x', color: P.acc3 });
        velocimetro(p, 300, 170, 110, .62);
    },
    fuerzas(p) {
        const x0 = 640, x1 = 1300, yb = 450, ht = 300;
        E(p, 'polygon', { points: `${x0},${yb} ${x1},${yb} ${x1},${yb - ht}`, fill: lin([[0, P.glow, .25], [1, P.glow, .06]], 0, 0, 1, 1) });
        brillo(p, `M${x0},${yb} L${x1},${yb} L${x1},${yb - ht}Z`, P.line, 3);
        const ang = Math.atan2(ht, x1 - x0), deg = -ang * 180 / Math.PI;
        const t = .55, bx = x0 + (x1 - x0) * t, by = yb - ht * t;
        const g = G(p, { transform: `rotate(${deg} ${bx} ${by})` });
        E(g, 'rect', { x: bx - 70, y: by - 90, width: 140, height: 90, rx: 8, fill: lin([[0, P.acc], [1, mix(P.acc, '#000', .45)]], 0, 0, 1, 1) });
        const cx = bx + Math.sin(ang) * 45, cy = by - Math.cos(ang) * 45;
        flecha(p, cx, cy, cx, cy + 170, P.acc2, 5, 22, 'P', { dx: 26, dy: -8 });
        flecha(p, cx, cy, cx - Math.sin(ang) * 150, cy - Math.cos(ang) * 150, P.acc3, 5, 22, 'N', { dx: -24, dy: -6 });
        flecha(p, cx, cy, cx - Math.cos(ang) * 150, cy + Math.sin(ang) * 150, P.violet, 5, 22, 'F_r', { dx: -26, dy: 0 });
        flecha(p, cx, cy, cx + Math.cos(ang) * 160, cy - Math.sin(ang) * 160, P.glow, 5, 22, 'F', { dx: 6, dy: -18 });
        brillo(p, `M${x0 + 90},${yb} A90,90 0 0,0 ${x0 + 90 * Math.cos(ang)},${yb - 90 * Math.sin(ang)}`, P.acc, 2.5);
        texto(p, x0 + 120, yb - 18, 'α', { size: 32, italic: true, fill: P.acc });
        dinamometro(p, 330, 80, 200);
        texto(p, 1400, 120, 'ΣF = m · a', { size: 52, italic: true, fill: P.line, anchor: 'middle' });
    },
    gravedad(p) {
        estrellas(p, 120, 0, 0, 1520, 480);
        const cx = 1120, cy = 260, R = 140, rx = 330, ry = 96, rot = -12;
        const g1 = G(p, { transform: `rotate(${rot} ${cx} ${cy})` });
        brillo(g1, `M${cx - rx},${cy} A${rx},${ry} 0 0,1 ${cx + rx},${cy}`, P.line, 2.2, { 'stroke-opacity': .6, 'stroke-dasharray': '10 10' });
        planeta(p, cx, cy, R);
        const g2 = G(p, { transform: `rotate(${rot} ${cx} ${cy})` });
        brillo(g2, `M${cx + rx},${cy} A${rx},${ry} 0 0,1 ${cx - rx},${cy}`, P.line, 2.2);
        const t = 2.2, mx = cx + rx * Math.cos(t), my = cy + ry * Math.sin(t);
        const r0 = rot * Math.PI / 180, Mx = cx + (mx - cx) * Math.cos(r0) - (my - cy) * Math.sin(r0), My = cy + (mx - cx) * Math.sin(r0) + (my - cy) * Math.cos(r0);
        esfera(p, Mx, My, 30, '#cfd8dc', true);
        flecha(p, Mx, My, Mx + (cx - Mx) * .42, My + (cy - My) * .42, P.acc2, 4, 18, 'F_g', { dx: 30, dy: 26 });
        flecha(p, Mx, My, Mx - 150, My - 100, P.acc, 4, 18, 'v', { dx: -10, dy: -16 });
        // movimiento circular
        const c2x = 400, c2y = 240, r2 = 150;
        brillo(p, elipseD(c2x, c2y, r2, r2), P.glow, 2.5, { 'stroke-dasharray': '2 12' });
        esfera(p, c2x, c2y, 8, P.line);
        const a = -.8, bx = c2x + r2 * Math.cos(a), by = c2y + r2 * Math.sin(a);
        brillo(p, `M${c2x},${c2y} L${bx},${by}`, P.line, 2);
        brillo(p, `M${c2x + 60},${c2y} A60,60 0 0,0 ${c2x + 60 * Math.cos(a)},${c2y + 60 * Math.sin(a)}`, P.acc, 2.5);
        texto(p, c2x + 92, c2y - 2, 'φ', { size: 32, italic: true, fill: P.acc });
        esfera(p, bx, by, 24, P.acc2, true);
        flecha(p, bx, by, bx + 130 * Math.sin(a), by - 130 * Math.cos(a), P.acc, 4, 18, 'v', { dx: -6, dy: -16 });
        flecha(p, bx, by, bx + (c2x - bx) * .5, by + (c2y - by) * .5, P.acc3, 4, 18, 'a_c', { dx: -34, dy: 4 });
    },
    fluidos(p) {
        const x = 760, y = 120, w = 680, h = 340;
        let d = `M${x + 3},${y + 50}`;
        for (let xx = x + 3; xx <= x + w - 3; xx += 6) d += ` L${xx},${y + 50 + 7 * Math.sin((xx - x) / 38)}`;
        d += ` L${x + w - 3},${y + h - 3} L${x + 3},${y + h - 3}Z`;
        E(p, 'path', { d, fill: lin([[0, P.liq, .55], [1, mix(P.liq, '#000', .5), .8]]) });
        vidrio(p, `M${x},${y} L${x},${y + h} L${x + w},${y + h} L${x + w},${y}`, 3.5);
        const bx = x + 260, by = y + 150;
        E(p, 'rect', { x: bx - 70, y: by - 70, width: 140, height: 140, rx: 8, fill: lin([[0, P.acc], [1, mix(P.acc, '#000', .5)]], 0, 0, 1, 1) });
        flecha(p, bx + 20, by, bx + 20, by - 175, P.acc3, 5, 22, 'E', { dx: 26, dy: 10 });
        flecha(p, bx - 20, by, bx - 20, by + 150, P.acc2, 5, 22, 'P', { dx: -28, dy: -6 });
        for (let i = 0; i < 4; i++) {
            const yy = y + 110 + i * 60, L = 30 + i * 22;
            flecha(p, x + w - 10 - L - 30, yy, x + w - 10 - 30 + 0, yy, P.line, 3, 12);
        }
        burbujas(p, x + 420, y + 70, 120, 250, 14);
        // tubo en U (manómetro)
        const ux = 250, uy = 90, uh = 330, uw = 220, tw = 40;
        const h1 = 120, h2 = 220;
        E(p, 'path', { d: `M${ux},${uy + h1} L${ux},${uy + uh} A${uw / 2},${uw / 2} 0 0,0 ${ux + uw},${uy + uh} L${ux + uw},${uy + h2} L${ux + uw - tw},${uy + h2} L${ux + uw - tw},${uy + uh} A${uw / 2 - tw},${uw / 2 - tw} 0 0,1 ${ux + tw},${uy + uh} L${ux + tw},${uy + h1}Z`, fill: liquido(P.acc2) });
        vidrio(p, `M${ux},${uy} L${ux},${uy + uh} A${uw / 2},${uw / 2} 0 0,0 ${ux + uw},${uy + uh} L${ux + uw},${uy} M${ux + tw},${uy} L${ux + tw},${uy + uh} A${uw / 2 - tw},${uw / 2 - tw} 0 0,1 ${ux + uw - tw},${uy + uh} L${ux + uw - tw},${uy}`, 3);
        brillo(p, `M${ux + uw + 20},${uy + h1} L${ux + uw + 20},${uy + h2}`, P.acc, 2.5);
        texto(p, ux + uw + 48, uy + (h1 + h2) / 2 + 10, 'h', { size: 34, italic: true, fill: P.acc });
        texto(p, 600, 120, 'p = ρ · g · h', { size: 42, italic: true });
    },
    energia(p) {
        const d = 'M40,190 C220,190 300,430 520,430 C700,430 760,210 900,210 C1040,210 1100,410 1250,410 C1360,410 1420,300 1490,260';
        E(p, 'path', { d: d + ' L1490,470 L40,470Z', fill: lin([[0, P.glow, .18], [1, P.glow, .02]]) });
        brillo(p, d, P.line, 5);
        const pos = [[110, 192, 1], [520, 430, 0], [900, 210, .6]];
        pos.forEach(([x, y, ep]) => {
            esfera(p, x, y - 30, 28, P.acc2, true);
            const bx = x + 50, by = Math.max(25, y - 170), H = 110;
            E(p, 'rect', { x: bx, y: by + H * (1 - ep), width: 28, height: H * ep, fill: P.acc3, opacity: .9 });
            E(p, 'rect', { x: bx + 34, y: by + H * ep, width: 28, height: H * (1 - ep), fill: P.acc, opacity: .9 });
            E(p, 'rect', { x: bx - 4, y: by - 4, width: 70, height: H + 8, fill: 'none', stroke: P.line, 'stroke-opacity': .6, rx: 4 });
            texto(p, bx + 14, by + H + 28, 'E_p', { size: 20, italic: true });
            texto(p, bx + 48, by + H + 28, 'E_c', { size: 20, italic: true });
        });
        // péndulo
        const px = 1330, py = 30, L = 220;
        brillo(p, `M${px - 70},${py} L${px + 70},${py}`, P.line, 4);
        [-28, 0, 28].forEach((a, i) => {
            const r = a * Math.PI / 180, x = px + L * Math.sin(r), y = py + L * Math.cos(r);
            const g = G(p, { opacity: i === 2 ? 1 : .35 });
            brillo(g, `M${px},${py} L${x},${y}`, P.line, 2);
            esfera(g, x, y, 22, P.acc);
        });
        texto(p, 640, 120, 'E_m = E_c + E_p', { size: 46, italic: true });
    },
    energias(p) {
        sol(p, 210, 150, 70);
        aerogenerador(p, 600, 470, 260, 1, 20);
        aerogenerador(p, 760, 470, 200, .75, 70);
        rayo(p, 930, 60, 1.1);
        bombilla(p, 1220, 180, 1);
        // batería
        const bx = 1380, by = 110;
        E(p, 'rect', { x: bx, y: by, width: 80, height: 170, rx: 10, fill: lin([[0, '#455a64'], [1, '#263238']], 0, 0, 1, 0), stroke: P.line, 'stroke-width': 2 });
        E(p, 'rect', { x: bx + 25, y: by - 16, width: 30, height: 16, rx: 3, fill: P.line });
        for (let i = 0; i < 3; i++) E(p, 'rect', { x: bx + 10, y: by + 120 - i * 50, width: 60, height: 40, rx: 4, fill: P.acc3, opacity: .9 - i * .2 });
        texto(p, 330, 400, 'E = m · g · h', { size: 40, italic: true, op: .9 });
    },
    calor(p) {
        termometro(p, 1400, 50, 360, .78, 1.1);
        vaso(p, 900, 110, 250, 250, P.liq, .65);
        for (let i = 0; i < 3; i++) {
            let d = '';
            for (let yy = 100; yy >= 10; yy -= 4) d += (yy === 100 ? 'M' : 'L') + (965 + i * 60 + 10 * Math.sin(yy / 12)) + ',' + yy;
            brillo(p, d, P.acc2, 3, { 'stroke-opacity': .8 });
        }
        E(p, 'rect', { x: 870, y: 360, width: 310, height: 14, rx: 6, fill: '#90a4ae' });
        llama(p, 1025, 480, 100, 110);
        E(p, 'rect', { x: 1000, y: 470, width: 50, height: 30, fill: '#607d8b' });
        // frío frente a caliente
        const caja = (x, c, rapido) => {
            vidrio(p, `M${x},80 L${x},420 L${x + 260},420 L${x + 260},80 Z`, 2.5);
            for (let i = 0; i < 12; i++) {
                const px = x + 30 + rnd() * 200, py = 110 + rnd() * 280;
                if (rapido) for (let k = 1; k <= 3; k++) E(p, 'circle', { cx: px - k * 12, cy: py + k * 4, r: 12 - k * 2, fill: c, opacity: .25 / k });
                esfera(p, px, py, 13, c);
            }
        };
        caja(110, P.acc3, false);
        caja(460, P.acc2, true);
        flecha(p, 380, 250, 450, 250, P.acc, 4, 18, 'Q', { dx: -30, dy: -18 });
    },
    ondas(p) {
        altavoz(p, 140, 220, 1, 3);
        ondaSeno(p, 430, 820, 150, 50, 130, P.glow, 3.5);
        ondaSeno(p, 430, 820, 320, 35, 70, P.acc, 3.5);
        brillo(p, 'M430,150 L820,150', P.line, 1, { 'stroke-opacity': .4 });
        brillo(p, 'M430,320 L820,320', P.line, 1, { 'stroke-opacity': .4 });
        brillo(p, 'M430,80 L560,80', P.line, 2); texto(p, 495, 68, 'λ', { size: 32, italic: true });
        prisma(p, 1130, 260, 1.05, 880, 330, 1520, [-40, 170]);
    },
};

// =====================================================================
//  PORTADA (lienzo 2100 x 2970, proporción A4)
// =====================================================================
// Logo del IES José Conde García redibujado en vectorial (medidas del logo original de 270 x 150).
function logoIES(p, x, y, s = 1) {
    const g = G(p, { transform: `translate(${x} ${y}) scale(${s})` });
    const gris = '#8a8a8a';
    E(g, 'path', { d: 'M0,0 L16,0 L16,14 L29,14 L29,0 L46,0 L46,14 L59,14 L59,0 L75,0 L75,130 L0,130Z', fill: gris });
    E(g, 'rect', { x: 15, y: 36, width: 45, height: 58, fill: '#ffffff' });
    E(g, 'rect', { x: 26, y: 52, width: 24, height: 24, fill: '#d0121b' });
    const t = (str, yy, sz, sp) => E(g, 'text', { x: 100, y: yy, 'font-size': sz, fill: gris, 'font-family': 'Segoe UI Light, Segoe UI, Arial, sans-serif', 'font-weight': 300, 'letter-spacing': sp }, str);
    t('IES', 40, 46, 9);
    t('JOSÉ', 78, 27, 12);
    t('CONDE', 109, 27, 12);
    t('GARCÍA', 140, 27, 12);
}
function portada(svg, c) {
    const W = 2100, H = 2970;
    fondo(svg, W, H, { hex: 58, nbokeh: 70, escBokeh: 2.2, gx: .6, gy: .55, ax: .85, ay: .12 });
    const p = G(svg);
    // título
    const ff = 'Georgia, Cambria, "Times New Roman", serif';
    const tt = c.tamTitulo ?? 250, lt = tt * 1.12;
    c.titulo.forEach((l, i) => texto(p, 170, 560 + i * lt, l, { size: tt, anchor: 'start', fill: '#ffffff', weight: 700, family: ff }));
    const yb = 560 + (c.titulo.length - 1) * lt + 110;
    E(p, 'rect', { x: 175, y: yb, width: 300, height: 16, rx: 8, fill: P.acc });
    E(p, 'rect', { x: 495, y: yb, width: 60, height: 16, rx: 8, fill: P.acc, opacity: .5 });
    E(p, 'rect', { x: 575, y: yb, width: 22, height: 16, rx: 8, fill: P.acc, opacity: .3 });
    // curso
    const yc = yb + 90, wc = c.anchoCurso ?? 520;
    E(p, 'rect', { x: 170, y: yc, width: wc, height: 150, rx: 75, fill: lin([[0, P.acc], [1, mix(P.acc, P.acc2, .45)]], 0, 0, 1, 0) });
    texto(p, 170 + wc / 2, yc + 106, c.curso, { size: 96, fill: P.bg0, weight: 700, family: 'Segoe UI, Arial, sans-serif' });
    if (c.lema) texto(p, 170, yc + 260, c.lema, { size: 56, anchor: 'start', fill: P.line, italic: true, family: ff, op: .9 });
    // ilustración
    c.arte(G(svg));
    // pie blanco con el logo
    const yf = 2660;
    E(svg, 'rect', { x: 0, y: yf - 14, width: W, height: 14, fill: lin([[0, P.acc], [1, P.acc2]], 0, 0, 1, 0) });
    E(svg, 'rect', { x: 0, y: yf, width: W, height: H - yf, fill: '#ffffff' });
    logoIES(svg, 170, yf + 80, 1.15);
    texto(svg, 1930, yf + 140, c.centro, { size: 64, anchor: 'end', fill: P.bg1, weight: 700, family: 'Segoe UI, Arial, sans-serif' });
    texto(svg, 1930, yf + 220, c.pie, { size: 50, anchor: 'end', fill: mix(P.bg1, '#888888', .4), family: 'Segoe UI, Arial, sans-serif' });
}
