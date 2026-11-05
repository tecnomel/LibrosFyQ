// Miopía e hipermetropía y su corrección con lentes divergentes y convergentes.
lienzo(780, 440);
function ojo(ox, oy, foco, correccion, titulo) {
    const cx = ox + 250, cy = oy + 105, R = 75, xl = cx - R + 14, xr = cx + R;
    E(S, 'circle', { cx, cy, r: R, fill: '#fafafa', stroke: C.tinta, 'stroke-width': 2 });
    arco(cx, cy, R - 3, -55, 55, { c: '#e57373', w: 5 });
    E(S, 'ellipse', { cx: xl + 12, cy, rx: 10, ry: 26, fill: '#bbdefb', stroke: C.azul, 'stroke-width': 1.6 });
    const xo = xl + 12, Fx = xr + foco;
    [-24, 24].forEach(dy => {
        if (correccion) {
            const xL = ox + 100, k = correccion === 'div' ? 1.35 : 0.62;       // la lente separa o junta los rayos
            linea(ox + 10, cy + dy, xL, cy + dy, { c: C.naranja, w: 1.8 });
            linea(xL, cy + dy, xo, cy + dy * k, { c: C.naranja, w: 1.8 });
            linea(xo, cy + dy * k, xr - 3, cy, { c: C.naranja, w: 1.8 });
        } else {
            linea(ox + 10, cy + dy, xo, cy + dy, { c: C.naranja, w: 1.8 });
            if (foco < 0) { linea(xo, cy + dy, Fx, cy, { c: C.naranja, w: 1.8 }); linea(Fx, cy, xr - 3, cy - dy * (xr - Fx) / (Fx - xo), { c: C.naranja, w: 1.8 }); }
            else { const yR = cy + dy * (Fx - xr + 3) / (Fx - xo); linea(xo, cy + dy, xr - 3, yR, { c: C.naranja, w: 1.8 }); linea(xr - 3, yR, Fx, cy, { c: C.naranja, w: 1.2, dash: '5 4' }); }
        }
    });
    if (correccion) lente(ox + 100, cy, 50, correccion === 'conv');
    if (!correccion) punto(Fx, cy, 4.5, C.rojo);
    texto(ox + 195, oy + 210, titulo, { size: 15 });
}
ojo(0, 0, -45, null, '(a) Miopía: la imagen se forma delante de la retina');
ojo(390, 0, 0, 'div', '(b) Se corrige con una lente divergente');
ojo(0, 220, 45, null, '(c) Hipermetropía: se forma detrás de la retina');
ojo(390, 220, 0, 'conv', '(d) Se corrige con una lente convergente');
linea(390, 10, 390, 430, { c: C.claro, w: 1 }); linea(10, 220, 770, 220, { c: C.claro, w: 1 });
