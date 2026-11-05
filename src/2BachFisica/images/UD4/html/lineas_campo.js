// Líneas del campo gravitatorio de una masa, de dos masas iguales y de dos masas distintas (integración numérica de g).
lienzo(800, 300);
function campo(masas, x, y) {
    let gx = 0, gy = 0;
    masas.forEach(([mx, my, m]) => { const dx = mx - x, dy = my - y, r2 = dx * dx + dy * dy, r = Math.sqrt(r2); gx += m * dx / (r2 * r); gy += m * dy / (r2 * r); });
    return [gx, gy];
}
function panel(ox, masas, titulo, nPorUnidad) {
    const caja = [ox + 8, 20, ox + 254, 262];
    const id = 'c' + (++_id); const cp = E(DEFS, 'clipPath', { id }); E(cp, 'rect', { x: caja[0], y: caja[1], width: caja[2] - caja[0], height: caja[3] - caja[1] });
    const g = G(S, { 'clip-path': `url(#${id})` });
    masas.forEach(([mx, my, m, rad]) => {
        const n = Math.round(nPorUnidad * m);
        for (let k = 0; k < n; k++) {
            const a = 2 * Math.PI * (k + 0.5) / n;
            // se integra hacia fuera (en contra del campo) desde cerca de la masa
            let x = mx + (rad + 2) * Math.cos(a), y = my + (rad + 2) * Math.sin(a), pts = [[x, y]];
            for (let s = 0; s < 900; s++) {
                const [gx, gy] = campo(masas, x, y), l = Math.hypot(gx, gy);
                if (l < 1e-12) break;
                x -= 2 * gx / l; y -= 2 * gy / l; pts.push([x, y]);
                if (x < caja[0] - 20 || x > caja[2] + 20 || y < caja[1] - 20 || y > caja[3] + 20) break;
                if (masas.some(([qx, qy, , qr]) => Math.hypot(qx - x, qy - y) < qr && (qx !== mx || qy !== my))) break;
            }
            E(g, 'path', { d: 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L'), fill: 'none', stroke: C.morado, 'stroke-width': 1.2 });
            // flecha hacia la masa en mitad de la línea
            const i = Math.min(pts.length - 2, 36);
            if (pts.length > 40) {
                const [p0, p1] = [pts[i + 1], pts[i]];
                flecha(p0[0], p0[1], p1[0], p1[1], { c: C.morado, w: 1.2, head: 8, p: g });
            }
        }
    });
    masas.forEach(([mx, my, m, rad]) => bola(mx, my, rad, { fill: '#90a4ae' }));
    texto(ox + 131, 290, titulo, { size: 15 });
}
panel(0, [[131, 140, 1, 14]], '(a) Una masa', 16);
panel(270, [[355, 140, 1, 12], [455, 140, 1, 12]], '(b) Dos masas iguales', 12);
panel(540, [[600, 140, 1, 9], [700, 140, 3, 16]], '(c) Masas distintas (m y 3m)', 6);
