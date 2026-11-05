// Gráficas científicas en SVG (requiere svg.js).
//
// const g = grafica(svg, { x: 60, y: 20, w: 400, h: 260, xmin: 0, xmax: 50, ymin: 0, ymax: 14,
//                          etqX: "V (mL)", etqY: "pH", ticksX: [0,10,20], ticksY: [0,2,4] });
// g.curva(f, { color, ancho, desde, hasta, n })     // y = f(x)
// g.puntos([[x,y],...], {...})                       // polilínea
// g.px(x), g.py(y)                                   // coordenadas en px

function grafica(svg, op) {
    const { x, y, w, h } = op;
    const px = v => x + w * (v - op.xmin) / (op.xmax - op.xmin);
    const py = v => y + h - h * (v - op.ymin) / (op.ymax - op.ymin);
    const col = op.colorEjes ?? "#222";
    if (op.fondo) el("rect", { x, y, width: w, height: h, fill: op.fondo }, svg);
    // ejes
    flecha(svg, x, y + h, x + w + (op.flechas === false ? 0 : 14), y + h, { color: col, ancho: 1.5, punta: op.flechas === false ? 0.1 : 10 });
    flecha(svg, x, y + h, x, y - (op.flechas === false ? 0 : 14), { color: col, ancho: 1.5, punta: op.flechas === false ? 0.1 : 10 });
    const tam = op.tam ?? 14;
    for (const t of op.ticksX ?? []) {
        el("line", { x1: px(t), y1: y + h, x2: px(t), y2: y + h + 5, stroke: col }, svg);
        texto(svg, px(t), y + h + 19, String(t).replace(".", ","), { "text-anchor": "middle", "font-size": tam - 1, fill: col });
    }
    for (const t of op.ticksY ?? []) {
        el("line", { x1: x - 5, y1: py(t), x2: x, y2: py(t), stroke: col }, svg);
        texto(svg, x - 9, py(t) + 5, String(t).replace(".", ","), { "text-anchor": "end", "font-size": tam - 1, fill: col });
    }
    if (op.etqX) texto(svg, op.posEtqX?.[0] ?? x + w, op.posEtqX?.[1] ?? y + h + (op.ticksX ? 40 : 22), op.etqX,
        { "text-anchor": op.posEtqX ? "middle" : "end", "font-size": tam + 2, fill: col });
    if (op.etqY) texto(svg, x - (op.ticksY ? 12 : 8), y - 2, op.etqY, { "text-anchor": "end", "font-size": tam + 2, fill: col });
    const g = {
        px, py,
        curva(f, o = {}) {
            const n = o.n ?? 400, a = o.desde ?? op.xmin, b = o.hasta ?? op.xmax;
            const pts = [];
            for (let k = 0; k <= n; k++) {
                const xv = a + (b - a) * k / n, yv = f(xv);
                if (isFinite(yv)) pts.push(`${px(xv).toFixed(1)},${py(Math.max(op.ymin - 1e9, yv)).toFixed(1)}`);
            }
            return el("polyline", { points: pts.join(" "), fill: "none", stroke: o.color ?? "#D32F2F",
                "stroke-width": o.ancho ?? 2.5, "stroke-linejoin": "round", "stroke-dasharray": o.trazo ?? null }, svg);
        },
        puntos(lista, o = {}) {
            return el("polyline", { points: lista.map(([a, b]) => `${px(a).toFixed(1)},${py(b).toFixed(1)}`).join(" "),
                fill: o.relleno ?? "none", stroke: o.color ?? "#D32F2F", "stroke-width": o.ancho ?? 2.5, "stroke-linejoin": "round",
                "fill-opacity": o.opacidad ?? null }, svg);
        },
        franja(y1, y2, color, opacidad = 1) {
            el("rect", { x, y: py(y2), width: w, height: py(y1) - py(y2), fill: color, "fill-opacity": opacidad }, svg);
        },
        punto(a, b, o = {}) {
            el("circle", { cx: px(a), cy: py(b), r: o.r ?? 5, fill: o.color ?? "#D32F2F", stroke: "#fff", "stroke-width": 1 }, svg);
        },
    };
    return g;
}

/** Resuelve f(x) = 0 por bisección en [a, b]. */
function biseccion(f, a, b, it = 100) {
    let fa = f(a);
    for (let k = 0; k < it; k++) {
        const m = (a + b) / 2, fm = f(m);
        if ((fm > 0) === (fa > 0)) { a = m; fa = fm; } else b = m;
    }
    return (a + b) / 2;
}

/** Curva gaussiana suave para perfiles de energía: base -> pico -> final. */
function perfilEnergia(x, e0, emax, e1, xc = 0.5, s = 0.12) {
    const g = Math.exp(-((x - xc) ** 2) / (2 * s * s));
    const escalon = e0 + (e1 - e0) / (1 + Math.exp(-(x - xc) / (s * 0.45)));
    return escalon + (emax - (e0 + e1) / 2) * g;
}
