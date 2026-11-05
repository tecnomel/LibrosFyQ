// Figura genérica "variación de una propiedad periódica en la tabla".
// Requiere svg.js. La usan las figuras de radio atómico, EI, AE y electronegatividad.
//
// opciones:
//   titulo, subtitulo        textos del hueco central de la tabla
//   color                    color oscuro (valor máximo); el mínimo es casi blanco
//   horizontal: "izq"|"der"  sentido en que AUMENTA en un periodo
//   vertical: "arriba"|"abajo" sentido en que AUMENTA en un grupo
//   bloqueF: bool            dibuja lantánidos y actínidos
//   excepcionGasesNobles     el grupo 18 se dibuja rayado como excepción

function dibujarTendencia(op) {
    const C = 30, G = 3, P = C + G;          // casilla, hueco, paso
    const X0 = 34, Y0 = 78;                   // esquina de la casilla (grupo 1, periodo 1)
    const anchoTabla = 18 * P - G, altoTabla = 7 * P - G;
    const yF = Y0 + altoTabla + 14;           // primera fila del bloque f
    const altoF = op.bloqueF ? 2 * P : 0;
    const W = X0 + anchoTabla + 88;
    const H = yF + altoF + (op.excepcionGasesNobles ? 34 : 6);
    const svg = crearFigura(W, H);

    const oscuro = op.color, claro = mezclar(op.color, "#ffffff", 0.9);
    const der = op.horizontal === "der", arriba = op.vertical === "arriba";

    // Valor normalizado 0..1 de la propiedad según la posición
    const valor = (periodo, grupo) => {
        const h = der ? (grupo - 1) / 17 : (18 - grupo) / 17;
        const v = arriba ? (7 - periodo) / 6 : (periodo - 1) / 6;
        return 0.55 * h + 0.45 * v;
    };
    const colorDe = t => mezclar(claro, oscuro, Math.pow(t, 0.85));

    // Rayado para la excepción de los gases nobles
    if (op.excepcionGasesNobles) {
        const pat = el("pattern", { id: "rayado", width: 6, height: 6, patternUnits: "userSpaceOnUse",
            patternTransform: "rotate(45)" }, defs(svg));
        el("rect", { width: 6, height: 6, fill: "#F2F2F2" }, pat);
        el("line", { x1: 0, y1: 0, x2: 0, y2: 6, stroke: "#B5B5B5", "stroke-width": 2 }, pat);
    }

    // --- Números de grupo y periodo --------------------------------------
    const gris = { fill: "#8A8A8A", "font-size": 10, "text-anchor": "middle" };
    for (let g = 1; g <= 18; g++) {
        const fila = (g === 1 || g === 18) ? 1 : (g === 2 || g >= 13) ? 2 : 4;
        texto(svg, X0 + (g - 1) * P + C / 2, Y0 + (fila - 1) * P - 5, String(g), gris);
    }
    for (let p = 1; p <= 7; p++) {
        texto(svg, X0 - 12, Y0 + (p - 1) * P + C / 2 + 4, String(p), gris);
    }

    // --- Casillas ----------------------------------------------------------
    for (const e of casillasTabla({ conBloqueF: op.bloqueF })) {
        let x, y, t;
        if (e.bloqueF) {
            x = X0 + (e.colF + 3) * P;
            y = yF + (e.periodo - 6) * P;
            t = valor(e.periodo, 3);
        } else {
            x = X0 + (e.grupo - 1) * P;
            y = Y0 + (e.periodo - 1) * P;
            t = valor(e.periodo, e.grupo);
        }
        const excep = op.excepcionGasesNobles && e.grupo === 18;
        el("rect", { x, y, width: C, height: C, rx: 3,
            fill: excep ? "url(#rayado)" : colorDe(t),
            stroke: excep ? "#B5B5B5" : mezclar(colorDe(t), "#000000", 0.18), "stroke-width": 0.8 }, svg);
    }
    if (op.bloqueF) {   // marca de dónde se insertan lantánidos y actínidos
        for (const p of [6, 7]) {
            const x = X0 + 2 * P, y = Y0 + (p - 1) * P;
            el("rect", { x: x + 0.5, y: y + 0.5, width: C - 1, height: C - 1, rx: 3, fill: "none",
                stroke: oscuro, "stroke-width": 1.4, "stroke-dasharray": "3 2" }, svg);
        }
    }

    // --- Título en el hueco central ----------------------------------------
    const cx = X0 + 7 * P - G / 2;           // centro de los grupos 3-12
    texto(svg, cx, Y0 + P + 8, op.titulo, { "text-anchor": "middle", "font-size": 24,
        "font-weight": "bold", fill: COLORES.texto });
    if (op.subtitulo) {
        texto(svg, cx, Y0 + 2 * P + 6, op.subtitulo, { "text-anchor": "middle", "font-size": 13,
            fill: COLORES.gris });
    }

    // --- Flechas con degradado ---------------------------------------------
    function flecha(id, x1, y1, x2, y2) {
        const grad = el("linearGradient", { id, gradientUnits: "userSpaceOnUse", x1, y1, x2, y2 }, defs(svg));
        el("stop", { offset: "0%", "stop-color": mezclar(claro, oscuro, 0.35) }, grad);
        el("stop", { offset: "100%", "stop-color": oscuro }, grad);
        el("line", { x1, y1, x2, y2, stroke: `url(#${id})`, "stroke-width": 5, "stroke-linecap": "round",
            "marker-end": puntaFlecha(svg, "punta_" + id, oscuro, 22) }, svg);
    }
    // Horizontal (encima de la tabla)
    const yH = 28, xa = X0, xb = X0 + anchoTabla;
    der ? flecha("fH", xa, yH, xb - 4, yH) : flecha("fH", xb, yH, xa + 4, yH);
    texto(svg, (xa + xb) / 2, yH - 10, "Aumenta", { "text-anchor": "middle", "font-size": 16,
        "font-weight": "bold", fill: oscuro });
    // Vertical (a la derecha de la tabla)
    const xV = X0 + anchoTabla + 30, ya = Y0, yb = Y0 + altoTabla;
    arriba ? flecha("fV", xV, yb, xV, ya + 4) : flecha("fV", xV, ya, xV, yb - 4);
    const yt = (ya + yb) / 2;
    texto(svg, xV + 24, yt, "Aumenta", { "text-anchor": "middle", "font-size": 16, "font-weight": "bold",
        fill: oscuro, transform: `rotate(90 ${xV + 24} ${yt})` });

    // --- Leyenda de la excepción -------------------------------------------
    if (op.excepcionGasesNobles) {
        const ly = H - 22;
        el("rect", { x: X0, y: ly, width: 16, height: 16, rx: 2, fill: "url(#rayado)", stroke: "#B5B5B5" }, svg);
        texto(svg, X0 + 24, ly + 13, "Gases nobles (grupo 18): excepción a la tendencia", {
            "font-size": 13, fill: COLORES.gris });
    }
    return svg;
}
