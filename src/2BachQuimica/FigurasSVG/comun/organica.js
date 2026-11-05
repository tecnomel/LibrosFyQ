// Química orgánica: moléculas a partir de SMILES (SmilesDrawer) y esquemas de reacción.
// Requiere svg.js, lewis.js y la librería comun/lib/smiles-drawer.min.js.

const ORG = {
    L: 30,                  // longitud de enlace (px) en los dibujos de SmilesDrawer
    fuente: "Arial, Helvetica, sans-serif",
};

/**
 * Dibuja una molécula a partir de su SMILES centrada en (cx, cy).
 * op: escala (1 = tamaño normal), etiqueta (texto debajo), colorEtq, dy (desplazamiento etiqueta)
 * Devuelve {x, y, w, h} del recuadro ocupado.
 */
function molecula(svg, smiles, cx, cy, op = {}) {
    const k = op.escala ?? 1;
    const opciones = {
        width: 400, height: 300, bondThickness: 1.3, bondLength: ORG.L, shortBondLength: 0.8,
        bondSpacing: 0.2 * ORG.L, fontSizeLarge: 13, fontSizeSmall: 9, padding: 8,
        compactDrawing: false, terminalCarbons: false, explicitHydrogens: op.hidrogenos ?? false,
        themes: { light: { C: "#222", O: "#D32F2F", N: "#1E4FC0", F: "#2E7D32", CL: "#2E7D32", BR: "#8B2500",
            I: "#6A1B9A", P: "#E65100", S: "#B58900", B: "#8D6E63", SI: "#8D6E63", H: "#222", BACKGROUND: "#fff" } },
    };
    const cont = document.createElementNS(SVG_NS, "svg");
    const drawer = new SmilesDrawer.SvgDrawer(opciones);
    let ok = false;
    SmilesDrawer.parse(smiles, arbol => { drawer.draw(arbol, cont, "light", false); ok = true; },
        err => { console.error("SMILES no válido: " + smiles, err); });
    if (!ok) return null;
    // tamaño real del dibujo (viewBox que asigna SmilesDrawer)
    const vb = (cont.getAttribute("viewBox") || "0 0 100 100").split(/\s+/).map(Number);
    const w = vb[2] * k, h = vb[3] * k;
    cont.setAttribute("x", cx - w / 2);
    cont.setAttribute("y", cy - h / 2);
    cont.setAttribute("width", w);
    cont.setAttribute("height", h);
    cont.removeAttribute("style");
    // quitar el fondo que añade la librería
    cont.querySelectorAll("rect").forEach(r => { if (r.getAttribute("fill") === "#fff" || r.getAttribute("fill") === "#ffffff") r.remove(); });
    // Tipografía del libro (Times) para los símbolos
    cont.querySelectorAll("style").forEach(st => st.textContent = st.textContent.replace(/Arial, Helvetica, sans-serif/g, "'Times New Roman', Times, serif"));
    // Grupos: átomos "comodín" (p. ej. [Xe]) que se sustituyen por una etiqueta propia
    //   op.grupos = { Xe: { t: "NO2", color: "#1E4FC0" }, Kr: { t: "X", color: "#D32F2F" } }
    //   op.colores = { O: "#D32F2F" } recolorea todos los átomos de ese elemento
    for (const tx of cont.querySelectorAll("text.element")) {
        const contenido = tx.textContent.replace(/[⁺⁻]/g, "");
        const gr = op.grupos?.[contenido];
        const col = op.colores?.[contenido];
        if (gr) {
            while (tx.firstChild) tx.removeChild(tx.firstChild);
            for (const p of quim(gr.t)) {
                const s = document.createElementNS(SVG_NS, "tspan");
                s.setAttribute("fill", gr.color ?? "#222");
                if (p.sub) { s.setAttribute("baseline-shift", "sub"); s.setAttribute("font-size", "75%"); }
                if (p.sup) { s.setAttribute("baseline-shift", "super"); s.setAttribute("font-size", "75%"); }
                s.textContent = p.t;
                tx.appendChild(s);
            }
        } else if (col) tx.querySelectorAll("tspan").forEach(s => s.setAttribute("fill", col));
    }
    svg.appendChild(cont);
    if (op.etiqueta) texto(svg, cx, op.yEtq ?? cy + h / 2 + (op.dy ?? 16), op.etiqueta, { "text-anchor": "middle", "font-size": op.tamEtq ?? 15,
        fill: op.colorEtq ?? COLORES.texto, "font-family": "Times New Roman, serif" });
    return { x: cx - w / 2, y: cy - h / 2, w, h };
}

/** Texto químico (fórmula) con subíndices: formula(svg, x, y, "H2SO4", {color}) */
function formula(svg, x, y, txt, op = {}) {
    return texto(svg, x, y, quim(txt), { "text-anchor": op.ancla ?? "middle", "font-size": op.tam ?? 17,
        fill: op.color ?? COLORES.texto, "font-family": op.fuente ?? "Times New Roman, serif" });
}

