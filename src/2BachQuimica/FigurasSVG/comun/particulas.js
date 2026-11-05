// Partículas y moléculas planas (bolas con brillo) para los esquemas de conocimientos básicos.
// Requiere svg.js.

// Colores CPK (los mismos que moleculas.js)
const COLOR_ATOMO = { H: "#E6E6E6", C: "#2B2B2B", N: "#2F6FD6", O: "#D8261E", Cl: "#1FA83A", S: "#E0C21A" };
const RADIO_ATOMO = { H: 9, C: 13, N: 13, O: 13, Cl: 15, S: 15 };

/** Bola con brillo. Si se indica `etq`, se escribe el símbolo dentro. */
function bola(svg, x, y, r, color, etq = null) {
    el("circle", { cx: x, cy: y, r, fill: degradadoEsfera(svg, "esf_" + color.replace("#", ""), color),
        stroke: mezclar(color, "#000000", 0.35), "stroke-width": 0.8 }, svg);
    if (etq) texto(svg, x, y + r * 0.38, etq, { "text-anchor": "middle", "font-size": r * 1.05, "font-weight": "bold",
        fill: hexARgb(color).reduce((a, b) => a + b, 0) > 450 ? "#333" : "#fff" });
}

/** Molécula plana: lista de [símbolo, dx, dy] respecto a (x, y), en px. Se dibujan de atrás
 *  hacia delante en el orden dado (los H suelen ir primero para quedar detrás). */
function moleculaPlana(svg, x, y, atomos, esc = 1) {
    for (const [s, dx, dy] of atomos) bola(svg, x + dx * esc, y + dy * esc, RADIO_ATOMO[s] * esc, COLOR_ATOMO[s]);
}

// Moléculas frecuentes (coordenadas en px para esc = 1)
const MOL = {
    H2: [["H", -6, 0], ["H", 6, 0]],
    O2: [["O", -9, 0], ["O", 9, 0]],
    N2: [["N", -9, 0], ["N", 9, 0]],
    CO: [["C", -9, 0], ["O", 9, 0]],
    CO2: [["O", -18, 0], ["O", 18, 0], ["C", 0, 0]],
    H2O: [["H", -13, 9], ["H", 13, 9], ["O", 0, 0]],
    NH3: [["H", -15, 8], ["H", 15, 8], ["N", 0, 0], ["H", 0, 17]],
};

/** Generador pseudoaleatorio reproducible (mulberry32): la figura sale igual en cada exportación. */
function aleatorio(semilla) {
    let a = semilla >>> 0;
    return () => {
        a = (a + 0x6D2B79F5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** Reparte `n` puntos dentro del rectángulo (x, y, w, h) sin solaparse (distancia mínima d). */
function repartir(n, x, y, w, h, d, semilla = 1) {
    const rnd = aleatorio(semilla), pts = [];
    for (let k = 0; pts.length < n && k < 20000; k++) {
        const p = [x + rnd() * w, y + rnd() * h];
        if (pts.every(q => Math.hypot(p[0] - q[0], p[1] - q[1]) >= d)) pts.push(p);
    }
    return pts;
}

/** Posiciones en una rejilla de `cols` × `filas` celdas dentro de (x, y, w, h), barajadas y con un
 *  pequeño desplazamiento aleatorio: reparto "desordenado" pero sin solapes. Devuelve n puntos. */
function rejilla(n, x, y, w, h, cols, filas, semilla = 1, mover = 0.25) {
    const rnd = aleatorio(semilla), cw = w / cols, ch = h / filas, celdas = [];
    for (let f = 0; f < filas; f++) for (let c = 0; c < cols; c++) celdas.push([c, f]);
    for (let i = celdas.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [celdas[i], celdas[j]] = [celdas[j], celdas[i]];
    }
    return celdas.slice(0, n).map(([c, f]) => [x + (c + 0.5 + (rnd() - 0.5) * mover * 2) * cw,
        y + (f + 0.5 + (rnd() - 0.5) * mover * 2) * ch]);
}
