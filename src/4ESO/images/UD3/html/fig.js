// Utilidades comunes de las figuras de la Unidad 3.
// 1) Ajusta el tamaño de página de impresión al contenido (.canvas) para que
//    Chrome genere un PDF vectorial sin márgenes, que luego se pasa a SVG.
// 2) Pequeño ayudante para crear elementos SVG desde JavaScript.
const NS = 'http://www.w3.org/2000/svg';

function svgAdder(id) {
    const s = typeof id === 'string' ? document.getElementById(id) : id;
    return (tag, attrs, text) => {
        const e = document.createElementNS(NS, tag);
        for (const k in attrs) e.setAttribute(k, attrs[k]);
        if (text !== undefined) e.textContent = text;
        s.appendChild(e);
        return e;
    };
}

// Partículas subatómicas dibujadas como bolitas con signo
function particle(add, x, y, type, r = 9) {
    const fill = { p: '#C0392B', n: '#95A5A6', e: '#2471A3' }[type];
    add('circle', { cx: x, cy: y, r, fill, stroke: '#fff', 'stroke-width': 1.2 });
    const sign = { p: '+', n: '', e: '−' }[type];
    if (sign) add('text', { x, y: y + r * 0.5, 'text-anchor': 'middle', 'font-size': r * 1.5, 'font-weight': 800, fill: '#fff' }, sign);
}

// Núcleo compacto con Z protones y N neutrones
function nucleus(add, cx, cy, Z, N, r = 7) {
    const tot = Z + N;
    const types = [];
    for (let i = 0; i < tot; i++) types.push(i % 2 === 0 && types.filter(t => t === 'p').length < Z ? 'p' : (types.filter(t => t === 'n').length < N ? 'n' : 'p'));
    for (let i = 0; i < tot; i++) {
        const a = i * 2.4, d = r * 1.08 * Math.sqrt(i);
        particle(add, cx + d * Math.cos(a), cy + d * Math.sin(a), types[i], r);
    }
}

window.addEventListener('load', () => {
    const c = document.querySelector('.canvas');
    if (!c) return;
    const r = c.getBoundingClientRect();
    const w = Math.ceil(r.width) + 2, h = Math.ceil(r.height) + 2;
    const st = document.createElement('style');
    st.textContent = `@page { size: ${w}px ${h}px; margin: 0; } html, body { width: ${w}px; height: ${h}px; overflow: hidden; }`;
    document.head.appendChild(st);
});
