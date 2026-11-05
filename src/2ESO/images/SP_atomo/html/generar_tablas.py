# -*- coding: utf-8 -*-
"""Genera las tablas periódicas en HTML (inglés y español) y las exporta a PDF.

Uso:  python generar_tablas.py
Crea  TP_EN.html / TP_ES.html en esta carpeta y 2_3_ESO_TP_EN_html.pdf /
2_3_ESO_TP_ES_html.pdf en la carpeta superior (images/SP_atomo).
También crea la tabla de valencias: TP_Valencias_EN/ES.html y
TP_Valencias_EN_html.pdf / TP_Valencias_ES_html.pdf en src/images.
"""
import os
import subprocess

# Z, símbolo, nombre EN, nombre ES, masa, categoría, periodo, grupo
# (lantánidos y actínidos: periodo 9 y 10 para colocarlos en las filas inferiores)
E = [
    (1, "H", "Hydrogen", "Hidrógeno", "1.008", "nm", 1, 1),
    (2, "He", "Helium", "Helio", "4.003", "ng", 1, 18),
    (3, "Li", "Lithium", "Litio", "6.94", "al", 2, 1),
    (4, "Be", "Beryllium", "Berilio", "9.012", "ae", 2, 2),
    (5, "B", "Boron", "Boro", "10.81", "md", 2, 13),
    (6, "C", "Carbon", "Carbono", "12.01", "nm", 2, 14),
    (7, "N", "Nitrogen", "Nitrógeno", "14.01", "nm", 2, 15),
    (8, "O", "Oxygen", "Oxígeno", "16.00", "nm", 2, 16),
    (9, "F", "Fluorine", "Flúor", "19.00", "ha", 2, 17),
    (10, "Ne", "Neon", "Neón", "20.18", "ng", 2, 18),
    (11, "Na", "Sodium", "Sodio", "22.99", "al", 3, 1),
    (12, "Mg", "Magnesium", "Magnesio", "24.31", "ae", 3, 2),
    (13, "Al", "Aluminium", "Aluminio", "26.98", "pt", 3, 13),
    (14, "Si", "Silicon", "Silicio", "28.09", "md", 3, 14),
    (15, "P", "Phosphorus", "Fósforo", "30.97", "nm", 3, 15),
    (16, "S", "Sulfur", "Azufre", "32.06", "nm", 3, 16),
    (17, "Cl", "Chlorine", "Cloro", "35.45", "ha", 3, 17),
    (18, "Ar", "Argon", "Argón", "39.95", "ng", 3, 18),
    (19, "K", "Potassium", "Potasio", "39.10", "al", 4, 1),
    (20, "Ca", "Calcium", "Calcio", "40.08", "ae", 4, 2),
    (21, "Sc", "Scandium", "Escandio", "44.96", "tm", 4, 3),
    (22, "Ti", "Titanium", "Titanio", "47.87", "tm", 4, 4),
    (23, "V", "Vanadium", "Vanadio", "50.94", "tm", 4, 5),
    (24, "Cr", "Chromium", "Cromo", "52.00", "tm", 4, 6),
    (25, "Mn", "Manganese", "Manganeso", "54.94", "tm", 4, 7),
    (26, "Fe", "Iron", "Hierro", "55.85", "tm", 4, 8),
    (27, "Co", "Cobalt", "Cobalto", "58.93", "tm", 4, 9),
    (28, "Ni", "Nickel", "Níquel", "58.69", "tm", 4, 10),
    (29, "Cu", "Copper", "Cobre", "63.55", "tm", 4, 11),
    (30, "Zn", "Zinc", "Cinc", "65.38", "tm", 4, 12),
    (31, "Ga", "Gallium", "Galio", "69.72", "pt", 4, 13),
    (32, "Ge", "Germanium", "Germanio", "72.63", "md", 4, 14),
    (33, "As", "Arsenic", "Arsénico", "74.92", "md", 4, 15),
    (34, "Se", "Selenium", "Selenio", "78.97", "nm", 4, 16),
    (35, "Br", "Bromine", "Bromo", "79.90", "ha", 4, 17),
    (36, "Kr", "Krypton", "Kriptón", "83.80", "ng", 4, 18),
    (37, "Rb", "Rubidium", "Rubidio", "85.47", "al", 5, 1),
    (38, "Sr", "Strontium", "Estroncio", "87.62", "ae", 5, 2),
    (39, "Y", "Yttrium", "Itrio", "88.91", "tm", 5, 3),
    (40, "Zr", "Zirconium", "Circonio", "91.22", "tm", 5, 4),
    (41, "Nb", "Niobium", "Niobio", "92.91", "tm", 5, 5),
    (42, "Mo", "Molybdenum", "Molibdeno", "95.95", "tm", 5, 6),
    (43, "Tc", "Technetium", "Tecnecio", "[98]", "tm", 5, 7),
    (44, "Ru", "Ruthenium", "Rutenio", "101.07", "tm", 5, 8),
    (45, "Rh", "Rhodium", "Rodio", "102.91", "tm", 5, 9),
    (46, "Pd", "Palladium", "Paladio", "106.42", "tm", 5, 10),
    (47, "Ag", "Silver", "Plata", "107.87", "tm", 5, 11),
    (48, "Cd", "Cadmium", "Cadmio", "112.41", "tm", 5, 12),
    (49, "In", "Indium", "Indio", "114.82", "pt", 5, 13),
    (50, "Sn", "Tin", "Estaño", "118.71", "pt", 5, 14),
    (51, "Sb", "Antimony", "Antimonio", "121.76", "md", 5, 15),
    (52, "Te", "Tellurium", "Teluro", "127.60", "md", 5, 16),
    (53, "I", "Iodine", "Yodo", "126.90", "ha", 5, 17),
    (54, "Xe", "Xenon", "Xenón", "131.29", "ng", 5, 18),
    (55, "Cs", "Caesium", "Cesio", "132.91", "al", 6, 1),
    (56, "Ba", "Barium", "Bario", "137.33", "ae", 6, 2),
    (57, "La", "Lanthanum", "Lantano", "138.91", "ln", 9, 3),
    (58, "Ce", "Cerium", "Cerio", "140.12", "ln", 9, 4),
    (59, "Pr", "Praseodymium", "Praseodimio", "140.91", "ln", 9, 5),
    (60, "Nd", "Neodymium", "Neodimio", "144.24", "ln", 9, 6),
    (61, "Pm", "Promethium", "Prometio", "[145]", "ln", 9, 7),
    (62, "Sm", "Samarium", "Samario", "150.36", "ln", 9, 8),
    (63, "Eu", "Europium", "Europio", "151.96", "ln", 9, 9),
    (64, "Gd", "Gadolinium", "Gadolinio", "157.25", "ln", 9, 10),
    (65, "Tb", "Terbium", "Terbio", "158.93", "ln", 9, 11),
    (66, "Dy", "Dysprosium", "Disprosio", "162.50", "ln", 9, 12),
    (67, "Ho", "Holmium", "Holmio", "164.93", "ln", 9, 13),
    (68, "Er", "Erbium", "Erbio", "167.26", "ln", 9, 14),
    (69, "Tm", "Thulium", "Tulio", "168.93", "ln", 9, 15),
    (70, "Yb", "Ytterbium", "Iterbio", "173.05", "ln", 9, 16),
    (71, "Lu", "Lutetium", "Lutecio", "174.97", "ln", 9, 17),
    (72, "Hf", "Hafnium", "Hafnio", "178.49", "tm", 6, 4),
    (73, "Ta", "Tantalum", "Tantalio", "180.95", "tm", 6, 5),
    (74, "W", "Tungsten", "Wolframio", "183.84", "tm", 6, 6),
    (75, "Re", "Rhenium", "Renio", "186.21", "tm", 6, 7),
    (76, "Os", "Osmium", "Osmio", "190.23", "tm", 6, 8),
    (77, "Ir", "Iridium", "Iridio", "192.22", "tm", 6, 9),
    (78, "Pt", "Platinum", "Platino", "195.08", "tm", 6, 10),
    (79, "Au", "Gold", "Oro", "196.97", "tm", 6, 11),
    (80, "Hg", "Mercury", "Mercurio", "200.59", "tm", 6, 12),
    (81, "Tl", "Thallium", "Talio", "204.38", "pt", 6, 13),
    (82, "Pb", "Lead", "Plomo", "207.2", "pt", 6, 14),
    (83, "Bi", "Bismuth", "Bismuto", "208.98", "pt", 6, 15),
    (84, "Po", "Polonium", "Polonio", "[209]", "md", 6, 16),
    (85, "At", "Astatine", "Astato", "[210]", "ha", 6, 17),
    (86, "Rn", "Radon", "Radón", "[222]", "ng", 6, 18),
    (87, "Fr", "Francium", "Francio", "[223]", "al", 7, 1),
    (88, "Ra", "Radium", "Radio", "[226]", "ae", 7, 2),
    (89, "Ac", "Actinium", "Actinio", "[227]", "ac", 10, 3),
    (90, "Th", "Thorium", "Torio", "232.04", "ac", 10, 4),
    (91, "Pa", "Protactinium", "Protactinio", "231.04", "ac", 10, 5),
    (92, "U", "Uranium", "Uranio", "238.03", "ac", 10, 6),
    (93, "Np", "Neptunium", "Neptunio", "[237]", "ac", 10, 7),
    (94, "Pu", "Plutonium", "Plutonio", "[244]", "ac", 10, 8),
    (95, "Am", "Americium", "Americio", "[243]", "ac", 10, 9),
    (96, "Cm", "Curium", "Curio", "[247]", "ac", 10, 10),
    (97, "Bk", "Berkelium", "Berkelio", "[247]", "ac", 10, 11),
    (98, "Cf", "Californium", "Californio", "[251]", "ac", 10, 12),
    (99, "Es", "Einsteinium", "Einstenio", "[252]", "ac", 10, 13),
    (100, "Fm", "Fermium", "Fermio", "[257]", "ac", 10, 14),
    (101, "Md", "Mendelevium", "Mendelevio", "[258]", "ac", 10, 15),
    (102, "No", "Nobelium", "Nobelio", "[259]", "ac", 10, 16),
    (103, "Lr", "Lawrencium", "Lawrencio", "[266]", "ac", 10, 17),
    (104, "Rf", "Rutherfordium", "Rutherfordio", "[267]", "tm", 7, 4),
    (105, "Db", "Dubnium", "Dubnio", "[268]", "tm", 7, 5),
    (106, "Sg", "Seaborgium", "Seaborgio", "[269]", "tm", 7, 6),
    (107, "Bh", "Bohrium", "Bohrio", "[270]", "tm", 7, 7),
    (108, "Hs", "Hassium", "Hasio", "[269]", "tm", 7, 8),
    (109, "Mt", "Meitnerium", "Meitnerio", "[278]", "tm", 7, 9),
    (110, "Ds", "Darmstadtium", "Darmstatio", "[281]", "tm", 7, 10),
    (111, "Rg", "Roentgenium", "Roentgenio", "[282]", "tm", 7, 11),
    (112, "Cn", "Copernicium", "Copernicio", "[285]", "tm", 7, 12),
    (113, "Nh", "Nihonium", "Nihonio", "[286]", "pt", 7, 13),
    (114, "Fl", "Flerovium", "Flerovio", "[289]", "pt", 7, 14),
    (115, "Mc", "Moscovium", "Moscovio", "[290]", "pt", 7, 15),
    (116, "Lv", "Livermorium", "Livermorio", "[293]", "pt", 7, 16),
    (117, "Ts", "Tennessine", "Teneso", "[294]", "ha", 7, 17),
    (118, "Og", "Oganesson", "Oganesón", "[294]", "ng", 7, 18),
]

