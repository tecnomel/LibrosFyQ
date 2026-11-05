// Utilidades comunes para construir las figuras como SVG desde JavaScript.
// Cada HTML de figura crea un <svg id="figura"> y el script exportar.mjs
// lo extrae a .svg y lo imprime a .pdf vectorial para LaTeX.

// Cualquier error de JavaScript se escribe en la página: exportar.mjs lo detecta y lo muestra.
window.addEventListener("error", e => {
    const pre = document.createElement("pre");
    pre.textContent = "ERROR_FIGURA: " + e.message + " (línea " + e.lineno + ") " + (e.error && e.error.stack ? e.error.stack.replace(/\s+/g, " ").replace(/file:\/\/\/[^)]*\//g, "") : "");
    document.body.appendChild(pre);
});

const SVG_NS = "http://www.w3.org/2000/svg";

// Colores del libro (estilocrispropioLibro.sty / LegrandOrangeBookES.cls)
const COLORES = {
    ocre: "#F36619",        // ocre (color principal del libro)
    mDarkTeal: "#23373B",
    mybluecolour: "#394773",
    myBlue: "#027FDF",
    myRed: "#AA3939",
    myGreen: "#32AB77",
    borgona: "#800000",
    gris: "#525252",
    texto: "#23373B",
};

/** Crea un elemento SVG con atributos y lo añade a `padre` (si se indica). */
function el(tag, attrs = {}, padre = null) {
    const n = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) {
        if (v !== undefined && v !== null) n.setAttribute(k, v);
    }
    if (padre) padre.appendChild(n);
    return n;
}

/** Texto SVG. `partes` puede ser un string o una lista de
 *  {t:"texto", sup:true|false, sub:true|false, cls:{...atributos}} para superíndices. */
function texto(padre, x, y, partes, attrs = {}) {
    const t = el("text", { x, y, ...attrs }, padre);
    if (typeof partes === "string") {
        t.textContent = partes;
        return t;
    }
    for (const p of partes) {
        const s = el("tspan", p.attrs || {}, t);
        if (p.sup) { s.setAttribute("baseline-shift", "super"); s.setAttribute("font-size", "70%"); }
        if (p.sub) { s.setAttribute("baseline-shift", "sub"); s.setAttribute("font-size", "70%"); }
        s.textContent = p.t;
    }
    return t;
}

/** Crea el <svg id="figura"> con tamaño en px (1 px = 0.75 pt al imprimir). */
function crearFigura(ancho, alto) {
    const svg = el("svg", {
        id: "figura",
        xmlns: SVG_NS,
        width: ancho,
        height: alto,
        viewBox: `0 0 ${ancho} ${alto}`,
    });
    document.body.appendChild(svg);
    el("defs", {}, svg);
    // Tamaño de página exacto para la impresión a PDF
    const st = document.createElement("style");
    st.textContent = `@page { size: ${ancho}px ${alto}px; margin: 0; }`;
    document.head.appendChild(st);
    return svg;
}

/** <defs> del svg raíz (sirve también si se pasa un <g> interior). */
function defs(svg) { return (svg.ownerSVGElement || svg).querySelector("defs"); }

/** Marcador de punta de flecha reutilizable. Devuelve "url(#id)". */
function puntaFlecha(svg, id, color, tam = 10) {
    if (!defs(svg).querySelector(`#${id}`)) {
        const m = el("marker", {
            id, viewBox: "0 0 10 10", refX: 8, refY: 5,
            markerWidth: tam, markerHeight: tam, markerUnits: "userSpaceOnUse",
            orient: "auto-start-reverse",
        }, defs(svg));
        el("path", { d: "M0,0 L10,5 L0,10 L2.5,5 Z", fill: color }, m);
    }
    return `url(#${id})`;
}

/** Degradado radial tipo "esfera" (brillo arriba-izquierda). */
function degradadoEsfera(svg, id, color) {
    if (!defs(svg).querySelector(`#${id}`)) {
        const g = el("radialGradient", { id, cx: "35%", cy: "32%", r: "70%", fx: "30%", fy: "28%" }, defs(svg));
        el("stop", { offset: "0%", "stop-color": "#ffffff" }, g);
        el("stop", { offset: "30%", "stop-color": mezclar(color, "#ffffff", 0.35) }, g);
        el("stop", { offset: "85%", "stop-color": color }, g);
        el("stop", { offset: "100%", "stop-color": mezclar(color, "#000000", 0.25) }, g);
    }
    return `url(#${id})`;
}

/** Interpola dos colores hex: t=0 -> a, t=1 -> b. */
function mezclar(a, b, t) {
    const pa = hexARgb(a), pb = hexARgb(b);
    const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
    return "#" + c.map(v => v.toString(16).padStart(2, "0")).join("");
}

function hexARgb(h) {
    h = h.replace("#", "");
    return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16));
}

/** Color aproximado (hex) de una longitud de onda visible en nm (algoritmo de Bruton). */
function colorLongitudOnda(nm) {
    let r = 0, g = 0, b = 0;
    if (nm >= 380 && nm < 440) { r = -(nm - 440) / 60; b = 1; }
    else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
    else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
    else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
    else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
    else if (nm <= 780) { r = 1; }
    let f = 1;                                   // atenuación en los extremos
    if (nm < 420) f = 0.3 + 0.7 * (nm - 380) / 40;
    else if (nm > 700) f = 0.3 + 0.7 * (780 - nm) / 80;
    if (nm < 380 || nm > 780) f = 0;
    const c = v => Math.round(255 * Math.pow(Math.max(0, v * f), 0.8));
    return "#" + [r, g, b].map(v => c(v).toString(16).padStart(2, "0")).join("");
}

