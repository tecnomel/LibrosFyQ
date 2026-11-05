// optica.js — trazado de rayos para las figuras de óptica geométrica (UD3). Usa las funciones de fig.js.
// Convenio DIN: distancias medidas desde el elemento, positivas hacia la derecha y hacia arriba.
// En el lienzo la x crece hacia la derecha y la y hacia abajo: un objeto de altura y está en Y0 - y.

// ---------- vectores y refracción ----------
const V = {
    sum: (a, b) => [a[0] + b[0], a[1] + b[1]], res: (a, b) => [a[0] - b[0], a[1] - b[1]],
    mul: (a, k) => [a[0] * k, a[1] * k], dot: (a, b) => a[0] * b[0] + a[1] * b[1],
    uni: a => { const l = Math.hypot(a[0], a[1]); return [a[0] / l, a[1] / l]; },
};
// Refracta la dirección d en una superficie de normal nrm (cualquier sentido). Devuelve null si hay reflexión total.
function refractar(d, nrm, n1, n2) {
    d = V.uni(d); let nn = V.uni(nrm);
    let c = -V.dot(nn, d); if (c < 0) { nn = V.mul(nn, -1); c = -c; }
    const r = n1 / n2, k = 1 - r * r * (1 - c * c);
    if (k < 0) return null;
    return V.uni(V.sum(V.mul(d, r), V.mul(nn, r * c - Math.sqrt(k))));
}
function reflejar(d, nrm) { const nn = V.uni(nrm); return V.res(d, V.mul(nn, 2 * V.dot(d, nn))); }
// Intersección de la recta p + t·d con el segmento a-b (devuelve el punto o null)
function cortaSegmento(p, d, a, b) {
    const e = V.res(b, a), den = d[0] * e[1] - d[1] * e[0];
    if (Math.abs(den) < 1e-9) return null;
    const w = V.res(a, p), t = (w[0] * e[1] - w[1] * e[0]) / den, u = (w[0] * d[1] - w[1] * d[0]) / den;
    return t > 1e-6 && u >= 0 && u <= 1 ? V.sum(p, V.mul(d, t)) : null;
}
// Corta la recta que pasa por p1 y p2 con la vertical x = X
function enX(p1, p2, X) { const t = (X - p1[0]) / (p2[0] - p1[0]); return [X, p1[1] + t * (p2[1] - p1[1])]; }

// ---------- dibujo de elementos ----------
function flechaObj(x, y0, y1, o = {}) { // flecha vertical de y0 (eje) a y1
    const c = o.c ?? C.verde;
    if (Math.abs(y1 - y0) < 4) return;
    flecha(x, y0, x, y1, { c, w: o.w ?? 3, head: 11, dash: o.dash });
}
function espejo(X, Y0, h, curv, o = {}) { // curv > 0: cóncavo (bordes hacia la izquierda); < 0: convexo; 0: plano
    let p = '';
    for (let y = -h; y <= h; y += 2) p += (p ? ' L' : 'M') + (X - curv * y * y).toFixed(1) + ',' + (Y0 + y);
    camino(p, { c: C.azul, w: 3.2 });
    for (let y = -h + 6; y <= h; y += 11) { const x = X - curv * y * y; linea(x + 2, Y0 + y, x + 9, Y0 + y - 7, { c: C.gris, w: 1.2 }); }
}
function lente(X, Y0, h, conv) {
    linea(X, Y0 - h, X, Y0 + h, { c: C.azul, w: 2.6 });
    const k = 10;
    [[-h, -1], [h, 1]].forEach(([dy, s]) => {
        const y = Y0 + dy;
        if (conv) camino(`M${X - k},${y - s * k} L${X},${y} L${X + k},${y - s * k}`, { c: C.azul, w: 2.6 });
        else camino(`M${X - k},${y + s * k} L${X},${y} L${X + k},${y + s * k}`, { c: C.azul, w: 2.6 });
    });
}
function marcaEje(x, Y0, s, o = {}) {
    punto(x, Y0, 4, o.c ?? C.tinta);
    texto(x + (o.dx ?? 0), Y0 + (o.dy ?? 22), s, { italic: true, size: o.size ?? 17, c: o.c ?? C.tinta, halo: true });
}

