// constants

const SHOP_ITEMS_NUM = 4;

const nameOf = [
    'Minimum Wage Worker',
    'Stoned Teenager',
    'PvP God',
    'Sweatshop'
]

const costOf = [
    100,
    500,
    1200,
    4000
]

const cpsOf = [
    1,
    7,
    20,
    100
]

const numberOf = new Array(SHOP_ITEMS_NUM).fill(0);

const INTERVAL_NUM = 20;

const intervalInc = new Array(INTERVAL_NUM).fill(0);

let videoPlayed = false;

// utility functions

function getById(id) {
    return document.getElementById(id);
}

function findNextInterval() {
    return Math.floor(Math.random() * INTERVAL_NUM);
}

// main code

let clicks = 0;
let cps = 0;

function updateElements() {
    getById('clickCounter').innerText = clicks.toString();
    const itemsList = getById('itemsList');
    itemsList.innerHTML = '';
    for(let i = 0; i < SHOP_ITEMS_NUM; ++i) {
        itemsList.innerHTML += 
            `
            <p>
            <span class="font-weight-bold">${numberOf[i]}</span> ${nameOf[i]}s
            </p>
            `;
    }
    itemsList.innerHTML +=
    `
    <p>
    You are automatically producing <span class="font-weight-bold">${cps}</span> clicks per second.
    </p>
    `;
}

function buttonClicked() {
    if(!videoPlayed && Math.random() <= 0.05) {
        getById('embed').innerHTML =
        `<iframe width="560" height="315" src="https://www.youtube.com/embed/oHg5SJYRHA0?autoplay=1&rel=0&modestbranding=1&autohide=1&showinfo=0&controls=0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        videoPlayed = true;
        setTimeout(
            () => getById('embed').innerHTML = '',
            215000
        )
    }
    ++clicks;
    updateElements();
}

function buy(id) {
    if(clicks < costOf[id]) {
        return;
    }
    clicks -= costOf[id];
    ++numberOf[id];
    cps += cpsOf[id];
    updateElements();
    intervalInc[findNextInterval()] += cpsOf[id];
}

let pointer = 0;

setInterval(
    function() {
        clicks += intervalInc[pointer++];
        pointer %= INTERVAL_NUM;
        updateElements();
    },
    1000.0 / INTERVAL_NUM
);
