// Exporta cada figura HTML (Unit_x/fuentes/*.html) a:
//   pdf/<nombre>.pdf  -> PDF vectorial para \includegraphics en LaTeX (recortado con recortar.py)
//   svg/<nombre>.svg  -> SVG obtenido del PDF (pdftocairo)
//
// Uso (desde esta carpeta):
//   node exportar.mjs                                   -> todas las unidades
//   node exportar.mjs Unit_2_State_of_Matter            -> solo una unidad
//   node exportar.mjs Unit_2_State_of_Matter boyle      -> solo figuras cuyo nombre empiece por "boyle"
//
// Necesita: Chrome/Edge, Python con PyMuPDF (recorte) y pdftocairo (viene con MiKTeX/TeX Live).

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { existsSync, mkdirSync, readdirSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tmpdir } from "node:os";

const ejecutar = promisify(execFile);
const RAIZ = dirname(fileURLToPath(import.meta.url));
const EN_PARALELO = Number(process.env.EN_PARALELO) || 6;

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
const PYTHON = process.env.PYTHON || "python";
const PDFTOCAIRO = process.env.PDFTOCAIRO || "pdftocairo";

const [filtroUnidad, filtroFigura] = process.argv.slice(2);

const unidades = readdirSync(RAIZ, { withFileTypes: true })
    .filter(d => d.isDirectory() && existsSync(join(RAIZ, d.name, "fuentes")))
    .map(d => d.name)
    .filter(n => !filtroUnidad || n === filtroUnidad);

const tareas = [];
for (const unidad of unidades) {
    const dirFuentes = join(RAIZ, unidad, "fuentes");
    mkdirSync(join(RAIZ, unidad, "svg"), { recursive: true });
    mkdirSync(join(RAIZ, unidad, "pdf"), { recursive: true });
    for (const html of readdirSync(dirFuentes).filter(f => f.endsWith(".html"))) {
        // filtro "*_es": figuras cuyo nombre (sin .html) termina en "_es"
        const nombre = html.slice(0, -5);
        if (filtroFigura && (filtroFigura.startsWith("*") ? !nombre.endsWith(filtroFigura.slice(1)) : !html.startsWith(filtroFigura))) continue;
        tareas.push({ unidad, nombre: basename(html, ".html"), url: pathToFileURL(join(dirFuentes, html)).href });
    }
}

async function exportar({ unidad, nombre, url }) {
    // Un perfil de Chrome por figura para poder lanzar varias a la vez
    const perfil = mkdtempSync(join(tmpdir(), "figuras-chrome-"));
    const pdf = join(RAIZ, unidad, "pdf", `${nombre}.pdf`);
    const svg = join(RAIZ, unidad, "svg", `${nombre}.svg`);
    try {
        await ejecutar(NAVEGADOR, [
            "--headless=new", "--disable-gpu", "--no-first-run", "--hide-scrollbars",
            "--allow-file-access-from-files", `--user-data-dir=${perfil}`,
            "--virtual-time-budget=2000", "--no-pdf-header-footer",
            `--print-to-pdf=${pdf}`, url,
        ]);
        await ejecutar(PYTHON, [join(RAIZ, "recortar.py"), pdf]);
        await ejecutar(PDFTOCAIRO, ["-svg", pdf, svg]);
        console.log(`  ✓ ${unidad}/${nombre}  ->  pdf + svg`);
        return true;
    } catch (e) {
        console.error(`  ✗ ${unidad}/${nombre}: ${(e.stderr || e.message).toString().trim()}`);
        return false;
    } finally {
        rmSync(perfil, { recursive: true, force: true });
    }
}

let total = 0;
for (let i = 0; i < tareas.length; i += EN_PARALELO) {
    const res = await Promise.all(tareas.slice(i, i + EN_PARALELO).map(exportar));
    total += res.filter(Boolean).length;
}
console.log(`\n${total} de ${tareas.length} figura(s) exportadas.`);
