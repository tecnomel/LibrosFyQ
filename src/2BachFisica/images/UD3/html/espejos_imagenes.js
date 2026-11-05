// Formación de imágenes en espejos esféricos: tres posiciones del objeto ante un espejo cóncavo y un espejo convexo.
lienzo(780, 500);
const casos = [
    { tipo: 'concavo', dx: 330, f: -70, s: -200, y: 40, t: '(a) Cóncavo, objeto más allá de C' , r: 'real, invertida y menor' },
    { tipo: 'concavo', dx: 330, f: -70, s: -105, y: 30, t: '(b) Cóncavo, objeto entre C y F', r: 'real, invertida y mayor' },
    { tipo: 'concavo', dx: 230, f: -70, s: -45, y: 30, t: '(c) Cóncavo, objeto entre F y el espejo', r: 'virtual, derecha y mayor' },
    { tipo: 'convexo', dx: 240, f: 60, s: -150, y: 40, t: '(d) Convexo', r: 'virtual, derecha y menor' },
];
casos.forEach((k, i) => {
    const ox = (i % 2) * 390, oy = Math.floor(i / 2) * 250;
    sistema({ tipo: k.tipo, X0: ox + k.dx, Y0: oy + 140, f: k.f, s: k.s, y: k.y, h: 85, caja: [ox + 6, oy + 30, ox + 384, oy + 246] });
    texto(ox + 10, oy + 20, k.t, { size: 15, anchor: 'start', bold: true });
    texto(ox + 380, oy + 244, 'Imagen ' + k.r, { size: 14, anchor: 'end', c: C.naranja, halo: true });
});
linea(390, 10, 390, 490, { c: C.claro, w: 1 }); linea(10, 250, 770, 250, { c: C.claro, w: 1 });