# Estado a 25 °C: gases y líquidos (el resto, sólidos)
GASES = {"H", "He", "N", "O", "F", "Ne", "Cl", "Ar", "Kr", "Xe", "Rn"}
LIQUIDOS = {"Br", "Hg"}

# Valencias (estados de oxidación más habituales en formulación)
VALENCIAS = {
    "H": "+1 −1",
    "Li": "+1", "Na": "+1", "K": "+1", "Rb": "+1", "Cs": "+1", "Fr": "+1",
    "Be": "+2", "Mg": "+2", "Ca": "+2", "Sr": "+2", "Ba": "+2", "Ra": "+2",
    "Sc": "+3", "Y": "+3",
    "Ti": "+2 +3 +4", "Zr": "+4", "Hf": "+4",
    "V": "+2 +3 +4 +5", "Nb": "+3 +5", "Ta": "+5",
    "Cr": "+2 +3 +6", "Mo": "+2 +3 +4 +5 +6", "W": "+2 +3 +4 +5 +6",
    "Mn": "+2 +3 +4 +6 +7", "Tc": "+4 +6 +7", "Re": "+4 +6 +7",
    "Fe": "+2 +3", "Ru": "+2 +3 +4 +6 +8", "Os": "+2 +3 +4 +6 +8",
    "Co": "+2 +3", "Rh": "+2 +3 +4", "Ir": "+2 +3 +4 +6",
    "Ni": "+2 +3", "Pd": "+2 +4", "Pt": "+2 +4",
    "Cu": "+1 +2", "Ag": "+1", "Au": "+1 +3",
    "Zn": "+2", "Cd": "+2", "Hg": "+1 +2",
    "B": "−3 +3", "Al": "+3", "Ga": "+1 +3", "In": "+1 +3", "Tl": "+1 +3",
    "C": "−4 +2 +4", "Si": "−4 +2 +4", "Ge": "+2 +4", "Sn": "+2 +4", "Pb": "+2 +4",
    "N": "−3 +1 +2 +3 +4 +5", "P": "−3 +3 +5", "As": "−3 +3 +5", "Sb": "−3 +3 +5",
    "Bi": "+3 +5",
    "O": "−2", "S": "−2 +2 +4 +6", "Se": "−2 +2 +4 +6", "Te": "−2 +2 +4 +6",
    "Po": "+2 +4 +6",
    "F": "−1", "Cl": "−1 +1 +3 +5 +7", "Br": "−1 +1 +3 +5 +7", "I": "−1 +1 +3 +5 +7",
    "At": "−1 +1 +3 +5 +7",
    "Ce": "+3 +4", "Eu": "+2 +3", "Sm": "+2 +3", "Yb": "+2 +3",
    "Th": "+4", "Pa": "+4 +5", "U": "+3 +4 +5 +6", "Np": "+3 +4 +5 +6",
    "Pu": "+3 +4 +5 +6", "No": "+2 +3",
}
# Elementos que se estudian en 2º/3º ESO (los que aparecen en las tablas antiguas
# 2_3_ESO_TP_EN/ES.pdf y TP_Valencias.pdf). En la versión reducida el resto sale transparente.
ESTUDIADOS = set("""
H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar
K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr
Rb Sr Y Zr Mo Pd Ag Cd In Sn Sb Te I Xe
Cs Ba W Pt Au Hg Tl Pb Bi Po At Rn Fr Ra
""".split())

