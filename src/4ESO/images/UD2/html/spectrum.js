// Utilidades para dibujar espectros visibles (380–750 nm)
const WL_MIN = 380, WL_MAX = 750;
const H_LINES = [410.2, 434.0, 486.1, 656.3];   // serie de Balmer del hidrógeno

function wl2rgb(wl) {
    let r = 0, g = 0, b = 0;
    if (wl < 440) { r = -(wl - 440) / 60; b = 1; }
    else if (wl < 490) { g = (wl - 440) / 50; b = 1; }
    else if (wl < 510) { g = 1; b = -(wl - 510) / 20; }
    else if (wl < 580) { r = (wl - 510) / 70; g = 1; }
    else if (wl < 645) { r = 1; g = -(wl - 645) / 65; }
    else r = 1;
    let f = 1;
    if (wl < 420) f = 0.3 + 0.7 * (wl - 380) / 40;
    else if (wl > 700) f = 0.3 + 0.7 * (750 - wl) / 50;
    const c = v => Math.round(255 * Math.pow(v * f, 0.8));
    return `rgb(${c(r)},${c(g)},${c(b)})`;
}

function wlX(wl, x0, w) { return x0 + (wl - WL_MIN) / (WL_MAX - WL_MIN) * w; }

// Gradiente arco iris (se añade una vez a <defs>)
function rainbowGradient(add, id) {
    let stops = '';
    for (let wl = WL_MIN; wl <= WL_MAX; wl += 10) stops += `<stop offset="${(wl - WL_MIN) / (WL_MAX - WL_MIN)}" stop-color="${wl2rgb(wl)}"/>`;
    add('defs', {}).innerHTML = `<linearGradient id="${id}" x1="0" x2="1">${stops}</linearGradient>`;
}

// type: 'continuo' | 'emision' | 'absorcion'
function spectrumBar(add, x0, y0, w, h, type, lines = H_LINES, gradId = 'rb') {
    add('rect', { x: x0, y: y0, width: w, height: h, fill: type === 'emision' ? '#111' : `url(#${gradId})` });
    if (type === 'continuo') return;
    lines.forEach(wl => add('rect', { x: wlX(wl, x0, w) - 2.5, y: y0, width: 5, height: h, fill: type === 'emision' ? wl2rgb(wl) : '#111' }));
}
