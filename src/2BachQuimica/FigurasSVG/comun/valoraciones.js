// Curvas de valoración ácido-base CALCULADAS resolviendo el balance de cargas.
// Requiere svg.js y graficas.js.
//
// Se valoran V0 = 25 mL de disolución 0,1 M con valorante 0,1 M (punto de equivalencia: 25 mL).
// Tipos: AfBf (ácido fuerte + base fuerte), AdBf (ácido débil + base fuerte),
//        BdAf (base débil + ácido fuerte), AdBd (ácido débil + base débil).

const KW = 1e-14, KA_ACETICO = 1.8e-5, KB_AMONIACO = 1.8e-5;

/** pH de la mezcla tras añadir V mL de valorante. */
function pHValoracion(tipo, V, V0 = 25, C0 = 0.1, Cv = 0.1) {
    const Vt = V0 + V;
    const cA = C0 * V0 / Vt, cV = Cv * V / Vt;             // concentraciones analíticas
    const KaNH4 = KW / KB_AMONIACO;
    // balance de cargas en función de h = [H3O+]: positivo - negativo = 0
    const f = {
        AfBf: h => h + cV - cA - KW / h,                                   // H+ + Na+ = Cl- + OH-
        AdBf: h => h + cV - cA * KA_ACETICO / (KA_ACETICO + h) - KW / h,     // H+ + Na+ = A- + OH-
        BdAf: h => h + cA * h / (h + KaNH4) - cV - KW / h,                  // H+ + NH4+ = Cl- + OH-
        AdBd: h => h + cV * h / (h + KaNH4) - cA * KA_ACETICO / (KA_ACETICO + h) - KW / h,
    }[tipo];
    const lh = biseccion(l => f(Math.pow(10, l)), -14.5, 0.5);
    return -lh;
}

function dibujarValoracion(op) {
    const svg = crearFigura(400, 330);
    const g = grafica(svg, { x: 55, y: 30, w: 320, h: 240, xmin: 0, xmax: 50, ymin: 0, ymax: 14,
        ticksY: [0, 2, 4, 6, 8, 10, 12, 14], ticksX: [0, 10, 20, 30, 40, 50], etqY: "pH", flechas: false, fondo: "#FDE8D3" });
    texto(svg, 215, 318, op.etqX, { "text-anchor": "middle", "font-size": 16, fill: COLORES.texto });
    // Zona del salto de pH (±1 mL alrededor del punto de equivalencia)
    const p1 = pHValoracion(op.tipo, 24), p2 = pHValoracion(op.tipo, 26);
    g.franja(Math.min(p1, p2), Math.max(p1, p2), "#B8E2C8", 0.9);
    // Curva
    const pts = [];
    for (let V = 0; V <= 50; V += 0.05) pts.push([V, pHValoracion(op.tipo, V)]);
    g.puntos(pts, { color: "#5B4FA8", ancho: 2.6 });
    const peq = pHValoracion(op.tipo, 25);
    g.punto(25, peq, { r: 5.5 });
    const arriba = op.tipo === "BdAf" ? false : peq < 7.5;
    texto(svg, g.px(12), g.py(peq) + (arriba ? -28 : 30), "Punto de", { "text-anchor": "middle", "font-size": 15, fill: COLORES.texto });
    texto(svg, g.px(12), g.py(peq) + (arriba ? -10 : 48), "equivalencia", { "text-anchor": "middle", "font-size": 15, fill: COLORES.texto });
    texto(svg, g.px(25) + 10, g.py(peq) + 18, "pH = " + peq.toFixed(1).replace(".", ","), { "font-size": 12, fill: "#B71C1C" });
    // Letra del apartado
    el("circle", { cx: 385, cy: 16, r: 12, fill: "#fff", stroke: "#333" }, svg);
    texto(svg, 385, 21, op.letra, { "text-anchor": "middle", "font-size": 15, fill: COLORES.texto });
    return svg;
}
