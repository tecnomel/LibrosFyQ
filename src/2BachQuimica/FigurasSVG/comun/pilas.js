// Pilas galvánicas (requiere svg.js). Pila Daniell: Zn | Zn2+ || Cu2+ | Cu
function dibujarPila(op = {}) {
    const det = op.detalle;
    const W = 620, H = det ? 470 : 500;
    const svg = crearFigura(W, H);
    const T = (x, y, t, a = {}) => texto(svg, x, y, t, { "text-anchor": "middle", "font-size": 17, fill: COLORES.texto, ...a });
    // Degradados
    const lin = (id, cs, v) => { const g = el("linearGradient", { id, x1: 0, y1: 0, x2: v ? 0 : 1, y2: v ? 1 : 0 }, defs(svg));
        cs.forEach(([o, c]) => el("stop", { offset: o, "stop-color": c }, g)); };
    lin("zn", [["0%", "#8E8E8E"], ["45%", "#E6E6E6"], ["100%", "#7A7A7A"]]);
    lin("cu", [["0%", "#B5651D"], ["45%", "#F2A65A"], ["100%", "#9C4F12"]]);
    lin("agua", [["0%", "#8FD3F4"], ["100%", "#3FA0D8"]], true);
    lin("aguaCu", [["0%", "#7FC4F2"], ["100%", "#1F78C8"]], true);
    lin("vidrio", [["0%", "#DDEFF6"], ["30%", "#FFFFFF"], ["100%", "#C6E2EC"]]);
    const yT = det ? 150 : 250, yB = H - 25, bw = 190;
    const vaso = (cx, agua) => {
        el("rect", { x: cx - bw / 2, y: yT, width: bw, height: yB - yT, fill: "url(#vidrio)", stroke: "#7AAFC6", "stroke-width": 1.5 }, svg);
        el("rect", { x: cx - bw / 2 + 2, y: yT + 50, width: bw - 4, height: yB - yT - 52, fill: agua, opacity: 0.85 }, svg);
    };
    const cxA = 150, cxC = W - 150;
    vaso(cxA, "url(#agua)"); vaso(cxC, "url(#aguaCu)");
    // Puente salino (tubo en U)
    const ub = (x1, x2, yb, yt, ancho, color) => el("path", { d: "M" + x1 + "," + yb + " L" + x1 + "," + (yt + 60) + " Q" + x1 + "," + yt + " " + ((x1 + x2) / 2) + "," + yt +
        " Q" + x2 + "," + yt + " " + x2 + "," + (yt + 60) + " L" + x2 + "," + yb, fill: "none", stroke: color, "stroke-width": ancho, "stroke-linecap": "butt" }, svg);
    const xu1 = cxA + 45, xu2 = cxC - 45, yu = det ? 60 : 150;
    ub(xu1, xu2, yT + 110, yu, 34, "#9FB6C8");
    ub(xu1, xu2, yT + 110, yu, 26, "#EEF6FB");
    [xu1, xu2].forEach(x => el("rect", { x: x - 13, y: yT + 100, width: 26, height: 14, fill: "#FFFFFF", stroke: "#9FB6C8", "stroke-dasharray": "2 2" }, svg));
    T((xu1 + xu2) / 2, yu + 35, "Puente salino", { "font-size": 18 });
    T((xu1 + xu2) / 2, yu + 55, "(KCl)", { "font-size": 14, fill: COLORES.gris });
    // Electrodos (inclinados)
    const electrodo = (x, y1, y2, inc, fill) => el("polygon", { points: (x - 12) + "," + y1 + " " + (x + 12) + "," + y1 + " " + (x + 12 + inc) + "," + y2 + " " + (x - 12 + inc) + "," + y2,
        fill, stroke: "#555" }, svg);
    const yE1 = det ? 70 : 140;
    electrodo(cxA - 50, yE1, yB - 20, 25, "url(#zn)");
    electrodo(cxC + 50, yE1, yB - 20, -25, "url(#cu)");
    T(cxA - 20, yE1 + 30, "Zn", { "font-size": 18 });
    T(cxC + 20, yE1 + 30, "Cu", { "font-size": 18 });
    // Cable y voltímetro / flujo de electrones
    const yw = det ? 46 : 60;
    el("path", { d: "M" + (cxA - 50) + "," + yE1 + " L" + (cxA - 50) + "," + yw + " L" + (cxC + 50) + "," + yw + " L" + (cxC + 50) + "," + yE1, fill: "none", stroke: "#222", "stroke-width": 2 }, svg);
    if (!det) {
        el("circle", { cx: W / 2, cy: yw, r: 24, fill: "#fff", stroke: "#222", "stroke-width": 2 }, svg);
        T(W / 2, yw + 7, "V", { "font-size": 22 });
        T(W / 2, yw + 48, "1,10 V", { "font-size": 14, fill: COLORES.gris });
    }
    flecha(svg, W / 2 - 110, yw - 12, W / 2 - 40, yw - 12, { ancho: 1.8, punta: 10 });
    T(W / 2 - 75, yw - 20, "e⁻", { "font-size": 15 });
    const polo = (x, y, s, c) => { el("circle", { cx: x, cy: y, r: 11, fill: c }, svg); T(x, y + 6, s, { fill: "#fff", "font-weight": "bold" }); };
    polo(cxA - 105, yw + 60, "−", "#1E88E5"); T(cxA - 105, yw + 38, "Ánodo", { "font-size": 17 });
    polo(cxC + 105, yw + 60, "+", "#E53935"); T(cxC + 105, yw + 38, "Cátodo", { "font-size": 17 });
    // Iones y procesos
    const ion = (x, y, t, c = COLORES.texto, tam = 16) => texto(svg, x, y, quim(t), { "text-anchor": "middle", "font-size": tam, fill: c });
    if (det) {
        [[yT + 150], [yT + 190], [yT + 230]].forEach(([y]) => { el("circle", { cx: cxA - 43 + (y - yT) * 0.08, cy: y, r: 9, fill: "#fff", stroke: "#222" }, svg); T(cxA - 43 + (y - yT) * 0.08, y + 5, "−", { "font-size": 14 }); });
        [[yT + 150], [yT + 190], [yT + 230]].forEach(([y]) => { el("circle", { cx: cxC + 43 - (y - yT) * 0.08, cy: y, r: 9, fill: "#fff", stroke: "#222" }, svg); T(cxC + 43 - (y - yT) * 0.08, y + 5, "+", { "font-size": 14 }); });
        ion(cxA + 30, yT + 190, "Zn^2+"); ion(cxA + 40, yT + 230, "Cl^-", "#1B5E20");
        flecha(svg, xu1, yT + 120, xu1 + 5, yT + 215, { ancho: 1.5, punta: 8, color: "#1B5E20" });
        ion(cxC - 5, yT + 190, "SO4^2-"); ion(cxC - 40, yT + 230, "K^+", "#1B5E20");
        flecha(svg, xu2, yT + 120, xu2 - 5, yT + 215, { ancho: 1.5, punta: 8, color: "#1B5E20" });
        ion(cxA - 10, yB - 35, "Zn^2+", "#fff"); ion(cxC + 10, yB - 35, "Cu^2+", "#fff");
        T(W / 2, yB - 5, "Cl⁻ hacia el ánodo · K⁺ hacia el cátodo", { "font-size": 13, fill: "#1B5E20" });
    } else {
        ion(cxA - 30, yB - 50, "Zn(s) → Zn^2+ + 2e^-", "#fff", 14);
        ion(cxC + 20, yB - 50, "Cu^2+ + 2e^- → Cu(s)", "#fff", 14);
        T(cxA, yB - 18, "oxidación", { "font-size": 14, fill: "#fff" });
        T(cxC, yB - 18, "reducción", { "font-size": 14, fill: "#fff" });
        ion(cxA + 40, yT + 110, "ZnSO4 (aq)", COLORES.texto, 14);
        ion(cxC - 40, yT + 110, "CuSO4 (aq)", COLORES.texto, 14);
    }
    return svg;
}
