"""Dibuja las estructuras de figuras_organica.html a partir de su SMILES.

Cada molécula se escribe en SMILES; los localizadores se indican con el número
de mapa del átomo ([CH3:1], [C:2]...), que se dibuja junto al átomo.
El grupo funcional se resalta con uno o varios patrones SMARTS.
El resultado (moleculas.js) lo usa figuras_organica.html:
    <div class="mol" data-mol="<id>"></div>

Requisitos (una sola vez):
    pip install rdkit
Uso:
    python generar_moleculas.py
Después: python exportar_figuras.py   (HTML -> PDF y SVG)
"""
import json
import re
from pathlib import Path

from rdkit import Chem
from rdkit.Chem import rdDepictor
from rdkit.Chem.Draw import rdMolDraw2D

CARPETA = Path(__file__).resolve().parent
SALIDA = CARPETA / "moleculas.js"
rdDepictor.SetPreferCoordGen(True)

# Colores de resaltado (fondos suaves, coherentes con la hoja de estilos del HTML)
COLOR = {
    "rojo": (1.00, 0.78, 0.78),     # grupo característico principal
    "azul": (0.75, 0.87, 1.00),     # grupo secundario / sustituyente
    "verde": (0.80, 0.94, 0.76),    # insaturaciones, halógenos
    "naranja": (1.00, 0.85, 0.70),  # parte alcohólica de los ésteres, radicales
    "lila": (0.90, 0.82, 1.00),
}

# Patrones SMARTS habituales
ACIDO = "[CX3](=O)[OX2H1]"
ESTER = "[CX3](=O)[OX2][#6]"
AMIDA = "[CX3](=O)[NX3]"
NITRILO = "[CX2]#[NX1]"
ALDEHIDO = "[CX3H1](=O)"
ALDEHIDO_C = "[CX3H2](=O)"
CETONA = "[#6][CX3](=O)[#6]"
CETONA_CO = "[CX3;$([CX3]([#6])[#6])]=O"
ALCOHOL = "[#6][OX2H1]"
OH = "[OX2H1]"
ETER = "[#6][OD2][#6]"
ETER_O = "[OD2;$(O([#6])[#6])]"
AMINA = "[NX3;!$(N[#6]=O)]"
HALOGENO = "[F,Cl,Br,I]"
NITRO = "[N+](=O)[O-]"
DOBLE = "[#6]=[#6]"
TRIPLE = "[#6]#[#6]"
ENLACE = "[#0]"  # punto de unión de un radical