for _el in E:
    # resto de lantánidos y actínidos: +3
    if _el[5] in ("ln", "ac"):
        VALENCIAS.setdefault(_el[1], "+3")

TEXTOS = {
    "EN": {
        "titulo": "Periodic Table of the Elements",
        "lang": "en",
        "grupo": "Group",
        "periodo": "Period",
        "cat": {
            "al": "Alkali metals", "ae": "Alkaline earth metals",
            "tm": "Transition metals", "pt": "Post-transition metals",
            "md": "Metalloids", "nm": "Nonmetals", "ha": "Halogens",
            "ng": "Noble gases", "ln": "Lanthanides", "ac": "Actinides",
        },
        "estados": ("Solid", "Liquid", "Gas"),
        "estado_tit": "State at 25 °C (symbol colour):",
        "clave": ("Atomic number", "Symbol", "Name", "Atomic mass (u)"),
        "nota": "[ ] mass number of the most stable isotope · dashed border: synthetic element",
        "decimal": ".",
        "titulo_val": "Periodic Table · Oxidation States",
        "clave_val": ("Atomic number", "Symbol", "Name", "Oxidation states"),
        "nota_val": "Most common oxidation states (valences) · dashed border: synthetic element",
        "nota_red": " · faded: not studied",
    },
    "ES": {
        "titulo": "Tabla Periódica de los Elementos",
        "lang": "es",
        "grupo": "Grupo",
        "periodo": "Periodo",
        "cat": {
            "al": "Metales alcalinos", "ae": "Metales alcalinotérreos",
            "tm": "Metales de transición", "pt": "Otros metales",
            "md": "Semimetales (metaloides)", "nm": "No metales", "ha": "Halógenos",
            "ng": "Gases nobles", "ln": "Lantánidos", "ac": "Actínidos",
        },
        "estados": ("Sólido", "Líquido", "Gas"),
        "estado_tit": "Estado a 25 °C (color del símbolo):",
        "clave": ("Número atómico", "Símbolo", "Nombre", "Masa atómica (u)"),
        "nota": "[ ] número másico del isótopo más estable · borde discontinuo: elemento artificial",
        "decimal": ",",
        "titulo_val": "Tabla Periódica · Estados de Oxidación",
        "clave_val": ("Número atómico", "Símbolo", "Nombre", "Valencias"),
        "nota_val": "Valencias más habituales · borde discontinuo: elemento artificial",
        "nota_red": " · transparente: no se estudia",
    },
}

