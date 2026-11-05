// Datos de los mapas conceptuales de 4.º ESO (formato: ver mapa.js).
// Fórmulas: variables en <i>, y la fórmula entera en <span class="m"> para que no se parta de línea.
const COLOR = '#1565C0'; // azul del libro: \definecolor{ocre}{RGB}{21,101,192}
const TEMAS = {};
const F = s => `<span class="m">${s}</span>`;

TEMAS.UD1 = {
    titulo: 'El trabajo científico',
    ramas: [
        { enlace: 'investiga con el', t: 'Método científico', sub: 'etapas',
          hijos: ['Observación y problema', 'Hipótesis', 'Experimentos y variables', 'Análisis de resultados', 'Leyes, teorías y modelos'] },
        { enlace: 'organiza los datos en', t: 'Tablas y gráficas', sub: 'la gráfica puede ser',
          hijos: ['Recta<br>' + F('<i>y</i> = <i>k</i>·<i>x</i>'), 'Parábola<br>' + F('<i>y</i> = <i>k</i>·<i>x</i><sup>2</sup>'), 'Hipérbola<br>' + F('<i>x</i>·<i>y</i> = <i>k</i>')] },
        { enlace: 'mide', t: 'Magnitudes y unidades', sub: 'se estudian',
          hijos: ['Básicas y derivadas (SI)', 'Cambio de unidades', 'Notación científica', 'Ecuaciones de dimensiones'] },
        { enlace: 'expresa', t: 'El resultado de una medida', sub: 'con',
          hijos: ['Cifras significativas y redondeo', 'Error absoluto', 'Error relativo'] },
        { enlace: 'distingue', t: 'Escalares y vectoriales', sub: 'con vectores',
          hijos: ['Suma de vectores', 'Componentes de un vector'] },
        { enlace: 'trabaja en el', t: 'Laboratorio', sub: 'con',
          hijos: ['Normas de seguridad', 'Pictogramas de peligro', 'Material de laboratorio'] },
    ]
};

TEMAS.UD2 = {
    titulo: 'El átomo y la tabla periódica',
    ramas: [
        { enlace: 'se explica con', t: 'Modelos atómicos', sub: 'evolución',
          hijos: ['Dalton', 'Thomson (electrón)', 'Rutherford (núcleo)', 'Bohr: niveles de energía', 'Bohr-Sommerfeld: subniveles'] },
        { enlace: 'se identifica por', t: 'Número atómico y másico', sub: 'definen',
          hijos: [F('<i>Z</i>') + ' = n.º de protones', F('<i>A</i>') + ' = protones + neutrones', 'Isótopos e iones', 'Masa atómica (u)'] },
        { enlace: 'emite y absorbe', t: 'Espectros atómicos', sub: 'se explican con',
          hijos: ['Saltos de electrones entre niveles', 'Radiactividad del núcleo'] },
        { enlace: 'reparte sus electrones en la', t: 'Configuración electrónica', sub: 'determina',
          hijos: ['Electrones de valencia', 'Posición en la tabla'] },
        { enlace: 'se ordena en la', t: 'Tabla periódica', sub: 'agrupa',
          hijos: ['Grupos y periodos', 'Elementos representativos', 'Metales, no metales y semimetales', 'Transición y transición interna'] },
    ]
};

TEMAS.UD3 = {
    titulo: 'El enlace químico',
    ramas: [
        { enlace: 'se explica con la', t: 'Regla del octeto', sub: 'se representa con',
          hijos: ['Diagramas de Lewis'] },
        { enlace: 'puede ser', t: 'Enlace covalente', sub: 'forma',
          hijos: ['Moléculas (H<sub>2</sub>O, CO<sub>2</sub>…)', 'Cristales covalentes (diamante)', 'Enlaces polares'] },
        { enlace: 'entre moléculas', t: 'Fuerzas inter­moleculares', sub: 'tipos',
          hijos: ['Enlaces de hidrógeno', 'Fuerzas de Van der Waals'] },
        { enlace: 'puede ser', t: 'Enlace iónico', sub: 'forma',
          hijos: ['Redes de iones', 'Propiedades de los compuestos iónicos'] },
        { enlace: 'puede ser', t: 'Enlace metálico', sub: 'se explica con',
          hijos: ['Electrones libres', 'Propiedades de los metales'] },
        { enlace: 'cuenta partículas con', t: 'El mol', sub: 'relaciona',
          hijos: ['Masa molecular', 'Composición centesimal', 'Masa molar', F('<i>N</i><sub>A</sub> = 6,022·10<sup>23</sup>')] },
    ]
};