# id: (SMILES con localizadores, [(SMARTS, color), ...], opciones)
MOLECULAS = {
    # --- Nombre sistemático y cadena principal
    "nombre": ("[CH3:1][C:2](=O)[CH2:3][CH:4](Cl)[CH:5]=[C:6](Cl)[CH3:7]",
               [(CETONA_CO, "rojo"), (HALOGENO, "azul"), (DOBLE, "verde")], {}),
    "etenilnonano": ("C=C[CH:4]([CH2:3][CH2:2][CH3:1])[CH2:5][CH2:6][CH2:7][CH2:8][CH3:9]",
                     [("[CH2]=[CH]", "naranja")], {}),
    "pentilciclobutano": ("CCCCCC1CCC1", [("C1CCC1", "azul")], {}),
    "pent1en4ino": ("[CH2:1]=[CH:2][CH2:3][C:4]#[CH:5]", [(DOBLE, "verde"), (TRIPLE, "verde")], {}),
    "but3en2ol": ("[CH3:1][CH:2](O)[CH:3]=[CH2:4]", [(OH, "rojo"), (DOBLE, "verde")], {}),
    # --- Representación
    "buteno-desarrollada": ("C=CCC", [], {"hs": True}),
    "buteno": ("[CH2:1]=[CH:2][CH2:3][CH3:4]", [], {}),
    # --- Alcanos
    "hexano": ("[CH3:1][CH2:2][CH2:3][CH2:4][CH2:5][CH3:6]", [], {}),
    "etilmetilhexano": ("[CH3:1][CH:2](C)[CH:3](CC)[CH2:4][CH2:5][CH3:6]", [], {}),
    "trimetilpentano": ("[CH3:1][C:2](C)(C)[CH2:3][CH:4](C)[CH3:5]", [], {}),
    "etilisopropilmetildecano": ("[CH3:1][CH2:2][CH2:3][CH:4](C(C)C)[CH:5](C)[CH:6](CC)[CH2:7][CH2:8][CH2:9][CH3:10]", [], {}),
    # --- Radicales alquilo
    "r-metil": ("*C", [], {}),
    "r-etil": ("*CC", [], {}),
    "r-propil": ("*CCC", [], {}),
    "r-isopropil": ("*C(C)C", [], {}),
    "r-butil": ("*CCCC", [], {}),
    "r-secbutil": ("*C(C)CC", [], {}),
    "r-isobutil": ("*CC(C)C", [], {}),
    "r-tercbutil": ("*C(C)(C)C", [], {}),
    # --- Alquenos y alquinos
    "but1eno": ("[CH2:1]=[CH:2][CH2:3][CH3:4]", [(DOBLE, "verde")], {}),
    "metilpent2eno": ("[CH3:1][CH:2]=[CH:3][CH:4](C)[CH3:5]", [(DOBLE, "verde")], {}),
    "butadieno": ("[CH2:1]=[CH:2][CH:3]=[CH2:4]", [(DOBLE, "verde")], {}),
    "r-etenil": ("*C=C", [(DOBLE, "verde")], {}),
    "r-alil": ("*CC=C", [(DOBLE, "verde")], {}),
    "etino": ("C#C", [(TRIPLE, "verde")], {}),
    "but1ino": ("[CH:1]#[C:2][CH2:3][CH3:4]", [(TRIPLE, "verde")], {}),
    "hex3en1ino": ("[CH:1]#[C:2][CH:3]=[CH:4][CH2:5][CH3:6]", [(DOBLE, "verde"), (TRIPLE, "verde")], {}),
    "r-etinil": ("*C#C", [(TRIPLE, "verde")], {}),
    # --- Cíclicos
    "ciclopropano": ("C1CC1", [], {}),
    "ciclohexano": ("C1CCCCC1", [], {}),
    "etilmetilciclohexano": ("CC[CH:1]1[CH2:2][CH:3](C)[CH2:4][CH2:5][CH2:6]1", [], {}),
    "metilciclopenteno": ("[CH:1]1=[CH:2][CH:3](C)[CH2:4][CH2:5]1", [(DOBLE, "verde")], {}),
    "ciclohexadieno": ("[CH:1]1=[CH:2][CH:3]=[CH:4][CH2:5][CH2:6]1", [(DOBLE, "verde")], {}),
    "propilciclobutano": ("CCCC1CCC1", [("C1CCC1", "azul")], {}),
    # --- Aromáticos
    "benceno": ("c1ccccc1", [], {}),
    "tolueno": ("Cc1ccccc1", [], {}),
    "orto": ("C[c:1]1[c:2](C)[cH:3][cH:4][cH:5][cH:6]1", [], {}),
    "meta": ("C[c:1]1[cH:2][c:3](C)[cH:4][cH:5][cH:6]1", [], {}),
    "para": ("C[c:1]1[cH:2][cH:3][c:4](C)[cH:5][cH:6]1", [], {}),
    "naftaleno": ("c1ccc2ccccc2c1", [], {}),
    "r-fenil": ("*c1ccccc1", [], {}),
    "r-bencil": ("*Cc1ccccc1", [], {}),
    # --- Derivados halogenados
    "cloropropano": ("[CH3:1][CH:2](Cl)[CH3:3]", [(HALOGENO, "verde")], {}),
    "triclorometano": ("ClC(Cl)Cl", [(HALOGENO, "verde")], {}),
    "bromopropeno": ("[CH2:1]=[CH:2][CH2:3]Br", [(HALOGENO, "verde")], {}),
    "bromoclorobenceno": ("Br[c:1]1[cH:2][cH:3][c:4](Cl)[cH:5][cH:6]1", [(HALOGENO, "verde")], {}),
    # --- Alcoholes y fenoles
    "etanol": ("[CH3:2][CH2:1]O", [(OH, "rojo")], {}),
    "propan2ol": ("[CH3:1][CH:2](O)[CH3:3]", [(OH, "rojo")], {}),
    "glicerol": ("O[CH2:1][CH:2](O)[CH2:3]O", [(OH, "rojo")], {}),
    "but3en2ol-b": ("[CH3:1][CH:2](O)[CH:3]=[CH2:4]", [(OH, "rojo"), (DOBLE, "verde")], {}),
    "ciclohexanol": ("OC1CCCCC1", [(OH, "rojo")], {}),
    "fenol": ("Oc1ccccc1", [(OH, "rojo")], {}),
    # --- Éteres
    "metoxietano": ("COCC", [(ETER_O, "rojo"), ("[CH3][OD2]", "naranja")], {}),
    "etoxietano": ("CCOCC", [(ETER_O, "rojo")], {}),
    "metoxibenceno": ("COc1ccccc1", [(ETER_O, "rojo"), ("[CH3][OD2]", "naranja")], {}),
    "etoxieteno": ("C=COCC", [(ETER_O, "rojo"), ("[OD2][CH2][CH3]", "naranja")], {}),
    "fenoxibenceno": ("c1ccc(Oc2ccccc2)cc1", [(ETER_O, "rojo")], {}),
    "metoxipropano": ("CO[CH:2]([CH3:1])[CH3:3]", [(ETER_O, "rojo"), ("[CH3][OD2]", "naranja")], {}),
    # --- Aldehídos
    "metanal": ("C=O", [(ALDEHIDO_C, "rojo")], {}),
    "etanal": ("[CH3:2][CH:1]=O", [(ALDEHIDO, "rojo")], {}),
    "metilbutanal": ("[CH3:4][CH:3](C)[CH2:2][CH:1]=O", [(ALDEHIDO, "rojo")], {}),
    "butanodial": ("O=[CH:1][CH2:2][CH2:3][CH:4]=O", [(ALDEHIDO, "rojo")], {}),
    "benzaldehido": ("O=Cc1ccccc1", [(ALDEHIDO, "rojo")], {}),
    "carbaldehido": ("O=CC1CCCCC1", [(ALDEHIDO, "rojo")], {}),
    # --- Cetonas
    "propanona": ("CC(C)=O", [(CETONA_CO, "rojo")], {}),
    "butanona": ("[CH3:1][C:2](=O)[CH2:3][CH3:4]", [(CETONA_CO, "rojo")], {}),
    "pentanodiona": ("[CH3:1][C:2](=O)[CH2:3][C:4](=O)[CH3:5]", [(CETONA_CO, "rojo")], {}),
    "ciclohexanona": ("O=C1CCCCC1", [(CETONA_CO, "rojo")], {}),
    "metilhexanona": ("[CH3:1][C:2](=O)[CH2:3][CH2:4][CH:5](C)[CH3:6]", [(CETONA_CO, "rojo")], {}),
    # --- Ácidos carboxílicos
    "metanoico": ("OC=O", [("[CX3H1](=O)[OX2H1]", "rojo")], {}),
    "etanoico": ("[CH3:2][C:1](=O)O", [(ACIDO, "rojo")], {}),
    "metilbutanoico": ("[CH3:4][CH:3](C)[CH2:2][C:1](=O)O", [(ACIDO, "rojo")], {}),
    "butanodioico": ("O[C:1](=O)[CH2:2][CH2:3][C:4](=O)O", [(ACIDO, "rojo")], {}),
    "benzoico": ("OC(=O)c1ccccc1", [(ACIDO, "rojo")], {}),
    "ciclohexanocarboxilico": ("OC(=O)C1CCCCC1", [(ACIDO, "rojo")], {}),
    "butenoico": ("O[C:1](=O)[CH2:2][CH:3]=[CH2:4]", [(ACIDO, "rojo"), (DOBLE, "verde")], {}),
    "metilhexanodioico": ("O[C:1](=O)[CH:2](C)[CH2:3][CH2:4][CH2:5][C:6](=O)O", [(ACIDO, "rojo")], {}),
    # --- Ésteres (rojo: parte del ácido, -oato; naranja: parte del alcohol, -ilo)
    "etanoatometilo": ("[CH3:2][C:1](=O)OC", [("[CX3](=O)[OX2]", "rojo"), ("[OX2][CH3]", "naranja")], {}),
    "propanoatoetilo": ("[CH3:3][CH2:2][C:1](=O)OCC", [("[CX3](=O)[OX2]", "rojo"), ("[OX2][CH2][CH3]", "naranja")], {}),
    "butanoatometilo": ("[CH3:4][CH2:3][CH2:2][C:1](=O)OC", [("[CX3](=O)[OX2]", "rojo"), ("[OX2][CH3]", "naranja")], {}),
    "pentenoatoetilo": ("[CH2:5]=[CH:4][CH2:3][CH2:2][C:1](=O)OCC", [("[CX3](=O)[OX2]", "rojo"), ("[OX2][CH2][CH3]", "naranja"), (DOBLE, "verde")], {}),
    "benzoatometilo": ("COC(=O)c1ccccc1", [("[CX3](=O)[OX2]", "rojo"), ("[OX2][CH3]", "naranja")], {}),
    # --- Aminas
    "metanamina": ("CN", [(AMINA, "rojo")], {}),
    "propan2amina": ("[CH3:1][CH:2](N)[CH3:3]", [(AMINA, "rojo")], {}),
    "metiletanamina": ("[CH3:2][CH2:1]NC", [(AMINA, "rojo"), ("[NX3][CH3]", "naranja")], {}),
    "trimetilamina": ("CN(C)C", [(AMINA, "rojo"), ("[NX3]([CH3])[CH3]", "naranja")], {}),
    "anilina": ("Nc1ccccc1", [(AMINA, "rojo")], {}),
    "etanodiamina": ("N[CH2:1][CH2:2]N", [(AMINA, "rojo")], {}),
    # --- Amidas
    "etanamida": ("[CH3:2][C:1](N)=O", [(AMIDA, "rojo")], {}),
    "metilpropanamida": ("[CH3:3][CH2:2][C:1](=O)NC", [(AMIDA, "rojo"), ("[NX3][CH3]", "naranja")], {}),
    "dimetilmetanamida": ("O=CN(C)C", [(AMIDA, "rojo"), ("[NX3]([CH3])[CH3]", "naranja")], {}),
    "benzamida": ("NC(=O)c1ccccc1", [(AMIDA, "rojo")], {}),
    "ciclohexanocarboxamida": ("NC(=O)[CH:1]1[CH2:2][CH:3](C)[CH:4](Br)[CH2:5][CH2:6]1", [(AMIDA, "rojo"), (HALOGENO, "azul")], {}),
    # --- Nitrilos
    "etanonitrilo": ("[CH3:2][C:1]#N", [(NITRILO, "rojo")], {}),
    "propanonitrilo": ("[CH3:3][CH2:2][C:1]#N", [(NITRILO, "rojo")], {}),
    "butanodinitrilo": ("N#[C:1][CH2:2][CH2:3][C:4]#N", [(NITRILO, "rojo")], {}),
    "benzonitrilo": ("N#Cc1ccccc1", [(NITRILO, "rojo")], {}),
    # --- Nitroderivados
    "nitrometano": ("C[N+](=O)[O-]", [(NITRO, "azul")], {}),
    "nitropropano": ("[CH3:1][CH:2]([CH3:3])[N+](=O)[O-]", [(NITRO, "azul")], {}),
    "nitrobenceno": ("[O-][N+](=O)c1ccccc1", [(NITRO, "azul")], {}),
    # --- Varios grupos funcionales (rojo: principal -> sufijo; azul: prefijo)
    "lactico": ("[CH3:3][CH:2](O)[C:1](=O)O", [(ACIDO, "rojo"), ("[CH1][OX2H1]", "azul")], {}),
    "hidroxibutanona": ("[CH3:1][C:2](=O)[CH2:3][CH2:4]O", [(CETONA_CO, "rojo"), (ALCOHOL, "azul")], {}),
    "oxobutanal": ("[CH3:4][C:3](=O)[CH2:2][CH:1]=O", [(ALDEHIDO, "rojo"), (CETONA_CO, "azul")], {}),
    "aminoetanol": ("N[CH2:2][CH2:1]O", [(OH, "rojo"), (AMINA, "azul")], {}),
    "alanina": ("[CH3:3][CH:2](N)[C:1](=O)O", [(ACIDO, "rojo"), (AMINA, "azul")], {}),
}