CSS = """
@page { size: 297mm 190mm; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 297mm; height: 190mm; background: #fff; }
body { font-family: "Segoe UI", Arial, Helvetica, sans-serif; color: #1a1a1a;
       -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.hoja { position: relative; width: 297mm; height: 190mm; padding: 5mm 6mm; }
h1 { position: absolute; top: 9mm; left: 0; right: 0; text-align: center;
     font-size: 21pt; font-weight: 700; letter-spacing: .3pt; color: #1f3864; }
.tabla { display: grid; grid-template-columns: 6mm repeat(18, 1fr);
         grid-template-rows: 5mm repeat(7, 17.4mm) 4mm repeat(2, 17.4mm);
         gap: 0.9mm; height: 180mm; }
.cel { position: relative; border: 0.35mm solid #444; border-radius: 1mm;
       padding: 0.6mm 0.8mm; overflow: hidden; }
.cel.sint { border-style: dashed; }
.z { position: absolute; top: 0.5mm; left: 0.9mm; font-size: 6.5pt; font-weight: 700; }
.m { position: absolute; top: 0.6mm; right: 0.8mm; font-size: 5.4pt; }
.s { position: absolute; top: 4.3mm; left: 0; right: 0; text-align: center;
     font-size: 15pt; font-weight: 800; line-height: 1; }
.n { position: absolute; bottom: 0.9mm; left: 0; right: 0; text-align: center;
     font-size: 5.3pt; white-space: nowrap; }
.s.gas { color: #c00000; } .s.liq { color: #0050c8; } .s.sol { color: #111; }
.ng-num { display: flex; align-items: end; justify-content: center; font-size: 7pt;
          font-weight: 700; color: #555; }
.np-num { display: flex; align-items: center; justify-content: center; font-size: 8pt;
          font-weight: 700; color: #555; }
.hueco { border: 0.35mm dashed #888; border-radius: 1mm; display: flex; align-items: center;
         justify-content: center; font-size: 7.5pt; font-weight: 700; color: #444; }
.fila-f { display: flex; align-items: center; justify-content: flex-end; padding-right: 1mm;
          font-size: 6.5pt; font-weight: 700; color: #444; text-align: right; }
.leyenda { grid-column: 4 / 14; grid-row: 2 / 5; align-self: start; margin-top: 15mm;
           display: grid; grid-template-columns: 1fr 1fr 34mm; gap: 1.2mm 3mm; font-size: 6.6pt; }
.item { display: flex; align-items: center; gap: 1.5mm; }
.caja { width: 4.2mm; height: 3.2mm; border: 0.3mm solid #444; border-radius: .6mm; }
.estados { grid-column: 1 / 3; margin-top: 1mm; font-size: 6.6pt; }
.estados b { margin-right: 2mm; }
.estados span { font-weight: 800; margin-right: 2.5mm; }
.nota { grid-column: 1 / 3; font-size: 6pt; color: #444; }
.clave { grid-column: 3; grid-row: 1 / 7; position: relative; width: 34mm; height: 32mm;
         border: 0.4mm solid #222; border-radius: 1.2mm; background: #f3f3f3; }
.clave .z { font-size: 8pt; top: 1mm; left: 1.4mm; }
.clave .m { font-size: 7pt; top: 1mm; right: 1.4mm; }
.clave .s { font-size: 20pt; top: 10mm; }
.clave .n { font-size: 7pt; bottom: 1.5mm; }
.clave-txt { position: absolute; font-size: 5pt; color: #333; white-space: nowrap; }
/* colores por familia */
.al { background: #ff9e9e; } .ae { background: #ffd09a; } .tm { background: #ffe9a8; }
.pt { background: #c9e8b0; } .md { background: #a8dccf; } .nm { background: #a9d4ff; }
.ha { background: #c7c1ff; } .ng { background: #f0b8e8; } .ln { background: #b9eef5; }
.ac { background: #d9d0c3; }
/* tabla de valencias */
.v { position: absolute; top: 3.2mm; left: 0.6mm; right: 0.6mm; text-align: center;
     font-size: 5.6pt; font-weight: 700; line-height: 1.1; color: #1f3864; word-spacing: .4mm; }
.val .s { top: 8.3mm; font-size: 13pt; }
/* versión reducida: elementos que no se estudian */
.cel.noest, .hueco.noest { opacity: .22; }
.val .clave .v { top: 5mm; font-size: 8pt; }
.val .clave .s { top: 13mm; font-size: 18pt; }
"""