TEMAS.UD4 = {
    titulo: 'La química del carbono',
    ramas: [
        { enlace: 'se basa en el', t: 'Átomo de carbono', sub: 'forma',
          hijos: ['4 enlaces covalentes', 'Cadenas saturadas e insaturadas', 'Modelos moleculares'] },
        { enlace: 'se representa con', t: 'Fórmulas', sub: 'y se agrupa por',
          hijos: ['Molecular, semidesarrollada y desarrollada', 'Grupo funcional', 'Series homólogas'] },
        { enlace: 'estudia los', t: 'Hidrocarburos', sub: 'tipos',
          hijos: ['Alcanos', 'Alquenos', 'Alquinos'] },
        { enlace: 'estudia los', t: 'Compuestos oxigenados', sub: 'tipos',
          hijos: ['Alcoholes', 'Aldehídos y cetonas', 'Ácidos carboxílicos y ésteres'] },
        { enlace: 'estudia los', t: 'Compuestos nitrogenados', sub: 'tipos',
          hijos: ['Aminas'] },
        { enlace: 'destacan', t: 'Compuestos de interés', sub: 'como',
          hijos: ['Glúcidos', 'Lípidos', 'Polímeros'] },
    ]
};

TEMAS.UD5 = {
    titulo: 'La materia y los sistemas materiales',
    ramas: [
        { enlace: 'se presenta en', t: 'Estados de agregación', sub: 'se explican con la',
          hijos: ['Teoría cinética'] },
        { enlace: 'en estado gaseoso', t: 'Leyes de los gases', sub: 'son',
          hijos: ['Boyle<br>' + F('<i>p</i>·<i>V</i> = cte'), 'Charles<br>' + F('<i>V</i>/<i>T</i> = cte'), 'Gay-Lussac<br>' + F('<i>p</i>/<i>T</i> = cte'), 'Ley general<br>' + F('<i>p</i>·<i>V</i> = <i>n</i>·<i>R</i>·<i>T</i>'), 'Volumen molar'] },
        { enlace: 'forma', t: 'Sistemas materiales', sub: 'pueden ser',
          hijos: ['Heterogéneos', 'Homogéneos', 'Sustancias puras'] },
        { enlace: 'si son homogéneos', t: 'Disoluciones', sub: 'se estudian',
          hijos: ['Concentración (g/L, %, mol/L)', 'Preparación'] },
        { enlace: 'se separan por', t: 'Métodos de separación', sub: 'como',
          hijos: ['Filtración y decantación', 'Cristalización', 'Destilación', 'Cromatografía'] },
    ]
};

TEMAS.UD6 = {
    titulo: 'Las reacciones químicas',
    ramas: [
        { enlace: 'se explican con el', t: 'Mecanismo de reacción', sub: 'teorías',
          hijos: ['De las colisiones', 'Del complejo activado'] },
        { enlace: 'se representan con', t: 'Ecuaciones químicas', sub: 'cumplen',
          hijos: ['Conservación de la masa', 'Ajuste', 'Estequiometría'] },
        { enlace: 'transcurren con una', t: 'Velocidad de reacción', sub: 'depende de',
          hijos: ['Concentración', 'Temperatura', 'Superficie de contacto', 'Catalizadores'] },
        { enlace: 'intercambian', t: 'Energía', sub: 'pueden ser',
          hijos: ['Exotérmicas', 'Endotérmicas', 'Ecuaciones termoquímicas'] },
        { enlace: 'pueden ser de', t: 'Tipos de reacciones', sub: 'como',
          hijos: ['Oxidación-reducción', 'Ácido-base', 'Combustión', 'Electroquímicas'] },
        { enlace: 'se aplican en la', t: 'Industria química', sub: 'por ejemplo',
          hijos: ['Metalurgia'] },
    ]
};

