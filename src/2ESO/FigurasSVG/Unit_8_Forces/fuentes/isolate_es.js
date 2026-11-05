// Versión española de isolate.js (figuras «cómo despejar cada magnitud»).
// Cada tarjeta: { goal, steps: [[explicación, ecuaciónHTML], ...], result }
const f = (n, d) => `<span class="frac"><span>${n}</span><span>${d}</span></span>`;
const c = x => `<span class="cancel">${x}</span>`;
const g = x => `<span class="goal">${x}</span>`;
const o = x => `<span class="op">${x}</span>`;
const q = (x, i) => `<span>${x}<sub>${i}</sub></span>`;

function buildIsolate(title, cards, tip) {
    document.querySelector('h1').innerHTML = title;
    const grid = document.getElementById('grid');
    cards.forEach((card, k) => {
        const steps = card.steps.map((s, i) =>
            `<div class="step"><div class="n">${i + 1}</div><div class="what">${s[0]}</div><div class="eq">${s[1]}</div></div>`).join('');
        grid.insertAdjacentHTML('beforeend', `
            <div class="col c${k % 2}">
                <h2>Quiero despejar ${g(card.goal)}</h2>
                ${steps}
                <div class="step last"><div class="n">✔</div><div class="what">Resultado:</div><div class="eq"><span class="res">${card.result}</span></div></div>
            </div>`);
    });
    document.getElementById('tip').innerHTML = tip;
}