def celda(el, idioma, clave_cfg, modo, reducida=False):
    z, sim, n_en, n_es, masa, cat, per, gr = el
    nombre = n_en if idioma == "EN" else n_es
    masa = masa.replace(".", clave_cfg["decimal"])
    estado = "gas" if sim in GASES else "liq" if sim in LIQUIDOS else "sol"
    sint = " sint" if (sim in {"Tc", "Pm"} or z >= 93) else ""
    if reducida and sim not in ESTUDIADOS:
        sint += " noest"
    fila = per + 1
    if modo == "val":
        dato = f'<span class="v">{VALENCIAS.get(sim, "")}</span>'
    else:
        dato = f'<span class="m">{masa}</span>'
    return (f'<div class="cel {cat}{sint}" style="grid-row:{fila};grid-column:{gr + 1}">'
            f'<span class="z">{z}</span>{dato}'
            f'<span class="s {estado}">{sim}</span><span class="n">{nombre}</span></div>')


def html(idioma, modo="masa", reducida=False):
    t = TEXTOS[idioma]
    if modo == "val":
        titulo, clave, nota = t["titulo_val"], t["clave_val"], t["nota_val"]
    else:
        titulo, clave, nota = t["titulo"], t["clave"], t["nota"]
    partes = []
    # números de grupo (encima del elemento más alto de cada grupo)
    alto = {1: 1, 2: 2, 13: 2, 14: 2, 15: 2, 16: 2, 17: 2, 18: 1}
    for g in range(1, 19):
        fila = alto.get(g, 4)  # fila de la tabla (periodo); fila grid = periodo + 1
        partes.append(f'<div class="ng-num" style="grid-row:{fila};grid-column:{g + 1}">{g}</div>')
    for p in range(1, 8):
        partes.append(f'<div class="np-num" style="grid-row:{p + 1};grid-column:1">{p}</div>')
    for el in E:
        partes.append(celda(el, idioma, t, modo, reducida))
    # huecos que remiten a lantánidos y actínidos
    tenue = " noest" if reducida else ""
    partes.append(f'<div class="hueco ln{tenue}" style="grid-row:7;grid-column:4">57–71</div>')
    partes.append(f'<div class="hueco ac{tenue}" style="grid-row:8;grid-column:4">89–103</div>')
    partes.append(f'<div class="fila-f" style="grid-row:10;grid-column:1/4">{t["cat"]["ln"]}</div>')
    partes.append(f'<div class="fila-f" style="grid-row:11;grid-column:1/4">{t["cat"]["ac"]}</div>')

    # leyenda
    items = "".join(f'<div class="item"><span class="caja {k}"></span>{v}</div>'
                    for k, v in t["cat"].items())
    sol, liq, gas = t["estados"]
    k = clave
    leyenda = (
        '<div class="leyenda">'
        f'<div style="display:contents">{items}</div>'
        '<div class="clave">'
        '<span class="z">26</span>'
        + ('<span class="v">+2 +3</span>' if modo == "val"
           else '<span class="m">55' + t["decimal"] + '85</span>') +
        '<span class="s sol">Fe</span>'
        f'<span class="n">{"Iron" if idioma == "EN" else "Hierro"}</span>'
        + (f'<span class="clave-txt" style="top:1.6mm;left:7mm">{k[0]}</span>' if modo == "val"
           else f'<span class="clave-txt" style="top:5mm;left:1.4mm">{k[0]}</span>')
        + (f'<span class="clave-txt" style="top:9mm;left:0;right:0;text-align:center">{k[3]}</span>'
           f'<span class="clave-txt" style="top:20.5mm;left:0;right:0;text-align:center">{k[1]}</span>'
           if modo == "val" else
           f'<span class="clave-txt" style="top:5mm;right:1.4mm">{k[3]}</span>'
           f'<span class="clave-txt" style="top:19.5mm;left:0;right:0;text-align:center">{k[1]}</span>') +
        f'<span class="clave-txt" style="bottom:5.5mm;left:0;right:0;text-align:center">{k[2]}</span>'
        '</div>'
        f'<div class="estados"><b>{t["estado_tit"]}</b>'
        f'<span class="sol" style="color:#111">{sol}</span>'
        f'<span style="color:#0050c8">{liq}</span>'
        f'<span style="color:#c00000">{gas}</span></div>'
        f'<div class="nota">{nota}{t["nota_red"] if reducida else ""}</div>'
        '</div>'
    )
    # rótulos de la ficha clave (fuera de la cuadrícula de la leyenda para no descolocarla)
    clave_txt = ""

    return f"""<!DOCTYPE html>
<html lang="{t['lang']}">
<head>
<meta charset="utf-8">
<title>{titulo}</title>
<style>{CSS}
</style>
</head>
<body>
<div class="hoja {modo}">
<h1>{titulo}</h1>
{clave_txt}
<div class="tabla">
{''.join(partes)}
{leyenda}
</div>
</div>
</body>
</html>
"""


