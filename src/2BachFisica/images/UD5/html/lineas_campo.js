// Líneas del campo eléctrico (calculadas): carga positiva, negativa, dos positivas iguales y dos cargas +2q y −q.
lienzo(800, 520);
const paneles = [
    [0, 0, [[100, 120, 1, 13]], '(a) Carga positiva', 14],
    [200, 0, [[300, 120, -1, 13]], '(b) Carga negativa', 14],
    [400, 0, [[540, 120, 1, 12], [660, 120, 1, 12]], '(c) Dos cargas positivas iguales', 12],
    [0, 260, [[290, 380, 1, 12], [490, 380, -1, 12]], '(d) Dipolo: +q y −q', 14],
    [600, 260, [[660, 380, 2, 13], [740, 380, -1, 11]], '(e) +2q y −q', 8],
];
paneles.forEach(([ox, oy, cargas, titulo, n], k) => {
    const w = k === 2 ? 400 : (k === 3 ? 600 : 200), marco = [ox + 6, oy + 10, ox + w - 6, oy + 230];
    const g = recorteCaja(marco);
    lineasCampo(cargas, marco, n, { p: g });
    cargas.forEach(([x, y, q, r]) => carga(x, y, r, q));
    texto(ox + w / 2, oy + 252, titulo, { size: 15 });
});
linea(200, 10, 200, 240, { c: C.claro }); linea(400, 10, 400, 240, { c: C.claro }); linea(600, 270, 600, 500, { c: C.claro }); linea(10, 258, 790, 258, { c: C.claro });
