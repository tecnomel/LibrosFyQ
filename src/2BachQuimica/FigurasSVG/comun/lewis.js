// Estructuras de Lewis en SVG (requiere svg.js).
//
// const mol = {
//   atomos: [
//     { id: "O", s: "O", x: 0, y: 0,                // posición en unidades de enlace
//       pares: [90, 210],                           // ángulos (grados, 0 = derecha, 90 = arriba) de pares libres
//       e: [ -30 ],                                 // electrones desapareados
//       carga: "+", angCarga: 45 },                 // carga formal (opcional)
//   ],
//   enlaces: [ { a: "O", b: "H1", orden: 1, color: "#c00" } ],
// };
// dibujarLewis(svg, x0, y0, mol, { L: 60, estilo: "puntos" | "rayas" });

const LEWIS = {
    tamLetra: 24,
    color: "#1A1A1A",
    fuente: "Arial, Helvetica, sans-serif",
};

function dibujarLewis(svg, x0, y0, mol, op = {}) {
    const L = op.L ?? 60;                 // longitud de enlace (px)
    const g = el("g", {}, svg);
    const pos = {};
    const tam = op.tamLetra ?? LEWIS.tamLetra;
    for (const a of mol.atomos) pos[a.id ?? a.s] = { x: x0 + a.x * L, y: y0 - a.y * L, a };
    const radio = at => at.s === "" ? 0 : (at.radio ?? (at.s.length > 1 ? 0.62 : 0.44)) * tam;   // hueco alrededor del símbolo

    // Enlaces
    for (const b of mol.enlaces ?? []) {
        const A = pos[b.a], B = pos[b.b];
        const dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy);
        const ux = dx / d, uy = dy / d, nx = -uy, ny = ux;
        const ra = b.recorteA ?? radio(A.a), rb = b.recorteB ?? radio(B.a);
        const sep = b.orden === 3 ? 5.5 : 3.6;
        const offs = b.orden === 2 ? [-sep, sep] : b.orden === 3 ? [-sep, 0, sep] : [0];
        for (const o of offs) {
            el("line", { x1: A.x + ux * ra + nx * o, y1: A.y + uy * ra + ny * o,
                x2: B.x - ux * rb + nx * o, y2: B.y - uy * rb + ny * o,
                stroke: b.color ?? LEWIS.color, "stroke-width": b.ancho ?? 1.8,
                "stroke-dasharray": b.trazo ?? null, "stroke-linecap": "round",
                "marker-end": b.flecha ? puntaFlecha(svg, "pl_" + (b.color ?? "n").replace("#", ""), b.color ?? LEWIS.color, 10) : null }, g);
        }
    }
    // Pares libres automáticos para átomos terminales: "libres: n" los reparte
    // en el lado opuesto al enlace.
    for (const { x, y, a } of Object.values(pos)) {
        if (!a.libres || a.pares) continue;
        const vec = (mol.enlaces ?? []).filter(b => b.a === (a.id ?? a.s) || b.b === (a.id ?? a.s)).map(b => {
            const o = pos[b.a === (a.id ?? a.s) ? b.b : b.a];
            return Math.atan2(-(o.y - y), o.x - x) * 180 / Math.PI;
        });
        const b = vec.length ? vec[0] : 0;
        const rep = { 1: [180], 2: [120, 240], 3: [90, 180, 270], 4: [0, 90, 180, 270] }[a.libres];
        a.pares = rep.map(d => b + d);
    }
    // Átomos, pares y cargas
    for (const { x, y, a } of Object.values(pos)) {
        if (a.s !== "" || a.partes) {
            // ancla "start"/"end": la primera/última letra queda sobre la posición del átomo (OH, CH3...)
            const anc = a.ancla ?? "middle", dx = anc === "start" ? -tam * 0.33 : anc === "end" ? tam * 0.33 : 0;
            texto(g, x + dx, y + tam * 0.36, a.partes ?? a.s, { "text-anchor": anc, "font-size": tam,
                fill: a.color ?? LEWIS.color, "font-family": op.fuente ?? LEWIS.fuente });
        }
        const rP = a.rPar ?? radio(a) + 5;
        for (const p of a.pares ?? []) {
            const q = typeof p === "number" ? { a: p } : p;
            dibujarPar(g, x, y, q.a, rP, q.color ?? a.colorPares ?? LEWIS.color, q.forma ?? a.forma,
                op.estilo === "rayas" ? "raya" : "puntos", q.colores);
        }
        for (const p of a.e ?? []) {
            const q = typeof p === "number" ? { a: p } : p;
            const t = q.a * Math.PI / 180;
            punto1(g, x + rP * Math.cos(t), y - rP * Math.sin(t), q.color ?? a.colorPares ?? LEWIS.color, q.forma ?? a.forma);
        }
        if (a.carga) {
            const t = (a.angCarga ?? 45) * Math.PI / 180, rc = radio(a) + 9;
            const cx = x + rc * Math.cos(t), cy = y - rc * Math.sin(t);
            if (a.cargaCirculo !== false) el("circle", { cx, cy, r: 7, fill: "#fff", stroke: a.colorCarga ?? LEWIS.color, "stroke-width": 1 }, g);
            texto(g, cx, cy + 4.5, a.carga, { "text-anchor": "middle", "font-size": 13, "font-weight": "bold",
                fill: a.colorCarga ?? LEWIS.color, "font-family": LEWIS.fuente });
        }
    }
    return pos;
}