TEMAS.UD7 = {
    titulo: 'Los movimientos rectilíneos',
    ramas: [
        { enlace: 'se describen con', t: 'Posición y referencia', sub: 'y además',
          hijos: ['Trayectoria', 'Espacio recorrido', 'Desplazamiento'] },
        { enlace: 'miden su rapidez con la', t: 'Velocidad', sub: 'puede ser',
          hijos: ['Media', 'Instantánea', 'Es un vector'] },
        { enlace: 'cambian su velocidad con la', t: 'Aceleración', sub: 'es',
          hijos: [F('<i>a</i> = Δ<i>v</i>/Δ<i>t</i>'), 'Un vector'] },
        { enlace: 'pueden ser', t: 'MRU', sub: 'ecuaciones y gráficas',
          hijos: [F('<i>x</i> = <i>x</i><sub>0</sub> + <i>v</i>·<i>t</i>'), 'Gráficas ' + F('<i>x</i>-<i>t</i>') + ' y ' + F('<i>v</i>-<i>t</i>')] },
        { enlace: 'pueden ser', t: 'MRUV', sub: 'ecuaciones',
          hijos: [F('<i>v</i> = <i>v</i><sub>0</sub> + <i>a</i>·<i>t</i>'), F('<i>x</i> = <i>x</i><sub>0</sub> + <i>v</i><sub>0</sub>·<i>t</i>') + ' ' + F('+ ½<i>a</i>·<i>t</i><sup>2</sup>')] },
        { enlace: 'en vertical', t: 'Caída libre y lanzamientos', sub: 'con',
          hijos: [F('<i>g</i> = 9,8 m/s<sup>2</sup>'), 'Lanzamiento hacia abajo', 'Lanzamiento hacia arriba'] },
    ]
};

TEMAS.UD8 = {
    titulo: 'Las fuerzas y los cambios de movimiento',
    ramas: [
        { enlace: 'producen', t: 'Efectos de las fuerzas', sub: 'la fuerza es',
          hijos: ['Deformaciones', 'Cambios de movimiento', 'Un vector (N)'] },
        { enlace: 'se suman en la', t: 'Composición de fuerzas', sub: 'da la',
          hijos: ['Fuerza resultante'] },
        { enlace: 'cumplen las', t: 'Leyes de Newton', sub: 'son',
          hijos: ['1.ª: inercia', '2.ª: ' + F('<i>F</i> = <i>m</i>·<i>a</i>'), '3.ª: acción y reacción'] },
        { enlace: 'una de ellas es el', t: 'Peso', sub: 'se estudia',
          hijos: [F('<i>P</i> = <i>m</i>·<i>g</i>'), 'Diagramas de fuerzas', 'Fuerza normal', 'Plano inclinado'] },
        { enlace: 'frena con el', t: 'Rozamiento', sub: 'se estudia',
          hijos: [F('<i>F</i><sub>r</sub> = μ·<i>N</i>'), 'Planos horizontales', 'Planos inclinados'] },
    ]
};

TEMAS.UD9 = {
    titulo: 'El movimiento circular. La gravedad y otras fuerzas',
    ramas: [
        { enlace: 'estudia el', t: 'MCU', sub: 'magnitudes',
          hijos: ['Ángulo (rad)', 'Velocidad angular ω', F('<i>v</i> = ω·<i>R</i>'), 'Período y frecuencia'] },
        { enlace: 'necesita una', t: 'Aceleración centrípeta', sub: 'la produce la',
          hijos: [F('<i>a</i><sub>c</sub> = <i>v</i><sup>2</sup>/<i>R</i>'), 'Fuerza centrípeta'] },
        { enlace: 'explica el universo con la', t: 'Gravitación', sub: 'se estudian',
          hijos: ['Leyes de Kepler', 'Gravitación universal', 'Peso y caída de los cuerpos', 'Luna y satélites'] },
        { enlace: 'estudia la', t: 'Fuerza eléctrica', sub: 'con',
          hijos: ['Carga (C)', 'Ley de Coulomb', 'Potencial eléctrico'] },
        { enlace: 'estudia la', t: 'Fuerza magnética', sub: 'con',
          hijos: ['Imanes y sus propiedades', 'Electro­magnetismo'] },
    ]
};

TEMAS.UD10 = {
    titulo: 'Fuerzas en los fluidos',
    ramas: [
        { enlace: 'define la', t: 'Presión', sub: 'es',
          hijos: [F('<i>p</i> = <i>F</i>/<i>S</i>'), 'Unidad: pascal (Pa)'] },
        { enlace: 'en líquidos', t: 'Presión hidrostática', sub: 'se estudia',
          hijos: [F('<i>p</i> = <i>d</i>·<i>g</i>·<i>h</i>'), 'Principio fundamental', 'Vasos comunicantes'] },
        { enlace: 'se transmite según el', t: 'Principio de Pascal', sub: 'se aplica en la',
          hijos: ['Prensa hidráulica'] },
        { enlace: 'en el aire', t: 'Presión atmosférica', sub: 'se estudia',
          hijos: ['Medida (Torricelli)', 'Variación con la altitud', 'Borrascas y anticiclones'] },
        { enlace: 'empuja según el', t: 'Principio de Arquímedes', sub: 'se estudia',
          hijos: [F('<i>E</i> = <i>d</i>·<i>g</i>·<i>V</i>'), 'Peso aparente', 'Medida de densidades', 'Flotación'] },
    ]
};