CHROME = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
]


def main():
    aqui = os.path.dirname(os.path.abspath(__file__))
    destino = os.path.dirname(aqui)
    navegador = next(c for c in CHROME if os.path.exists(c))
    trabajos = []
    for idioma in ("EN", "ES"):
        trabajos.append((idioma, "masa", f"TP_{idioma}.html",
                         os.path.join(destino, f"2_3_ESO_TP_{idioma}_html.pdf")))
        # tabla de valencias: junto a la antigua TP_Valencias.pdf (src/images)
        trabajos.append((idioma, "val", f"TP_Valencias_{idioma}.html",
                         os.path.join(os.path.dirname(destino), f"TP_Valencias_{idioma}_html.pdf")))
    # versión reducida de cada tabla: mismos nombres con el sufijo _reducida
    trabajos = [(i, m, h, r, False) for i, m, h, r in trabajos] +                [(i, m, h.replace(".html", "_reducida.html"),
                 r.replace("_html.pdf", "_reducida_html.pdf"), True) for i, m, h, r in trabajos]
    for idioma, modo, nombre_html, ruta_pdf, reducida in trabajos:
        ruta_html = os.path.join(aqui, nombre_html)
        with open(ruta_html, "w", encoding="utf-8") as f:
            f.write(html(idioma, modo, reducida))
        subprocess.run([navegador, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                        f"--print-to-pdf={ruta_pdf}", "file:///" + ruta_html.replace("\\", "/")],
                       check=True, capture_output=True)
        print("Creado:", ruta_pdf)


if __name__ == "__main__":
    main()
