// Superficies equipotenciales (curvas de nivel de V calculadas) y líneas de campo de un dipolo: siempre perpendiculares.
lienzo(560, 340);
const cargas = [[200, 170, 1, 12], [360, 170, -1, 12]], marco = [10, 10, 550, 330];
const V = (x, y) => cargas.reduce((s, [cx, cy, q]) => s + q / Math.hypot(x - cx, y - cy), 0);
const g = recorteCaja(marco);
// equipotenciales: marching squares sobre una rejilla
const paso = 3, niveles = [-0.03, -0.018, -0.01, -0.005, 0, 0.005, 0.01, 0.018, 0.03];
niveles.forEach(v0 => {
    let d = '';
    for (let x = marco[0]; x < marco[2]; x += paso) for (let y = marco[1]; y < marco[3]; y += paso) {
        const c = [[x, y], [x + paso, y], [x + paso, y + paso], [x, y + paso]], vs = c.map(([a, b]) => V(a, b) - v0), pts = [];
        for (let i = 0; i < 4; i++) {
            const j = (i + 1) % 4;
            if ((vs[i] > 0) !== (vs[j] > 0)) { const t = vs[i] / (vs[i] - vs[j]); pts.push([c[i][0] + t * (c[j][0] - c[i][0]), c[i][1] + t * (c[j][1] - c[i][1])]); }
        }
        if (pts.length >= 2) d += `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)} L${pts[1][0].toFixed(1)},${pts[1][1].toFixed(1)} `;
    }
    E(g, 'path', { d, fill: 'none', stroke: v0 > 0 ? C.rojo : (v0 < 0 ? C.azul : C.gris), 'stroke-width': 1.3, 'stroke-opacity': .8 });
});
lineasCampo(cargas, marco, 14, { p: g, c: C.morado });
cargas.forEach(([x, y, q, r]) => carga(x, y, r, q));
texto(280, 26, 'V = 0', { size: 14, c: C.gris, halo: true });
