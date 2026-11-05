// Formación de imágenes en lentes delgadas: tres posiciones del objeto ante una lente convergente y una lente divergente.
lienzo(780, 500);
const casos = [
    { tipo: 'convergente', dx: 215, f: 70, s: -200, y: 40, t: '(a) Convergente, objeto más allá de 2F', r: 'real, invertida y menor' },
    { tipo: 'convergente', dx: 130, f: 70, s: -105, y: 30, t: '(b) Convergente, objeto entre 2F y F', r: 'real, invertida y mayor' },
    { tipo: 'convergente', dx: 250, f: 70, s: -45, y: 30, t: '(c) Convergente, objeto entre F y la lente', r: 'virtual, derecha y mayor' },
    { tipo: 'divergente', dx: 250, f: -70, s: -150, y: 40, t: '(d) Divergente', r: 'virtual, derecha y menor' },
];
casos.forEach((k, i) => {
    const ox = (i % 2) * 390, oy = Math.floor(i / 2) * 250;
    sistema({ tipo: k.tipo, X0: ox + k.dx, Y0: oy + 140, f: k.f, s: k.s, y: k.y, h: 85, caja: [ox + 6, oy + 30, ox + 384, oy + 246] });
    texto(ox + 10, oy + 20, k.t, { size: 15, anchor: 'start', bold: true });
    texto(ox + 380, oy + 244, 'Imagen ' + k.r, { size: 14, anchor: 'end', c: C.naranja, halo: true });
});
linea(390, 10, 390, 490, { c: C.claro, w: 1 }); linea(10, 250, 770, 250, { c: C.claro, w: 1 });
