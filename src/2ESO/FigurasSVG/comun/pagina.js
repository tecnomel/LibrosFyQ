// Prepara la figura para imprimirla a PDF vectorial (lo usa exportar.mjs):
//  - imprime fondos y colores tal cual (sin esto Chrome quita los fondos al imprimir)
//  - tamaño de página = tamaño de la figura, en una sola página
// El margen blanco sobrante lo recorta después recortar.py.
(function () {
    const color = document.createElement("style");
    color.textContent = "*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}";
    document.head.appendChild(color);

    function tamPagina() {
        // Caja que ocupa TODO lo dibujado (hay figuras que desbordan el body, que tiene overflow:hidden)
        const d = document.documentElement, b = document.body;
        let w = Math.max(d.scrollWidth, b.scrollWidth, b.offsetWidth);
        let h = Math.max(d.scrollHeight, b.scrollHeight, b.offsetHeight);
        for (const e of b.querySelectorAll("*")) {
            const r = e.getBoundingClientRect();
            if (r.width === 0 && r.height === 0) continue;
            w = Math.max(w, r.right + window.scrollX);
            h = Math.max(h, r.bottom + window.scrollY);
        }
        w = Math.ceil(w) + 4;
        h = Math.ceil(h) + 4;
        const pag = document.createElement("style");
        pag.textContent = `@page{size:${w}px ${h}px;margin:0}html,body{overflow:visible!important}`;
        document.head.appendChild(pag);
    }
    if (document.readyState === "complete") tamPagina();
    else window.addEventListener("load", tamPagina);
})();
