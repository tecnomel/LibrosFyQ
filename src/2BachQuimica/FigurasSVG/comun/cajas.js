// Diagramas de cajas (orbitales) con flechas de espín. Requiere svg.js.
//
// dibujarCajas(svg, x, y, [
//   { etq: "1s", e: [2] },                 // una caja con 2 electrones
//   { etq: "2p", e: [1, 1, 0] },           // subnivel de 3 cajas
//   { etq: "2sp³", e: [1,1,1,1], color: "#F6D7B0" },   // cajas resaltadas
// ], { caja: 24, hueco: 10 })
// Cada e puede ser 0, 1 (↑), 2 (↑↓), "d" (↓), o un objeto {n:1|2, colores:[c1,c2]} para
// distinguir el origen de los electrones.
// Devuelve la x final.

const CAJA_COLOR = "#D5DCF0";
const CAJA_BORDE = "#4A4A5A";
const CAJA_OTRO = "#F3E7C9";      // orbital del otro átomo (H, Cl...)
const CAJA_HIBRIDO = "#F9D9B8";   // orbitales híbridos

function flechaEspin(svg, x, y, alto, arriba, color) {
    const y1 = arriba ? y + alto / 2 : y - alto / 2, y2 = arriba ? y - alto / 2 : y + alto / 2;
    const s = arriba ? 1 : -1;
    el("path", { d: `M${x},${y1} L${x},${y2} M${x - 3.2},${y2 + 4.5 * s} L${x},${y2} L${x + 3.2},${y2 + 4.5 * s}`,
        fill: "none", stroke: color, "stroke-width": 1.6, "stroke-linecap": "round", "stroke-linejoin": "round" }, svg);
}

function dibujarCajas(svg, x, y, subniveles, op = {}) {
    const C = op.caja ?? 24, H = op.hueco ?? 10, col = op.colorFlecha ?? "#1A1A2A";
    const tam = op.tamLetra ?? 15;
    for (const sub of subniveles) {
        if (sub.salto) { x += sub.salto; continue; }
        const n = sub.e.length;
        const x0 = x;
        for (let k = 0; k < n; k++) {
            const fondo = (Array.isArray(sub.color) ? sub.color[k] : sub.color) ?? CAJA_COLOR;
            // Caja solapada (orbital que se superpone con el de otro átomo al enlazar)
            const sol = Array.isArray(sub.solapada) ? sub.solapada[k] : sub.solapada;
            if (sol) el("rect", { x: x + 4, y: y + 4, width: C, height: C, fill: typeof sol === "string" ? sol : CAJA_OTRO,
                stroke: CAJA_BORDE, "stroke-width": 1.1 }, svg);
            el("rect", { x, y, width: C, height: C, fill: fondo, stroke: CAJA_BORDE, "stroke-width": 1.1 }, svg);
            let e = sub.e[k], cols = [col, col];
            if (typeof e === "object") { cols = e.colores ?? cols; e = e.n; }
            if (e === 1) flechaEspin(svg, x + C / 2, y + C / 2, C * 0.62, true, cols[0]);
            if (e === "d") flechaEspin(svg, x + C / 2, y + C / 2, C * 0.62, false, cols[0]);
            if (e === 2) {
                flechaEspin(svg, x + C / 2 - 4, y + C / 2, C * 0.62, true, cols[0]);
                flechaEspin(svg, x + C / 2 + 4, y + C / 2, C * 0.62, false, cols[1]);
            }
            x += C;
        }
        // Etiqueta del subnivel (con corchete si hay varias cajas)
        if (sub.etq) {
            const xm = (x0 + x) / 2;
            const partes = etiquetaSubnivel(sub.etq);
            if (n > 1 && !op.sinCorchete) {
                el("path", { d: `M${x0 + 2},${y - 4} L${x0 + 2},${y - 10} L${x - 2},${y - 10} L${x - 2},${y - 4}`,
                    fill: "none", stroke: CAJA_BORDE, "stroke-width": 1 }, svg);
                const w = tam * 0.62 * sub.etq.length + 6;
                el("rect", { x: xm - w / 2, y: y - 22, width: w, height: 16, fill: op.fondo ?? "#fff" }, svg);
            }
            texto(svg, xm, y - 10, partes, { "text-anchor": "middle", "font-size": tam, fill: COLORES.texto });
        }
        if (sub.abajo) {
            texto(svg, (x0 + x) / 2, y + C + 17, etiquetaSubnivel(sub.abajo), { "text-anchor": "middle", "font-size": tam - 1, fill: COLORES.texto });
        }
        x += H;
    }
    return x - H;
}

/** "2p" -> 2 + p en cursiva; "sp3" -> sp + ³ ; admite superíndices ya escritos (²,³). */
function etiquetaSubnivel(t) {
    const m = t.match(/^(\d*)(sp|[spdf])([²³¹⁰⁴⁵⁶⁷⁸⁹]*)(.*)$/);
    if (!m) return t;
    const partes = [];
    if (m[1]) partes.push({ t: m[1] });
    partes.push({ t: m[2], attrs: { "font-style": "italic" } });
    if (m[3]) partes.push({ t: m[3] });
    if (m[4]) {
        // subíndices tipo "x", "y", "z", "xy"
        partes.push({ t: m[4], sub: true, attrs: { "font-style": "italic" } });
    }
    return partes;
}

/** Configuración electrónica como partes de texto: "1s2 2s2 2p6 *3s2 *3p4"
 *  (el * marca la capa de valencia, que se pone en negrita). */
function configuracion(txt) {
    const partes = [];
    txt.trim().split(/\s+/).forEach((tok, i) => {
        const neg = tok.startsWith("*");
        const m = tok.replace("*", "").match(/^(\d+)([spdf])(\d+)$/);
        const b = neg ? { "font-weight": "bold" } : {};
        if (i) partes.push({ t: " " });
        partes.push({ t: m[1], attrs: b });
        partes.push({ t: m[2], attrs: { ...b, "font-style": "italic" } });
        partes.push({ t: m[3], sup: true, attrs: b });
    });
    return partes;
}

/** Símbolo químico con número atómico como subíndice a la izquierda, p. ej. ₉F. */
function simboloZ(svg, x, y, Z, s, op = {}) {
    texto(svg, x, y, [{ t: String(Z), sub: true }, { t: s }], { "text-anchor": op.ancla ?? "end",
        "font-size": op.tam ?? 18, fill: COLORES.texto });
}

/** Llave vertical "}" entre y1 y y2 en x. */
function llave(svg, x, y1, y2, op = {}) {
    const m = (y1 + y2) / 2, w = op.ancho ?? 10;
    el("path", { d: `M${x},${y1} Q${x + w},${y1} ${x + w},${y1 + 12} L${x + w},${m - 8} Q${x + w},${m} ${x + 2 * w},${m} ` +
        `Q${x + w},${m} ${x + w},${m + 8} L${x + w},${y2 - 12} Q${x + w},${y2} ${x},${y2}`,
        fill: "none", stroke: COLORES.texto, "stroke-width": 1.6 }, svg);
}
