// Exporta cada figura HTML (fuentes/*.html) a:
//   svg/<nombre>.svg  -> SVG limpio (tras ejecutar el JavaScript)
//   pdf/<nombre>.pdf  -> PDF vectorial para \includegraphics en LaTeX
//
// Uso (desde esta carpeta):
//   node exportar.mjs                      -> todas las unidades
//   node exportar.mjs UD2_Tabla_Periodica  -> solo una unidad
//   node exportar.mjs UD2_Tabla_Periodica UD2_03  -> solo figuras cuyo nombre empiece por UD2_03
//
// No necesita dependencias: usa Chrome/Edge en modo headless.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tmpdir } from "node:os";

const RAIZ = dirname(fileURLToPath(import.meta.url));

const NAVEGADORES = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];
const NAVEGADOR = process.env.CHROME || NAVEGADORES.find(existsSync);
if (!NAVEGADOR) {
    console.error("No se encuentra Chrome/Edge. Define la variable CHROME con su ruta.");
    process.exit(1);
}

const [filtroUnidad, filtroFigura] = process.argv.slice(2);
const perfil = mkdtempSync(join(tmpdir(), "figuras-chrome-"));
const base = [
    "--headless=new", "--disable-gpu", "--no-first-run", "--hide-scrollbars",
    "--allow-file-access-from-files", `--user-data-dir=${perfil}`,
];

function chrome(args) {
    return execFileSync(NAVEGADOR, [...base, ...args], {
        encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"],
    });
}

const unidades = readdirSync(RAIZ, { withFileTypes: true })
    .filter(d => d.isDirectory() && existsSync(join(RAIZ, d.name, "fuentes")))
    .map(d => d.name)
    .filter(n => !filtroUnidad || n === filtroUnidad);

let total = 0;
try {
    for (const unidad of unidades) {
        const dirFuentes = join(RAIZ, unidad, "fuentes");
        const dirSvg = join(RAIZ, unidad, "svg");
        const dirPdf = join(RAIZ, unidad, "pdf");
        mkdirSync(dirSvg, { recursive: true });
        mkdirSync(dirPdf, { recursive: true });

        const htmls = readdirSync(dirFuentes)
            .filter(f => f.endsWith(".html"))
            .filter(f => !filtroFigura || f.startsWith(filtroFigura));

        for (const html of htmls) {
            const nombre = basename(html, ".html");
            const url = pathToFileURL(join(dirFuentes, html)).href;

            // 1) SVG: DOM tras ejecutar el JS
            const dom = chrome(["--dump-dom", url]);
            const err = dom.match(/ERROR_FIGURA:[^<]*/g);
            if (err) console.error(`  ! ${unidad}/${html}: ${err.join(" | ")}`);
            const m = dom.match(/<svg[^>]*id="figura"[\s\S]*<\/svg>/);
            if (!m) {
                console.error(`  ✗ ${unidad}/${html}: no se encontró <svg id="figura">`);
                continue;
            }
            let svg = m[0].replace(/&nbsp;/g, "&#160;");
            if (!/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/.test(svg.slice(0, 300))) {
                svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
            }
            // Fuente embebida como estilo para que el SVG suelto se vea igual
            svg = svg.replace(/(<svg[^>]*>)/,
                `$1<style>text{font-family:"Century Gothic","URW Gothic","Avant Garde",Arial,sans-serif}</style>`);
            writeFileSync(join(dirSvg, `${nombre}.svg`),
                `<?xml version="1.0" encoding="UTF-8"?>\n${svg}\n`, "utf8");

            // 2) PDF vectorial (tamaño de página = tamaño de la figura, ver crearFigura())
            chrome([`--print-to-pdf=${join(dirPdf, `${nombre}.pdf`)}`,
                "--no-pdf-header-footer", "--print-to-pdf-no-header", url]);

            console.log(`  ✓ ${unidad}/${nombre}  ->  svg + pdf`);
            total++;
        }
    }
} finally {
    rmSync(perfil, { recursive: true, force: true });
}
console.log(`\n${total} figura(s) exportadas.`);