def preparar(smiles, opciones):
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        raise ValueError(f"SMILES no válido: {smiles}")
    for atomo in mol.GetAtoms():
        if atomo.GetAtomMapNum():
            atomo.SetProp("atomNote", str(atomo.GetAtomMapNum()))
            atomo.SetAtomMapNum(0)
    if opciones.get("hs"):
        mol = Chem.AddHs(mol)
    rdDepictor.Compute2DCoords(mol)
    return mol


def resaltados(mol, patrones):
    """Átomos y enlaces a resaltar; el primer patrón que toca un átomo fija su color."""
    atomos, enlaces = {}, {}
    for smarts, color in patrones:
        patron = Chem.MolFromSmarts(smarts)
        for coincidencia in mol.GetSubstructMatches(patron):
            for i in coincidencia:
                atomos.setdefault(i, COLOR[color])
            for enlace in patron.GetBonds():
                b = mol.GetBondBetweenAtoms(coincidencia[enlace.GetBeginAtomIdx()],
                                            coincidencia[enlace.GetEndAtomIdx()])
                if b is not None:
                    enlaces.setdefault(b.GetIdx(), COLOR[color])
    return atomos, enlaces


def dibujar(smiles, patrones, opciones):
    mol = preparar(smiles, opciones)
    atomos, enlaces = resaltados(mol, patrones)
    dibujo = rdMolDraw2D.MolDraw2DSVG(-1, -1)
    o = dibujo.drawOptions()
    o.clearBackground = False
    o.scalingFactor = 38
    o.bondLineWidth = 2
    o.multipleBondOffset = 0.18
    o.annotationFontScale = 0.62
    o.baseFontSize = 0.75
    o.padding = 0.12
    o.highlightRadius = 0.38
    o.fillHighlights = True
    o.continuousHighlight = True
    o.dummiesAreAttachments = True
    dibujo.DrawMolecule(mol,
                        highlightAtoms=list(atomos), highlightAtomColors=atomos,
                        highlightBonds=list(enlaces), highlightBondColors=enlaces)
    dibujo.FinishDrawing()
    svg = dibujo.GetDrawingText()
    # Localizadores en azul (RDKit los dibuja en negro)
    svg = re.sub(r"(<path class='note'[^>]*?fill=')#000000'", r"\g<1>#0B5BD3'", svg)
    return svg[svg.index("<svg"):]  # sin la cabecera XML, para insertarlo en el HTML


def main():
    svgs = {clave: dibujar(*datos) for clave, datos in MOLECULAS.items()}
    SALIDA.write_text("// Generado por generar_moleculas.py: no editar a mano\n"
                      "const MOLECULAS = " + json.dumps(svgs, ensure_ascii=False, indent=0) + ";\n",
                      encoding="utf-8")
    print(f"{len(svgs)} moléculas -> {SALIDA.name}")


if __name__ == "__main__":
    main()
