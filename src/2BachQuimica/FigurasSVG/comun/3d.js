// Motor 3D mínimo para dibujar en SVG (requiere svg.js).
// Proyección ortográfica + "algoritmo del pintor" (se dibuja de atrás hacia delante)
// + sombreado de Lambert. Sirve para orbitales, geometrías moleculares, etc.
//
// Ejes del mundo: z hacia arriba; con la cámara por defecto el eje x sale hacia
// abajo-derecha (hacia el lector) y el eje y hacia arriba-derecha (hacia el fondo).

class Escena3D {
    /**
     * @param {object} op
     *   cx, cy     centro en la figura (px)
     *   escala     px por unidad
     *   camara     vector desde el origen hacia el observador
     *   luz        vector hacia la luz (coordenadas del mundo); por defecto arriba-izquierda-delante
     */
    constructor(op = {}) {
        this.cx = op.cx ?? 0;
        this.cy = op.cy ?? 0;
        this.escala = op.escala ?? 100;
        const f = norm(op.camara ?? [1, -1, 0.6]);
        const r = norm([-f[1], f[0], 0]);
        const u = cruz(f, r);
        this.f = f; this.r = r; this.u = u;
        this.luz = norm(op.luz ?? suma(suma(esc(f, 0.75), esc(u, 0.65)), esc(r, -0.45)));
        this.prims = [];     // {z, dibuja(g)}
        this.encima = [];    // textos, siempre delante
    }

    /** Proyecta un punto del mundo -> [x, y, profundidad] (profundidad mayor = más cerca). */
    p(v) {
        return [this.cx + this.escala * punto(v, this.r),
                this.cy - this.escala * punto(v, this.u),
                punto(v, this.f)];
    }

    /** Color sombreado según la normal n (mundo). */
    sombrear(color, n, brillo = 0.35) {
        const d = Math.max(0, punto(n, this.luz));
        const h = norm(suma(this.luz, this.f));
        const s = Math.pow(Math.max(0, punto(n, h)), 30) * brillo;
        let c = mezclar(mezclar(color, "#000000", 0.55), color, 0.35 + 0.65 * d);
        return mezclar(c, "#ffffff", Math.min(1, s + 0.12 * d));
    }

    /**
     * Superficie en coordenadas polares r(θ,φ) = |fn(x,y,z)|^potencia sobre la esfera unidad.
     * El signo de fn decide el color (fase del orbital).
     */
    superficiePolar(fn, op = {}) {
        const nT = op.resT ?? 48, nP = op.resP ?? 96, pot = op.potencia ?? 2;
        const tam = op.tam ?? 1, o = op.origen ?? [0, 0, 0];
        const colPos = op.colorPos ?? "#E8756E", colNeg = op.colorNeg ?? "#6F8FD8";
        // Máximo para normalizar
        let max = 0;
        const val = [];
        for (let i = 0; i <= nT; i++) {
            val.push([]);
            const t = Math.PI * i / nT;
            for (let j = 0; j <= nP; j++) {
                const ph = 2 * Math.PI * j / nP;
                const d = [Math.sin(t) * Math.cos(ph), Math.sin(t) * Math.sin(ph), Math.cos(t)];
                const v = fn(d[0], d[1], d[2]);
                val[i].push([d, v]);
                max = Math.max(max, Math.abs(v));
            }
        }
        const P = (i, j) => {
            const [d, v] = val[i][j];
            const rr = tam * Math.pow(Math.abs(v) / max, pot);
            return suma(o, esc(d, rr));
        };
        for (let i = 0; i < nT; i++) {
            for (let j = 0; j < nP; j++) {
                const a = P(i, j), b = P(i + 1, j), c = P(i + 1, j + 1), d = P(i, j + 1);
                const n = cruz(resta(b, a), resta(d, a));
                const n2 = cruz(resta(c, b), resta(a, b));
                let nn = suma(n, n2);
                if (longitud(nn) < 1e-12) continue;
                nn = norm(nn);
                if (punto(nn, this.f) < -0.05) continue;            // cara trasera
                const signo = val[i][j][1] + val[i + 1][j + 1][1];
                const col = this.sombrear(signo >= 0 ? colPos : colNeg, nn);
                this.cuadrilatero([a, b, c, d], col);
            }
        }
    }