/** Flecha de reacción con texto encima (y opcionalmente debajo). */
function flechaR(svg, x1, y, x2, arriba, abajo, op = {}) {
    flecha(svg, x1, y, x2, y, { ancho: 1.4, punta: 10, color: op.color });
    if (arriba) texto(svg, (x1 + x2) / 2, y - 8, typeof arriba === "string" ? quim(arriba) : arriba, { "text-anchor": "middle", "font-size": 15, fill: op.colorTexto ?? COLORES.texto, "font-family": "Times New Roman, serif" });
    if (abajo) texto(svg, (x1 + x2) / 2, y + 20, typeof abajo === "string" ? quim(abajo) : abajo, { "text-anchor": "middle", "font-size": 15, fill: op.colorTexto ?? COLORES.texto, "font-family": "Times New Roman, serif" });
}

/** Doble flecha de equilibrio (⇌) con texto arriba/abajo. */
function flechaEq(svg, x1, y, x2, arriba, abajo) {
    el("path", { d: `M${x1},${y - 3} L${x2},${y - 3} l-9,-6`, fill: "none", stroke: "#222", "stroke-width": 1.4 }, svg);
    el("path", { d: `M${x2},${y + 3} L${x1},${y + 3} l9,6`, fill: "none", stroke: "#222", "stroke-width": 1.4 }, svg);
    if (arriba) texto(svg, (x1 + x2) / 2, y - 10, arriba, { "text-anchor": "middle", "font-size": 15, fill: COLORES.texto, "font-family": "Times New Roman, serif" });
    if (abajo) texto(svg, (x1 + x2) / 2, y + 24, abajo, { "text-anchor": "middle", "font-size": 15, fill: COLORES.texto, "font-family": "Times New Roman, serif" });
}

/** Flecha de isomería (doble flecha azul, como en el libro). */
function flechaIso(svg, x1, y, x2) {
    flecha(svg, x1, y, x2, y, { ancho: 2.2, punta: 11, doble: true, color: "#2E4FD8" });
}

/** Signo + */
function mas(svg, x, y) { texto(svg, x, y + 6, "+", { "text-anchor": "middle", "font-size": 20, fill: COLORES.texto }); }

// --- Esquemas genéricos (con átomos de C explícitos) ----------------------------
const TNR = "Times New Roman, serif";
const ROJO = "#D32F2F", AZUL = "#1E4FC0", MAGENTA = "#C218C2";

/** Texto químico con trozos de colores: fq(svg, x, y, ["R−", ["X", ROJO]], {tam, ancla}) */
function fq(svg, x, y, segs, op = {}) {
    const partes = [];
    for (const sg of segs) {
        if (sg && typeof sg === "object" && !Array.isArray(sg)) { partes.push(sg); continue; }   // parte ya hecha: { t, sub }
        const [t, c] = Array.isArray(sg) ? sg : [sg, op.color ?? "#1A1A1A"];
        for (const p of quim(t)) partes.push({ ...p, attrs: { ...(p.attrs || {}), fill: c } });
    }
    return texto(svg, x, y, partes, { "text-anchor": op.ancla ?? "middle", "font-size": op.tam ?? 18, "font-family": TNR });
}

/**
 * −C−C− genérico: sust = { i1, a1, b1, a2, b2, d2 } etiquetas (texto o [texto, color]) de las
 * posiciones: i1 izquierda del C1, a1 arriba C1, b1 abajo C1, a2 arriba C2, b2 abajo C2, d2 derecha C2.
 * Una posición sin etiqueta se dibuja como enlace libre.
 */
function alcanoGen(svg, x, y, sust = {}, op = {}) {
    const L = op.L ?? 34;
    const pos = { i1: [-1, 0, 0], a1: [0, 0.85, 0], b1: [0, -0.85, 0], a2: [1, 0.85, 1], b2: [1, -0.85, 1], d2: [2, 0, 1] };
    const atomos = [{ s: "C", id: "C0", x: 0, y: 0 }, { s: "C", id: "C1", x: 1, y: 0 }];
    const enlaces = [{ a: "C0", b: "C1" }];
    for (const [k, [px, py, c]] of Object.entries(pos)) {
        const v = sust[k];
        const [t, col] = Array.isArray(v) ? v : [v, "#1A1A1A"];
        const f = v ? 1 : 0.62;                      // enlace libre más corto
        const dx = px - c, dy = py;
        atomos.push({ s: v ? "_" : "", partes: v ? quim(t).map(p => ({ ...p, attrs: { fill: col } })) : null, id: k,
            x: c + dx * f, y: dy * f, radio: v ? (t.length > 1 ? 0.62 : 0.44) : 0, color: col });
        enlaces.push({ a: "C" + c, b: k });
    }
    return dibujarLewis(svg, x, y, { atomos, enlaces }, { L, tamLetra: op.tam ?? 19, fuente: TNR });
}

