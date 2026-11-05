// Cavidad que se comporta como un cuerpo negro: la radiación que entra por el orificio queda atrapada.
lienzo(320, 240);
E(S, 'circle', { cx: 160, cy: 120, r: 96, fill: '#90a4ae', stroke: C.tinta, 'stroke-width': 2 });
E(S, 'circle', { cx: 160, cy: 120, r: 76, fill: '#263238' });
E(S, 'rect', { x: 230, y: 110, width: 40, height: 20, fill: '#fff' });
const pts = [[300, 122], [236, 120], [120, 52], [96, 168], [196, 186], [210, 70], [118, 100]];
camino('M' + pts.map(p => p.join(',')).join(' L'), { c: '#ffca28', w: 2 });
flecha(310, 122, 262, 121, { c: '#ffca28', w: 2.2, head: 10 });
texto(160, 228, 'cavidad con un orificio', { size: 14 });