    /**
     * Isosuperficie |fn| = iso (enlaces σ, π, híbridos, orbitales moleculares...).
     * 1) Se muestrea fn en una rejilla gruesa y se localizan los lóbulos (regiones conexas
     *    donde s·fn ≥ iso, con s = ±1).
     * 2) Desde el centro de cada lóbulo se lanzan rayos en una rejilla (θ, φ) y se busca
     *    dónde sale de la región: se obtiene una malla de cuadriláteros ligera.
     * op: min, max (caja), n (rejilla de búsqueda), iso, colorPos, colorNeg (null = no dibujar),
     *     resT, resP (resolución de la malla), opacidad
     */
    isosuperficie(fn, op = {}) {
        const n = op.n ?? 36, iso = op.iso ?? 0.1;
        const mn = op.min ?? [-3, -3, -3], mx = op.max ?? [3, 3, 3];
        const h = [0, 1, 2].map(k => (mx[k] - mn[k]) / n);
        const P = (i, j, k) => [mn[0] + i * h[0], mn[1] + j * h[1], mn[2] + k * h[2]];
        const N1 = n + 1, idx = (i, j, k) => (i * N1 + j) * N1 + k;
        const V = new Float64Array(N1 ** 3);
        for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) for (let k = 0; k <= n; k++) V[idx(i, j, k)] = fn(...P(i, j, k));
        const nT = op.resT ?? 30, nP = op.resP ?? 60;
        const rmax = Math.hypot(mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]);
        const paso = Math.min(...h) / 3;
        for (const s of [1, -1]) {
            const color = s > 0 ? op.colorPos : op.colorNeg;
            if (color === null) continue;
            const col = color ?? (s > 0 ? "#E9785F" : "#5E8FD8");
            // --- lóbulos (componentes conexas) ---
            const marca = new Int32Array(N1 ** 3);
            let etiqueta = 0;
            for (let a = 0; a < V.length; a++) {
                if (marca[a] || s * V[a] < iso) continue;
                etiqueta++;
                const pila = [a]; marca[a] = etiqueta;
                let sw = 0, cen = [0, 0, 0];
                while (pila.length) {
                    const q = pila.pop();
                    const k = q % N1, j = ((q - k) / N1) % N1, i = (q - k - j * N1) / (N1 * N1);
                    const w = s * V[q];
                    const pq = P(i, j, k);
                    cen = suma(cen, esc(pq, w)); sw += w;
                    for (const [di, dj, dk] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) {
                        const i2 = i + di, j2 = j + dj, k2 = k + dk;
                        if (i2 < 0 || j2 < 0 || k2 < 0 || i2 > n || j2 > n || k2 > n) continue;
                        const b = idx(i2, j2, k2);
                        if (!marca[b] && s * V[b] >= iso) { marca[b] = etiqueta; pila.push(b); }
                    }
                }
                cen = esc(cen, 1 / sw);
                // Centros desde los que lanzar rayos: el centroide si está dentro; si no
                // (lóbulos unidos por el núcleo, p. ej. híbridos), los máximos locales.
                let centros = [cen];
                if (s * fn(...cen) < iso) {
                    centros = [];
                    for (let q = 0; q < V.length; q++) {
                        if (marca[q] !== etiqueta) continue;
                        const k = q % N1, j = ((q - k) / N1) % N1, i = (q - k - j * N1) / (N1 * N1);
                        if (!i || !j || !k || i === n || j === n || k === n) continue;
                        const v = s * V[q];
                        let max = true;
                        for (const [di, dj, dk] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) {
                            if (s * V[idx(i + di, j + dj, k + dk)] > v) { max = false; break; }
                        }
                        const pq = P(i, j, k);
                        if (max && !centros.some(c0 => longitud(resta(c0, pq)) < 3 * Math.max(...h))) centros.push(pq);
                    }
                }
                for (const cen of centros) {
                // --- malla por rayos desde el centro ---
                const R = [];
                for (let it = 0; it <= nT; it++) {
                    R.push([]);
                    const t = Math.PI * it / nT;
                    for (let jp = 0; jp <= nP; jp++) {
                        const ph = 2 * Math.PI * jp / nP;
                        const d = [Math.sin(t) * Math.cos(ph), Math.sin(t) * Math.sin(ph), Math.cos(t)];
                        let r = 0;
                        while (r < rmax && s * fn(...suma(cen, esc(d, r + paso))) >= iso) r += paso;
                        // refinamiento por bisección
                        let a1 = r, b1 = r + paso;
                        for (let q = 0; q < 6; q++) { const m = (a1 + b1) / 2; if (s * fn(...suma(cen, esc(d, m))) >= iso) a1 = m; else b1 = m; }
                        R[it].push(suma(cen, esc(d, a1)));
                    }
                }
                const grad = p => {
                    const e = 1e-3;
                    return norm([-(fn(p[0] + e, p[1], p[2]) - fn(p[0] - e, p[1], p[2])) * s,
                        -(fn(p[0], p[1] + e, p[2]) - fn(p[0], p[1] - e, p[2])) * s,
                        -(fn(p[0], p[1], p[2] + e) - fn(p[0], p[1], p[2] - e)) * s]);
                };
                for (let it = 0; it < nT; it++) for (let jp = 0; jp < nP; jp++) {
                    const q4 = [R[it][jp], R[it + 1][jp], R[it + 1][jp + 1], R[it][jp + 1]];
                    const c4 = esc(q4.reduce((u, v) => suma(u, v), [0, 0, 0]), 0.25);
                    let nn = grad(c4);
                    if (!op.opacidad && punto(nn, this.f) < -0.08) continue;
                    if (punto(nn, this.f) < 0) nn = esc(nn, -1);
                    this.cuadrilatero(q4, this.sombrear(col, nn, op.brillo), op.opacidad ?? 1);
                }
                }
            }
        }
    }

    triangulo(pts, color, opacidad) {
        const q = pts.map(v => this.p(v));
        const z = (q[0][2] + q[1][2] + q[2][2]) / 3;
        this.prims.push({ z, dibuja: g => el("polygon", {
            points: q.map(v => `${v[0].toFixed(1)},${v[1].toFixed(1)}`).join(" "),
            fill: color, stroke: opacidad ? "none" : color, "stroke-width": 0.6, "stroke-linejoin": "round",
            "fill-opacity": opacidad ?? null }, g) });
    }

    /** Superficie paramétrica genérica: S(u,v) con u,v en [0,1]. */
    superficie(S, op = {}) {
        const nU = op.resU ?? 40, nV = op.resV ?? 80;
        for (let i = 0; i < nU; i++) {
            for (let j = 0; j < nV; j++) {
                const a = S(i / nU, j / nV), b = S((i + 1) / nU, j / nV);
                const c = S((i + 1) / nU, (j + 1) / nV), d = S(i / nU, (j + 1) / nV);
                let nn = suma(cruz(resta(b, a), resta(d, a)), cruz(resta(c, b), resta(a, b)));
                if (longitud(nn) < 1e-12) continue;
                nn = norm(nn);
                if (op.invertir) nn = esc(nn, -1);
                if (!op.dobleCara && punto(nn, this.f) < -0.05) continue;
                if (punto(nn, this.f) < 0) nn = esc(nn, -1);
                const color = typeof op.color === "function" ? op.color(i / nU, j / nV) : (op.color ?? "#9ab");
                this.cuadrilatero([a, b, c, d], this.sombrear(color, nn, op.brillo), op.opacidad);
            }
        }
    }

    cuadrilatero(pts, color, opacidad = 1) {
        const q = pts.map(v => this.p(v));
        const z = q.reduce((s, v) => s + v[2], 0) / q.length;
        this.prims.push({ z, dibuja: g => el("polygon", {
            points: q.map(v => `${v[0].toFixed(1)},${v[1].toFixed(1)}`).join(" "),
            fill: color, stroke: opacidad < 1 ? "none" : color, "stroke-width": 0.5,
            "stroke-linejoin": "round", "fill-opacity": opacidad < 1 ? opacidad : null }, g) });
    }

    /** Plano semitransparente dado por un centro y dos vectores (mitades de lado), en teselas. */
    plano(c, e1, e2, op = {}) {
        const n = op.teselas ?? 8, col = op.color ?? "#9FD3EA", borde = op.borde ?? "#2AA0D0";
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
            const P = (a, b) => suma(c, suma(esc(e1, -1 + 2 * a / n), esc(e2, -1 + 2 * b / n)));
            this.cuadrilatero([P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)], col, op.opacidad ?? 0.28);
        }
        const esq = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => suma(c, suma(esc(e1, a), esc(e2, b))));
        for (let k = 0; k < 4; k++) this.segmento(esq[k], esq[(k + 1) % 4], { color: borde, ancho: 1.3 });
    }

    /** Segmento troceado para que se ordene bien en profundidad. */
    segmento(a, b, op = {}) {
        const n = op.trozos ?? 24;
        for (let k = 0; k < n; k++) {
            const p1 = this.p(suma(a, esc(resta(b, a), k / n)));
            const p2 = this.p(suma(a, esc(resta(b, a), (k + 1) / n)));
            this.prims.push({ z: (p1[2] + p2[2]) / 2 + (op.sesgo ?? 0), dibuja: g => el("line", {
                x1: p1[0].toFixed(1), y1: p1[1].toFixed(1), x2: p2[0].toFixed(1), y2: p2[1].toFixed(1),
                stroke: op.color ?? "#222", "stroke-width": op.ancho ?? 1.2, "stroke-linecap": "round",
                "stroke-dasharray": op.trazo ?? null }, g) });
        }
    }

    /** Ejes x, y, z con etiqueta (en cursiva). */
    ejes(L = 1.4, op = {}) {
        const col = op.color ?? "#222";
        const ejes = op.ejes ?? { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] };
        for (const [nom, v] of Object.entries(ejes)) {
            this.segmento(esc(v, -L * (op.negativo ?? 0.85)), esc(v, L), { color: col, ancho: op.ancho ?? 1.2 });
            const q = this.p(esc(v, L + 0.14));
            this.encima.push(g => texto(g, q[0], q[1] + 5, nom, { "text-anchor": "middle", "font-size": op.tamLetra ?? 15,
                "font-style": "italic", "font-family": "Times New Roman, serif", fill: col }));
        }
    }

    /** Bola (átomo) con degradado esférico. */
    bola(c, radio, color, svgRaiz, op = {}) {
        const q = this.p(c);
        const id = "bola_" + color.replace("#", "");
        const relleno = degradadoEsfera(svgRaiz, id, color);
        this.prims.push({ z: q[2] + (op.sesgo ?? 0), dibuja: g => {
            el("circle", { cx: q[0].toFixed(1), cy: q[1].toFixed(1), r: radio * this.escala,
                fill: relleno, stroke: mezclar(color, "#000000", 0.35), "stroke-width": 0.8 }, g);
            if (op.etiqueta) texto(g, q[0], q[1] + (op.tamLetra ?? 16) * 0.35, op.etiqueta, {
                "text-anchor": "middle", "font-size": op.tamLetra ?? 16, "font-weight": "bold",
                fill: op.colorLetra ?? "#ffffff" });
        } });
    }

    /** Texto anclado a un punto 3D, siempre por encima. */
    etiqueta(v, txt, attrs = {}) {
        const q = this.p(v);
        this.encima.push(g => texto(g, q[0], q[1], txt, { "text-anchor": "middle", ...attrs }));
    }

    dibujar(padre) {
        const g = el("g", {}, padre);
        this.prims.sort((a, b) => a.z - b.z).forEach(pr => pr.dibuja(g));
        this.encima.forEach(f => f(g));
        return g;
    }
}