/** C=C genérico con cuatro enlaces libres (o etiquetas a1, b1, a2, b2). */
function alquenoGen(svg, x, y, sust = {}, op = {}) {
    const L = op.L ?? 34, c = 0.62;
    const pos = { a1: [-0.5 * c, 0.87 * c, 0], b1: [-0.5 * c, -0.87 * c, 0], a2: [1 + 0.5 * c, 0.87 * c, 1], b2: [1 + 0.5 * c, -0.87 * c, 1] };
    const atomos = [{ s: "C", id: "C0", x: 0, y: 0 }, { s: "C", id: "C1", x: 1, y: 0 }];
    const enlaces = [{ a: "C0", b: "C1", orden: 2 }];
    for (const [k, [px, py, cc]] of Object.entries(pos)) {
        const v = sust[k];
        const [t, col] = Array.isArray(v) ? v : [v, "#1A1A1A"];
        const f = v ? 1.4 : 1;                       // con etiqueta, el enlace es más largo
        atomos.push({ s: v ? "_" : "", partes: v ? quim(t).map(p => ({ ...p, attrs: { fill: col } })) : null, id: k,
            x: cc + (px - cc) * f, y: py * f, radio: v ? 0.5 : 0 });
        enlaces.push({ a: "C" + cc, b: k });
    }
    return dibujarLewis(svg, x, y, { atomos, enlaces }, { L, tamLetra: op.tam ?? 19, fuente: TNR });
}

/** Flecha curva (p. ej. para indicar "el mismo reactivo"); de (x1,y1) a (x2,y2) curvada hacia la izquierda. */
function flechaCurva(svg, x1, y1, x2, y2, op = {}) {
    const cx = Math.min(x1, x2) - (op.curva ?? 40), cy = (y1 + y2) / 2;
    el("path", { d: `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`, fill: "none", stroke: op.color ?? "#222", "stroke-width": 1.6,
        "marker-end": puntaFlecha(svg, "pc_" + (op.color ?? "#222").replace("#", ""), op.color ?? "#222", 10) }, svg);
}

// --- Polímeros -------------------------------------------------------------------
/** Corchetes de unidad repetitiva entre x1 y x2 (altura 2h, centrados en y) con subíndice n. */
function corchetesPolimero(svg, x1, x2, y, h, n = "n") {
    const t = 7;
    el("path", { d: `M${x1 + t},${y - h} L${x1},${y - h} L${x1},${y + h} L${x1 + t},${y + h} M${x2 - t},${y - h} L${x2},${y - h} L${x2},${y + h} L${x2 - t},${y + h}`,
        fill: "none", stroke: "#222", "stroke-width": 1.6 }, svg);
    texto(svg, x2 + 4, y + h + 4, n, { "font-size": 17, "font-style": "italic", fill: "#222", "font-family": TNR });
}

/**
 * Unidad repetitiva vinílica −[CH2−CXY]n− con C explícitos: sust = { a1, b1, a2, b2 }
 * (por defecto H). Devuelve el ancho aproximado en px.
 */
function unidadVinilica(svg, x, y, sust = {}, op = {}) {
    const L = op.L ?? 34;
    const s = { a1: "H", b1: "H", a2: "H", b2: "H", ...sust };
    const atomos = [{ s: "C", id: "C0", x: 0, y: 0 }, { s: "C", id: "C1", x: 1, y: 0 },
        { s: "", id: "iz", x: -0.95, y: 0 }, { s: "", id: "de", x: 1.95, y: 0 }];
    const enlaces = [{ a: "C0", b: "C1" }, { a: "iz", b: "C0" }, { a: "C1", b: "de" }];
    for (const [k, px, py, c] of [["a1", 0, 0.9, 0], ["b1", 0, -0.9, 0], ["a2", 1, 0.9, 1], ["b2", 1, -0.9, 1]]) {
        const v = s[k];
        const [t, col] = Array.isArray(v) ? v : [v, "#1A1A1A"];
        atomos.push({ s: "_", partes: quim(t).map(p => ({ ...p, attrs: { fill: col } })), id: k, x: px, y: py,
            radio: t.length > 2 ? 0.75 : t.length > 1 ? 0.62 : 0.44, ancla: t.length > 2 ? "middle" : "middle" });
        enlaces.push({ a: "C" + c, b: k });
    }
    dibujarLewis(svg, x, y, { atomos, enlaces }, { L, tamLetra: op.tam ?? 18, fuente: TNR });
    corchetesPolimero(svg, x - 0.6 * L, x + 1.6 * L, y, 1.35 * L);
    return 3 * L;
}
