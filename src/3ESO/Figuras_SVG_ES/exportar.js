/* =====================================================================
   exportar.js — Genera svg/*.svg y pdf/*.pdf a partir de fuentes/*.html

   Uso (desde esta carpeta):
       node exportar.js                 -> todas las figuras
       node exportar.js U8_conservacion  -> solo las que contengan ese texto

   Requisitos: Node.js y Google Chrome (o Edge) instalados. No necesita
   paquetes npm. pdflatex no admite SVG directamente (el paquete `svg`
   necesita Inkscape), por eso se incluye en LaTeX el PDF vectorial
   generado a partir de cada SVG.
   ===================================================================== */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const RAIZ = __dirname;
const DIR_FUENTES = path.join(RAIZ, 'fuentes');
const DIR_SVG = path.join(RAIZ, 'svg');
const DIR_PDF = path.join(RAIZ, 'pdf');

const NAVEGADORES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];
const NAVEGADOR = NAVEGADORES.find(p => fs.existsSync(p));
if (!NAVEGADOR) throw new Error('No se encontró Chrome/Edge.');

const aURL = p => 'file:///' + p.replace(/\\/g, '/').split('/').map(encodeURIComponent).join('/').replace(/^file:\/\/\/([A-Za-z])%3A/, 'file:///$1:');

function chrome(args) {
  const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'figsvg-'));
  try {
    return execFileSync(NAVEGADOR, [
      '--headless=new', '--disable-gpu', '--no-first-run',
      '--allow-file-access-from-files', `--user-data-dir=${perfil}`, ...args,
    ], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
  } finally {
    fs.rmSync(perfil, { recursive: true, force: true });
  }
}

/* 1) Ejecuta el HTML y recupera el SVG que el propio JS deja en data-svg */
function extraerSVG(html) {
  const dom = chrome(['--virtual-time-budget=5000', '--dump-dom', aURL(html)]);
  const errores = dom.match(/data-errores="([^"]*)"/);
  if (errores) console.warn('AVISO ' + path.basename(html) + ': ' + errores[1]);
  const m = dom.match(/data-svg="([^"]+)"/);
  if (!m) throw new Error('El HTML no generó data-svg: ' + html);
  return Buffer.from(m[1], 'base64').toString('utf8');
}

/* 2) Convierte el SVG en PDF vectorial del mismo tamaño */
function svgAPDF(svg, destino) {
  const w = parseFloat(svg.match(/width="([\d.]+)"/)[1]);
  const h = parseFloat(svg.match(/height="([\d.]+)"/)[1]);
  const tmp = path.join(os.tmpdir(), `figsvg_${Date.now()}.html`);
  fs.writeFileSync(tmp, `<!doctype html><meta charset="utf-8"><style>
    @page { size: ${w}px ${h}px; margin: 0 }
    html, body { margin: 0; padding: 0; overflow: hidden }
    svg { display: block }</style>${svg}`);
  try {
    chrome(['--no-pdf-header-footer', '--print-to-pdf-no-header',
      `--print-to-pdf=${destino}`, aURL(tmp)]);
  } finally {
    fs.rmSync(tmp, { force: true });
  }
}

const filtro = process.argv[2] || '';
const fuentes = fs.readdirSync(DIR_FUENTES)
  .filter(f => f.endsWith('.html') && f.includes(filtro)).sort();

for (const f of fuentes) {
  const nombre = path.basename(f, '.html');
  const svg = extraerSVG(path.join(DIR_FUENTES, f));
  fs.writeFileSync(path.join(DIR_SVG, nombre + '.svg'),
    '<?xml version="1.0" encoding="UTF-8"?>\n' + svg);
  svgAPDF(svg, path.join(DIR_PDF, nombre + '.pdf'));
  console.log('OK  ' + nombre);
}