// ---------- sistema óptico completo: elemento + objeto + rayos principales + imagen ----------
// o = { tipo: 'concavo'|'convexo'|'convergente'|'divergente', X0, Y0, f (px, con signo DIN: espejo cóncavo f < 0;
//       lente: distancia focal imagen f'), s (px, < 0), y (px), caja: [x0, y0, x1, y1], h (semialtura del elemento) }
function sistema(o) {
    const { tipo, X0, Y0, f, s, y } = o, espejoT = tipo === 'concavo' || tipo === 'convexo';
    const [bx0, by0, bx1, by1] = o.caja;
    const id = 'c' + (++_id);
    const cp = E(DEFS, 'clipPath', { id }); E(cp, 'rect', { x: bx0, y: by0, width: bx1 - bx0, height: by1 - by0 });
    const g = G(S, { 'clip-path': `url(#${id})` });
    // imagen
    const sp = espejoT ? 1 / (1 / f - 1 / s) : 1 / (1 / f + 1 / s);
    const yp = espejoT ? -sp / s * y : sp / s * y;
    const B = [X0 + s, Y0 - y], Bp = [X0 + sp, Y0 - yp];
    const real = espejoT ? sp < 0 : sp > 0, sentido = espejoT ? -1 : 1;
    linea(bx0, Y0, bx1, Y0, { c: C.gris, w: 1.2, p: g });
    // puntos de corte de los rayos con el elemento (aproximación de elemento delgado)
    const F = [X0 + (espejoT ? f : -f), Y0], Fp = [X0 + f, Y0];
    const M = [];
    M.push([[X0, B[1]], C.rojo]);                                   // rayo paralelo al eje
    if (espejoT) M.push([enX(B, [X0 + 2 * f, Y0], X0), C.naranja]);  // rayo por el centro de curvatura
    else M.push([[X0, Y0], C.naranja]);                             // rayo por el centro óptico
    M.push([enX(B, F, X0), C.morado]);                              // rayo por el foco (objeto)
    const L = 2000;
    M.forEach(([m, c]) => {
        if (Math.abs(m[1] - Y0) > (o.h ?? 999) + 30) return;         // rayo que no llega al elemento
        linea(B[0], B[1], m[0], m[1], { c, w: 1.8, p: g });
        let d = real ? V.uni(V.res(Bp, m)) : V.uni(V.res(m, Bp));
        if (Math.sign(d[0]) !== sentido) d = V.mul(d, -1);
        const Lr = o.hastaX !== undefined ? (o.hastaX - m[0]) / d[0] : L;
        linea(m[0], m[1], m[0] + d[0] * Lr, m[1] + d[1] * Lr, { c, w: 1.8, p: g });
        if (!real) linea(m[0], m[1], Bp[0], Bp[1], { c, w: 1.3, dash: '5 4', p: g });
    });
    // elemento
    if (tipo === 'concavo') espejo(X0, Y0, o.h ?? 90, 0.0022);
    if (tipo === 'convexo') espejo(X0, Y0, o.h ?? 90, -0.0022);
    if (tipo === 'convergente') lente(X0, Y0, o.h ?? 90, true);
    if (tipo === 'divergente') lente(X0, Y0, o.h ?? 90, false);
    // objeto e imagen
    if (!o.sinObjeto) flechaObj(B[0], Y0, B[1]);
    if (Math.abs(sp) < 3000) flechaObj(Bp[0], Y0, Bp[1], { c: C.naranja, dash: real ? undefined : '6 4', w: 2.6 });
    // focos y centro
    const et = o.etiquetas ?? {};
    if (espejoT) { marcaEje(X0 + f, Y0, et.F ?? 'F'); marcaEje(X0 + 2 * f, Y0, et.C ?? 'C'); }
    else { marcaEje(X0 - f, Y0, et.F ?? 'F'); marcaEje(X0 + f, Y0, et.Fp ?? "F'"); }
    return { sp, yp, B, Bp, real };
}
