// Dibujo de orbitales atómicos (requiere svg.js y 3d.js).
// Cada orbital se dibuja como la superficie r = |Y(θ,φ)|² de su parte angular,
// coloreada según el signo (fase) de la función de onda.

const FASE_POS = "#E9785F";   // fase +
const FASE_NEG = "#5E8FD8";   // fase −

/**
 * Dibuja un orbital en (cx, cy).
 * op: nombre (clave de ORBITALES), escala, etiqueta (lista de partes para texto()),
 *     plano: {c, e1, e2} opcional (plano nodal), ejes (bool), tamEjes
 */
function dibujarOrbital(svg, cx, cy, op) {
    const esc3 = new Escena3D({ cx, cy, escala: op.escala ?? 70, camara: op.camara });
    const fn = ORBITALES[op.nombre];
    if (op.ejes !== false) esc3.ejes(op.tamEjes ?? 1.35, { tamLetra: op.tamLetra ?? 15 });
    if (op.plano) esc3.plano(op.plano.c ?? [0, 0, 0], op.plano.e1, op.plano.e2, { teselas: 10 });
    esc3.superficiePolar(fn, { colorPos: FASE_POS, colorNeg: FASE_NEG,
        potencia: op.potencia ?? 1.5, tam: op.tam ?? 1.12, resT: op.resT, resP: op.resP });
    esc3.dibujar(svg);
    if (op.etiqueta) {
        texto(svg, cx, cy + (op.dyEtiqueta ?? 1.75 * (op.escala ?? 70)), op.etiqueta,
            { "text-anchor": "middle", "font-size": op.tamEtiqueta ?? 16, fill: COLORES.texto });
    }
}

/** Etiqueta "orbital p_x" con subíndice en cursiva. */
function etiquetaOrbital(letra, sub, prefijo = "orbital ") {
    const partes = [{ t: prefijo + letra }];
    if (sub) partes.push({ t: sub, sub: true, attrs: { "font-style": "italic" } });
    return partes;
}

/** Leyenda de fases (+ / −). */
function leyendaFases(svg, x, y) {
    el("circle", { cx: x, cy: y - 5, r: 7, fill: FASE_POS }, svg);
    texto(svg, x + 12, y, "fase +", { "font-size": 13, fill: COLORES.gris });
    el("circle", { cx: x + 70, cy: y - 5, r: 7, fill: FASE_NEG }, svg);
    texto(svg, x + 82, y, "fase −", { "font-size": 13, fill: COLORES.gris });
}

// --- Orbitales atómicos centrados en un punto (para enlaces y CLOA) -------------
// Devuelven funciones f(x, y, z). c = centro, d = dirección (vector).
const OA = {
    /** orbital s (tipo Slater), máximo = 1 */
    s: (c = [0, 0, 0], zeta = 1.4) => (x, y, z) =>
        Math.exp(-zeta * Math.hypot(x - c[0], y - c[1], z - c[2])),
    /** orbital p orientado según d, máximo = 1 (en r = 1/zeta).
     *  m > 1 "afila" los lóbulos (solo estético, útil cuando hay varios p en un átomo). */
    p: (c = [0, 0, 0], d = [1, 0, 0], zeta = 2.0, m = 1) => {
        const u = norm(d), k = zeta * Math.E;
        return (x, y, z) => {
            const v = [x - c[0], y - c[1], z - c[2]], r = longitud(v);
            if (r < 1e-9) return 0;
            const ct = punto(u, v) / r;
            return k * r * Math.exp(-zeta * r) * Math.sign(ct) * Math.pow(Math.abs(ct), m);
        };
    },
    /** orbital híbrido spⁿ: lóbulo grande hacia d y uno pequeño (fase opuesta) detrás */
    hibrido: (c = [0, 0, 0], d = [1, 0, 0], zeta = 2.0, a = 0.35, m = 4) => {
        const u = norm(d), k = zeta * Math.E;
        return (x, y, z) => {
            const v = [x - c[0], y - c[1], z - c[2]], r = longitud(v);
            if (r < 1e-9) return 0;
            const g = a + punto(u, v) / r;
            return k * r * Math.exp(-zeta * r) * Math.sign(g) * Math.pow(Math.abs(g) / (1 + a), m);
        };
    },
};
/** Combinación lineal: combinar([1, f1], [-1, f2], ...) */
function combinar(...terminos) {
    return (x, y, z) => terminos.reduce((s, [c, f]) => s + c * f(x, y, z), 0);
}
/** Máximo absoluto de varias funciones: para dibujar orbitales separados en una misma escena. */
function union(...fs) {
    return (x, y, z) => {
        let m = 0;
        for (const f of fs) { const v = f(x, y, z); if (Math.abs(v) > Math.abs(m)) m = v; }
        return m;
    };
}

/**
 * Dibuja la isosuperficie de fn en (cx, cy). op: escala, camara, iso, caja (semiancho),
 * n, colorPos, colorNeg, eje (dibuja el eje internuclear y en línea discontinua),
 * nucleos: lista de puntos donde dibujar un núcleo, extra(esc3) para añadir más cosas,
 * otros: [{ fn, colorPos, colorNeg, iso }] superficies adicionales en la misma escena.
 */
function escenaOrbital(svg, cx, cy, fn, op = {}) {
    const e3 = new Escena3D({ cx, cy, escala: op.escala ?? 60, camara: op.camara ?? [1, 0, 0.18] });
    const c = op.caja ?? [3.2, 2.2, 2.2];
    if (fn) e3.isosuperficie(fn, { iso: op.iso ?? 0.3, n: op.n ?? 40, min: [-c[1], -c[0], -c[2]], max: [c[1], c[0], c[2]],
        colorPos: op.colorPos, colorNeg: op.colorNeg, opacidad: op.opacidad });
    // Otras superficies en la misma escena (se ordenan en profundidad con la principal)
    for (const o of op.otros ?? []) {
        e3.isosuperficie(o.fn, { iso: o.iso ?? op.iso ?? 0.3, n: op.n ?? 40, min: [-c[1], -c[0], -c[2]], max: [c[1], c[0], c[2]],
            colorPos: o.colorPos, colorNeg: o.colorNeg });
    }
    if (op.eje) e3.segmento([0, -op.eje, 0], [0, op.eje, 0], { color: "#333", ancho: 1, trazo: "5 4", trozos: 30 });
    for (const nu of op.nucleos ?? []) {
        const q = e3.p(nu);
        e3.prims.push({ z: q[2] + 0.05, dibuja: g => el("circle", { cx: q[0], cy: q[1], r: 3.5, fill: "#8B1A10", stroke: "#fff", "stroke-width": 0.8 }, g) });
    }
    if (op.extra) op.extra(e3);
    e3.dibujar(svg);
    return e3;
}