// --- Álgebra vectorial -----------------------------------------------------
function punto(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function cruz(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function suma(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function resta(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function esc(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
function longitud(a) { return Math.hypot(a[0], a[1], a[2]); }
function norm(a) { const l = longitud(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }

// --- Parte angular (real) de los orbitales atómicos ---------------------------
const ORBITALES = {
    s: () => 1,
    px: (x, y, z) => x, py: (x, y, z) => y, pz: (x, y, z) => z,
    dxy: (x, y, z) => x * y, dxz: (x, y, z) => x * z, dyz: (x, y, z) => y * z,
    "dx2-y2": (x, y, z) => x * x - y * y, dz2: (x, y, z) => 3 * z * z - 1,
    fz3: (x, y, z) => z * (5 * z * z - 3),
    fxz2: (x, y, z) => x * (5 * z * z - 1),
    fyz2: (x, y, z) => y * (5 * z * z - 1),
    fxyz: (x, y, z) => x * y * z,
    "fz(x2-y2)": (x, y, z) => z * (x * x - y * y),
    "fx(x2-3y2)": (x, y, z) => x * (x * x - 3 * y * y),
    "fy(3x2-y2)": (x, y, z) => y * (3 * x * x - y * y),
};

/** Generador pseudoaleatorio reproducible (para nubes de puntos). */
function aleatorio(semilla = 1) {
    let s = semilla >>> 0;
    return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
