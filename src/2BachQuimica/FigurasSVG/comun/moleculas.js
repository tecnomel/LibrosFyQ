// Moléculas en 3D (bolas y varillas) y esquemas de geometría TRPECV.
// Requiere svg.js y 3d.js.

// Colores CPK
const CPK = {
    H: "#E6E6E6", C: "#2B2B2B", N: "#2F6FD6", O: "#D8261E", F: "#8FD14F", Cl: "#1FA83A",
    Br: "#9B2B1B", I: "#6A2E8F", S: "#E0C21A", P: "#F08020", B: "#F2A38E", Be: "#7FD37F",
    Al: "#B9A7A7", Si: "#D8B98A", Na: "#8A4DE0", Xe: "#3FB8C8",
};
const RADIO = { H: 0.18, C: 0.26, N: 0.26, O: 0.26, F: 0.24, Cl: 0.29, Br: 0.31, I: 0.34, S: 0.31, P: 0.31, B: 0.26, Be: 0.26, Al: 0.31 };

/**
 * mol = {
 *   atomos: [{ s: "C", p: [x,y,z], etiqueta: true|"texto", r }],
 *   enlaces: [[0,1], [0,2], ...],
 *   pares: [{ en: 0, dir: [x,y,z] }],           // pares no enlazantes (dos puntos)
 *   angulos: [{ a: 1, c: 0, b: 2, texto: "109,5°", radio: 0.45 }],
 * }
 * op = { cx, cy, escala, camara }
 */
function dibujarMolecula(svg, mol, op = {}) {
    const esc3 = new Escena3D({ cx: op.cx ?? 200, cy: op.cy ?? 200, escala: op.escala ?? 110, camara: op.camara });
    const P = mol.atomos.map(a => a.p);
    // Varillas (gris con brillo)
    const rad = a => a.r ?? RADIO[a.s] ?? 0.3;
    for (const [i, j] of mol.enlaces ?? []) {
        // la varilla empieza y acaba en la superficie de las bolas (lo de dentro no se ve)
        const u = norm(resta(P[j], P[i]));
        const a = suma(P[i], esc(u, rad(mol.atomos[i]) * 0.8)), b = resta(P[j], esc(u, rad(mol.atomos[j]) * 0.8));
        esc3.segmento(a, b, { color: "#8E959C", ancho: op.anchoVarilla ?? 9, sesgo: -0.02, trozos: 6 });
        esc3.segmento(a, b, { color: "#E8ECEF", ancho: (op.anchoVarilla ?? 9) * 0.3, sesgo: -0.019, trozos: 6 });
    }
    // Átomos
    for (const a of mol.atomos) {
        const color = a.color ?? CPK[a.s] ?? "#999";
        const r = a.r ?? RADIO[a.s] ?? 0.3;
        const oscuro = ["C", "N", "O", "I", "Br", "P", "Cl", "Na"].includes(a.s);
        esc3.bola(a.p, r, color, svg, { etiqueta: a.etiquetaDentro ? a.s : null, colorLetra: oscuro ? "#fff" : "#222", tamLetra: 18 });
    }
    // Pares no enlazantes: dos puntos negros junto al átomo
    for (const pr of mol.pares ?? []) {
        const c = P[pr.en], d = norm(pr.dir);
        const r = (mol.atomos[pr.en].r ?? RADIO[mol.atomos[pr.en].s] ?? 0.3) + 0.14;
        const perp = norm(cruz(d, Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]));
        const perp2 = norm(cruz(d, perp));
        // separación en la dirección que más se ve en pantalla
        const sep = Math.abs(punto(perp, esc3.f)) < Math.abs(punto(perp2, esc3.f)) ? perp : perp2;
        for (const s of [-1, 1]) {
            const q = esc3.p(suma(suma(c, esc(d, r)), esc(sep, 0.07 * s)));
            esc3.prims.push({ z: q[2] + 0.5, dibuja: g => el("circle", { cx: q[0], cy: q[1], r: 3.6, fill: "#111" }, g) });
        }
    }
    esc3.dibujar(svg);
    // Etiquetas de los átomos (fuera de la bola)
    for (const a of mol.atomos) {
        if (!a.etiqueta) continue;
        const q = esc3.p(a.p);
        const dx = a.dxEtq ?? 0, dy = a.dyEtq ?? 0;
        const r = (a.r ?? RADIO[a.s] ?? 0.3) * esc3.escala;
        const ang = a.angEtq ?? 45;
        const tx = q[0] + (r + 12) * Math.cos(ang * Math.PI / 180) + dx, ty = q[1] - (r + 10) * Math.sin(ang * Math.PI / 180) + dy + 6;
        texto(svg, tx, ty, typeof a.etiqueta === "string" ? a.etiqueta : a.s, { "text-anchor": "middle", "font-size": 18, fill: COLORES.texto });
    }
    // Ángulos de enlace: arco con dos puntas y rótulo
    for (const an of mol.angulos ?? []) {
        const c = P[an.c], u = norm(resta(P[an.a], c)), v = norm(resta(P[an.b], c));
        const rho = an.radio ?? 0.55;
        const th = Math.acos(Math.max(-1, Math.min(1, punto(u, v))));
        // base ortonormal en el plano (u, v); si son opuestos se usa "arriba"
        let w = resta(v, esc(u, punto(u, v)));
        if (longitud(w) < 1e-6) w = an.plano ?? [0, 0, 1];
        w = norm(w);
        const pts = [];
        for (let k = 0; k <= 40; k++) {
            const t = th * (0.08 + 0.84 * k / 40);
            pts.push(esc3.p(suma(c, suma(esc(u, rho * Math.cos(t)), esc(w, rho * Math.sin(t))))));
        }
        el("path", { d: "M" + pts.map(q => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" L"), fill: "none",
            stroke: "#222", "stroke-width": 1.5, "marker-start": puntaFlecha(svg, "pang", "#222", 9),
            "marker-end": puntaFlecha(svg, "pang", "#222", 9) }, svg);
        const qm = esc3.p(suma(c, suma(esc(u, (rho + 0.2) * Math.cos(th / 2)), esc(w, (rho + 0.2) * Math.sin(th / 2)))));
        texto(svg, qm[0] + (an.dx ?? 0), qm[1] + 6 + (an.dy ?? 0), an.texto, { "text-anchor": "middle", "font-size": 17, fill: COLORES.texto });
    }
    return esc3;
}