/** Flecha recta entre dos puntos con punta (marcador). */
function flecha(svg, x1, y1, x2, y2, op = {}) {
    const col = op.color ?? COLORES.texto;
    const id = ("pf_" + col.replace("#", "") + "_" + (op.punta ?? 9)).replace(/[^A-Za-z0-9_-]/g, "_");
    return el("line", { x1, y1, x2, y2, stroke: col, "stroke-width": op.ancho ?? 1.5,
        "marker-end": puntaFlecha(svg, id, col, op.punta ?? 9),
        "marker-start": op.doble ? puntaFlecha(svg, id, col, op.punta ?? 9) : null,
        "stroke-dasharray": op.trazo ?? null }, svg);
}

/** Línea indicadora de una etiqueta: de (x1,y1) a (x2,y2) acabada en punto. */
function indicador(svg, x1, y1, x2, y2, op = {}) {
    const col = op.color ?? COLORES.texto;
    el("line", { x1, y1, x2, y2, stroke: col, "stroke-width": op.ancho ?? 1.1 }, svg);
    el("circle", { cx: x2, cy: y2, r: op.r ?? 2.8, fill: col }, svg);
}

// ---------------------------------------------------------------------------
// Tabla periódica: posiciones (periodo, grupo) de los elementos 1-118
// ---------------------------------------------------------------------------
const SIMBOLOS = ("H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn " +
    "Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm " +
    "Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu " +
    "Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og").split(" ");

/** Devuelve {Z, simbolo, periodo, grupo, bloqueF, colF} para Z = 1..118.
 *  Los lantánidos (58-71) y actínidos (90-103) van en filas aparte (bloqueF = true). */
function posicionElemento(Z) {
    const inicios = [1, 3, 11, 19, 37, 55, 87, 119];
    let periodo = 1;
    while (Z >= inicios[periodo]) periodo++;
    const i = Z - inicios[periodo - 1];      // índice dentro del periodo
    let grupo, bloqueF = false, colF = null;
    if (periodo === 1) grupo = Z === 1 ? 1 : 18;
    else if (periodo <= 3) grupo = i < 2 ? i + 1 : i + 11;   // B (i=2) -> grupo 13
    else if (periodo <= 5) grupo = i + 1;
    else {
        if (i < 3) grupo = i + 1;                       // Cs, Ba, La / Fr, Ra, Ac
        else if (i < 17) { bloqueF = true; colF = i - 3; grupo = null; } // Ce-Lu / Th-Lr
        else grupo = i - 13;                            // Hf (i=17) -> grupo 4
    }
    return { Z, simbolo: SIMBOLOS[Z - 1], periodo, grupo, bloqueF, colF };
}

/** Lista de todas las casillas de la tabla (sin elementos concretos): útil para las tendencias. */
function casillasTabla({ conBloqueF = false, hastaPeriodo = 7 } = {}) {
    const out = [];
    for (let Z = 1; Z <= 118; Z++) {
        const p = posicionElemento(Z);
        if (p.periodo > hastaPeriodo) continue;
        if (p.bloqueF && !conBloqueF) continue;
        out.push(p);
    }
    return out;
}

// ---------------------------------------------------------------------------
// Fórmulas químicas y tablas
// ---------------------------------------------------------------------------
/** Fórmula química -> partes de texto. Los números tras letra o ")" van en subíndice;
 *  "^" introduce un superíndice (carga) hasta el siguiente espacio: "SO4^2-", "Cu^2+".
 *  Los estados (g), (l), (s), (aq) se ponen en cursiva. */
function quim(txt, attrs = {}) {
    const partes = [];
    const re = /(\^[0-9+\-−]+)|(\((?:g|l|s|aq)\))|([0-9]+)|([^0-9^(]+|\()/g;
    let m, prev = "";
    while ((m = re.exec(txt))) {
        if (m[1]) partes.push({ t: m[1].slice(1).replace("-", "−"), sup: true, attrs });
        else if (m[2]) partes.push({ t: m[2], attrs: { ...attrs, "font-style": "italic" } });
        else if (m[3]) {
            if (/[A-Za-z)\]]$/.test(prev)) partes.push({ t: m[3], sub: true, attrs });
            else partes.push({ t: m[3], attrs });
        } else partes.push({ t: m[4], attrs });
        prev = m[0];
    }
    return partes;
}

/**
 * Tabla sencilla. filas: lista de filas; cada celda es texto o lista de partes.
 * op: anchos (lista), alto (fila), cabecera (bool: primera fila resaltada), colorCab,
 *     colorBorde, tam, alinear ("middle"), cebra (color filas alternas)
 */
function tabla(svg, x, y, filas, op = {}) {
    const H = op.alto ?? 30, tam = op.tam ?? 14;
    const anchos = op.anchos ?? filas[0].map(() => 100);
    filas.forEach((f, i) => {
        let xx = x;
        f.forEach((c, j) => {
            const cab = op.cabecera !== false && i === 0;
            const lat = op.columnaCab && j === 0;
            const fondo = cab || lat ? (op.colorCab ?? "#F3D9E2") : (op.cebra && i % 2 === 0 ? op.cebra : "#fff");
            el("rect", { x: xx, y: y + i * H, width: anchos[j], height: H, fill: fondo,
                stroke: op.colorBorde ?? "#C2185B", "stroke-width": 1 }, svg);
            texto(svg, xx + anchos[j] / 2, y + i * H + H / 2 + tam * 0.36, c, { "text-anchor": "middle",
                "font-size": tam, fill: COLORES.texto, "font-weight": cab || lat ? "bold" : null, "font-family": op.fuente ?? null });
            xx += anchos[j];
        });
    });
    return { ancho: anchos.reduce((a, b) => a + b, 0), alto: filas.length * H };
}