TEMAS.UD11 = {
    titulo: 'Trabajo y energía mecánica',
    ramas: [
        { enlace: 'se transfiere con', t: 'Trabajo', sub: 'es',
          hijos: [F('<i>W</i> = <i>F</i>·Δ<i>x</i>·cos α'), 'Unidad: julio (J)', 'Trabajo del rozamiento'] },
        { enlace: 'mide su rapidez la', t: 'Potencia', sub: 'es',
          hijos: [F('<i>P</i> = <i>W</i>/<i>t</i>'), 'Vatio (W) y CV', 'Rendimiento'] },
        { enlace: 'cambia la', t: 'Energía mecánica', sub: 'suma de',
          hijos: ['Cinética<br>' + F('½<i>m</i>·<i>v</i><sup>2</sup>'), 'Potencial<br>' + F('<i>m</i>·<i>g</i>·<i>h</i>')] },
        { enlace: 'sin rozamiento', t: 'Conservación de la energía mecánica', sub: 'se aplica en',
          hijos: ['Caídas y lanzamientos', 'Planos inclinados', 'Péndulos'] },
        { enlace: 'en general', t: 'Conservación de la energía total', sub: 'implica',
          hijos: ['Transformaciones de energía'] },
    ]
};

TEMAS.UD12 = {
    titulo: 'El calor: una forma de transferir energía',
    ramas: [
        { enlace: 'se relaciona con la', t: 'Temperatura', sub: 'se estudia',
          hijos: ['Energía cinética de las partículas', 'Escalas (°C, K)', 'Equilibrio térmico'] },
        { enlace: 'cambia la temperatura', t: 'Calor sensible', sub: 'se calcula',
          hijos: [F('<i>Q</i> = <i>m</i>·<i>c</i>·Δ<i>T</i>'), 'Calorímetro', 'Calor específico'] },
        { enlace: 'cambia el estado', t: 'Calor latente', sub: 'se estudia',
          hijos: [F('<i>Q</i> = <i>m</i>·<i>L</i>'), 'Fusión y vaporización', 'Gráficas de calentamiento'] },
        { enlace: 'también produce', t: 'Dilatación', sub: 'en',
          hijos: ['Sólidos', 'Líquidos y gases'] },
        { enlace: 'equivale al', t: 'Trabajo', sub: 'se estudia',
          hijos: ['Equivalente mecánico del calor', 'Degradación de la energía'] },
        { enlace: 'se aprovecha en', t: 'Máquinas térmicas', sub: 'como',
          hijos: ['Máquina de vapor', 'Motor de combustión'] },
    ]
};

TEMAS.UD13 = {
    titulo: 'Luz y sonido: ondas que transfieren energía',
    ramas: [
        { enlace: 'se describen como', t: 'Ondas', sub: 'pueden ser',
          hijos: ['Mecánicas o electro­magnéticas', 'Longitudinales o transversales', 'Frentes de onda y rayos'] },
        { enlace: 'se miden con', t: 'Magnitudes', sub: 'son',
          hijos: [F('λ, <i>T</i>, <i>f</i>, <i>A</i>'), F('<i>v</i> = λ·<i>f</i>'), 'Energía que propagan'] },
        { enlace: 'presentan', t: 'Fenómenos ondulatorios', sub: 'como',
          hijos: ['Reflexión', 'Refracción'] },
        { enlace: 'un ejemplo es el', t: 'Sonido', sub: 'se estudia',
          hijos: ['Onda mecánica longitudinal', 'Intensidad y decibelios', 'Eco', 'Cualidades del sonido'] },
        { enlace: 'otro ejemplo es la', t: 'Luz', sub: 'se estudia',
          hijos: ['Onda transversal', 'Reflexión y refracción', 'Dispersión de la luz blanca', 'Espectro electro­magnético'] },
    ]
};