/**
 * Esquema de alambre de la geometría (poliedro con A en el centro y B en los vértices;
 * X para los pares libres). Lo dibuja dentro de un recuadro en (x, y) de tamaño w×h.
 */
function esquemaGeometria(svg, x, y, w, h, vertices, op = {}) {
    el("path", { d: `M${x},${y} L${x},${y + h} L${x + w},${y + h}`, fill: "none", stroke: "#444", "stroke-width": 1.2 }, svg);
    const esc3 = new Escena3D({ cx: x + w / 2 + (op.dx ?? 0), cy: y + h / 2 + (op.dy ?? 0), escala: op.escala ?? Math.min(w, h) * 0.36, camara: op.camara });
    const letras = [];
    // aristas entre vértices B (distancia mínima)
    const B = vertices.filter(v => v.t !== "X");
    let dmin = Infinity;
    for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) dmin = Math.min(dmin, longitud(resta(B[i].p, B[j].p)));
    if (op.poliedro !== false && B.length > 2) {
        for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
            if (longitud(resta(B[i].p, B[j].p)) < dmin * 1.25) esc3.segmento(B[i].p, B[j].p, { color: "#555", ancho: 1, trozos: 6 });
        }
    }
    for (const v of vertices) {
        esc3.segmento([0, 0, 0], v.p, { color: "#222", ancho: 1.3, trozos: 6, trazo: v.t === "X" ? "3 2" : null });
        const q = esc3.p(esc(v.p, 1.18));
        letras.push([q, v.t]);
    }
    esc3.dibujar(svg);
    const q0 = esc3.p([0, 0, 0]);
    el("circle", { cx: q0[0], cy: q0[1], r: 9, fill: "#fff" }, svg);
    texto(svg, q0[0], q0[1] + 5, "A", { "text-anchor": "middle", "font-size": 14, fill: COLORES.texto });
    for (const [q, t] of letras) {
        texto(svg, q[0], q[1] + 5, t, { "text-anchor": "middle", "font-size": 14, fill: t === "X" ? COLORES.ocre : COLORES.texto });
    }
    if (op.angulo) texto(svg, x + w - 6, y + 16, op.angulo, { "text-anchor": "end", "font-size": 13, fill: COLORES.gris });
}

// Direcciones de las geometrías ideales (bond length 1)
const GEOM = {
    lineal: [[0, -1, 0], [0, 1, 0]],
    // plano vertical yz (de cara a la cámara por defecto de las figuras planas): arriba, abajo-dcha, abajo-izda
    trigonal: [0, 120, 240].map(a => [0, Math.sin(a * Math.PI / 180), Math.cos(a * Math.PI / 180)]),
    tetraedrica: [[0, 0, 1], ...[0, 120, 240].map(a => {
        const t = 109.47 * Math.PI / 180, f = a * Math.PI / 180;
        return [Math.sin(t) * Math.cos(f), Math.sin(t) * Math.sin(f), Math.cos(t)];
    })],
    bipiramide: [[0, 0, 1], [0, 0, -1], ...[0, 120, 240].map(a => [Math.cos(a * Math.PI / 180), Math.sin(a * Math.PI / 180), 0])],
    octaedrica: [[0, 0, 1], [0, 0, -1], [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0]],
};

/** Direcciones en un plano vertical (y,z) para moléculas angulares con ángulo dado, simétricas respecto a -z. */
function angular(grados) {
    const h = grados / 2 * Math.PI / 180;
    return [[0, -Math.sin(h), -Math.cos(h)], [0, Math.sin(h), -Math.cos(h)]];
}
/** Pirámide trigonal con ángulo de enlace dado (vértice hacia arriba = par libre). */
function piramide(grados) {
    const g = grados * Math.PI / 180;
    // ángulo con el eje -z tal que el ángulo entre enlaces sea g
    const s = Math.sqrt((2 / 3) * (1 - Math.cos(g)));
    const t = Math.asin(Math.min(1, s));
    return [0, 120, 240].map(a => [Math.sin(t) * Math.cos((a + 30) * Math.PI / 180), Math.sin(t) * Math.sin((a + 30) * Math.PI / 180), -Math.cos(t)]);
}

/** Molécula AB_n: átomo central en el origen y ligandos a distancia L en las direcciones dadas. */
function molAB(central, ligando, dirs, L = 1, op = {}) {
    const atomos = [{ s: central, p: [0, 0, 0], etiquetaDentro: op.letraCentral ?? true }];
    dirs.forEach((d, i) => atomos.push({ s: ligando, p: esc(norm(d), L), etiqueta: true, angEtq: op.angEtq?.[i] ?? 45 }));
    return { atomos, enlaces: dirs.map((_, i) => [0, i + 1]), pares: [], angulos: [] };
}

/** Gira una lista de direcciones alrededor del eje z. */
function rotarZ(dirs, grados) {
    const t = grados * Math.PI / 180, c = Math.cos(t), si = Math.sin(t);
    return dirs.map(([x, y, z]) => [x * c - y * si, x * si + y * c, z]);
}
