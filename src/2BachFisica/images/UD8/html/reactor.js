// Esquema de una central nuclear de agua a presión: reactor, generador de vapor, turbina-alternador y condensador.
lienzo(780, 330);
// vasija y blindaje
E(S, 'rect', { x: 20, y: 40, width: 220, height: 270, rx: 14, fill: '#cfd8dc', stroke: C.tinta, 'stroke-width': 1.6 });
E(S, 'rect', { x: 50, y: 70, width: 160, height: 210, rx: 50, fill: '#bbdefb', stroke: C.azul, 'stroke-width': 2 });
for (let k = 0; k < 5; k++) E(S, 'rect', { x: 72 + k * 26, y: 150, width: 12, height: 60, fill: '#ff8a65', stroke: C.tinta, 'stroke-width': 1 });
for (let k = 0; k < 4; k++) E(S, 'rect', { x: 87 + k * 26, y: 52, width: 7, height: 150, fill: '#455a64' });
texto(130, 30, 'barras de control', { size: 13 }); texto(130, 296, 'combustible (uranio)', { size: 12 });
texto(130, 226, 'agua (moderador', { size: 12, halo: true }); texto(130, 240, 'y refrigerante)', { size: 12, halo: true });
texto(12, 325, 'blindaje de hormigón', { size: 12, anchor: 'start' });
// circuito primario hacia el generador de vapor
camino('M210,110 L300,110 L300,120', { c: C.rojo, w: 4 }); camino('M300,250 L300,260 L210,260', { c: C.azul, w: 4 });
E(S, 'rect', { x: 280, y: 120, width: 90, height: 130, rx: 12, fill: '#eceff1', stroke: C.tinta, 'stroke-width': 1.6 });
camino('M300,130 Q345,150 300,170 Q345,190 300,210 Q345,230 300,245', { c: C.rojo, w: 3 });
texto(325, 104, 'generador', { size: 12 }); texto(325, 270, 'de vapor', { size: 12 });
// vapor a turbina
camino('M370,140 L470,140', { c: '#9e9e9e', w: 5 }); texto(420, 132, 'vapor', { size: 12 });
E(S, 'polygon', { points: '470,115 540,95 540,185 470,165', fill: '#b0bec5', stroke: C.tinta, 'stroke-width': 1.5 }); texto(560, 210, 'turbina', { size: 13, anchor: 'start' });
linea(540, 140, 590, 140, { w: 4 });
E(S, 'circle', { cx: 625, cy: 140, r: 34, fill: '#fff9c4', stroke: C.tinta, 'stroke-width': 1.6 }); texto(625, 146, 'G', { size: 18, bold: true });
texto(625, 196, 'alternador', { size: 13 });
camino('M659,140 L740,140', { c: C.naranja, w: 2 }); texto(745, 145, '~', { size: 22, anchor: 'start' });
// condensador
camino('M505,185 L505,255', { c: '#9e9e9e', w: 5 });
E(S, 'rect', { x: 460, y: 255, width: 90, height: 50, rx: 8, fill: '#e3f2fd', stroke: C.tinta, 'stroke-width': 1.6 });
texto(505, 285, 'condensador', { size: 12 });
camino('M460,280 L380,280 L380,230 L370,230', { c: C.azul, w: 3 });