function punto1(g, x, y, color, forma) {
    if (forma === "aspa") {
        const s = 2.6;
        el("path", { d: `M${x - s},${y - s} L${x + s},${y + s} M${x - s},${y + s} L${x + s},${y - s}`,
            stroke: color, "stroke-width": 1.4 }, g);
    } else {
        el("circle", { cx: x, cy: y, r: 2.2, fill: color }, g);
    }
}

function dibujarPar(g, x, y, ang, r, color, forma, estilo, colores) {
    const t = ang * Math.PI / 180, ux = Math.cos(t), uy = -Math.sin(t), nx = -uy, ny = ux;
    const cx = x + r * ux, cy = y + r * uy;
    if (estilo === "raya") {
        el("line", { x1: cx + nx * 6, y1: cy + ny * 6, x2: cx - nx * 6, y2: cy - ny * 6,
            stroke: color, "stroke-width": 1.8, "stroke-linecap": "round" }, g);
        return;
    }
    const c = colores ?? [color, color];
    punto1(g, cx + nx * 4, cy + ny * 4, c[0], forma);
    punto1(g, cx - nx * 4, cy - ny * 4, c[1], forma);
}

/** Flecha de reacción con texto opcional encima. */
function flechaReaccion(svg, x1, y, x2, txt, op = {}) {
    flecha(svg, x1, y, x2, y, { ancho: op.ancho ?? 1.6, punta: 11, color: op.color });
    if (txt) texto(svg, (x1 + x2) / 2, y - 8, txt, { "text-anchor": "middle", "font-size": 15, fill: COLORES.texto });
}

/** Doble flecha de resonancia. */
function flechaResonancia(svg, x1, y, x2) {
    flecha(svg, x1, y, x2, y, { ancho: 1.6, punta: 11, doble: true });
}

/** Corchetes con carga (iones poliatómicos). */
function corchetes(svg, x1, y1, x2, y2, carga) {
    const t = 8;
    el("path", { d: `M${x1 + t},${y1} L${x1},${y1} L${x1},${y2} L${x1 + t},${y2} M${x2 - t},${y1} L${x2},${y1} L${x2},${y2} L${x2 - t},${y2}`,
        fill: "none", stroke: LEWIS.color, "stroke-width": 1.8 }, svg);
    if (carga) texto(svg, x2 + 4, y1 + 12, carga, { "font-size": 18, fill: LEWIS.color, "font-family": LEWIS.fuente });
}
