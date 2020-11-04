// constant data

function getById(id) {
    return document.getElementById(id);
}

const data = {
    // number of intervals
    INTERVAL_NUM: 20,
    // number of items
    SHOP_ITEM_NUMS: 7,
    // item properties
    ITEM_NAMES: [
        'Minimum Wage Worker',
        'Stoned Teenager',
        'PvP God',
        'Sweatshop',
        'African Village',
        'Gulag',
        'ICS Teacher',
    ],
    ITEM_COSTS: [
        100n,
        500n,
        1200n,
        4000n,
        8000n,
        15000n,
        32000n,
    ],
    ITEM_CPS: [
        1n,
        7n,
        20n,
        100n,
        320n,
        900n,
        3000n,
    ],
    // getter functions
    nameOf: function(id) {
        return this.ITEM_NAMES[id];
    },
    costOf: function(id) {
        return this.ITEM_COSTS[id];
    },
    cpsOf: function(id) {
        return this.ITEM_CPS[id];
    },
};

// manage intervals and automatic click incrementation

class IntervalManager {
    // creates a new instance of IntervalManager with intervalNum intervals per second
    constructor(intervalNum) {
        this.intervalNum = intervalNum;
        this.intervalVal = new Array(intervalNum).fill(0n);
        this.intervalPtr = 0;
    }
    // start the interval timer
    launch(gameManager) {
        let func = (gameManager) => {
            gameManager.numClicks += this.intervalVal[this.intervalPtr];
            ++this.intervalPtr;
            this.intervalPtr %= this.intervalNum;
            gameManager.updateElements();
        };
        func = func.bind(this);
        setInterval(() => func(gameManager), 1000.0 / this.intervalNum);        
    }
    // get a random interval
    getRandomInterval() {
        return Math.floor(Math.random() * this.intervalNum);;
    }
}

// manage game mechanics

class GameManager {
    // creates a new instance of GameManager
    constructor() {
        this.numOf = new Array(data.SHOP_ITEM_NUMS).fill(0n);
        this.numClicks = 0n;
        this.cps = 0n;
        this.videoPlayed = false;
        // set up interval manager
        this.intervalManager = new IntervalManager(data.INTERVAL_NUM);
        this.intervalManager.launch(this);
    }

    // the button was pressed once
    buttonClicked() {
        if(!this.videoPlayed && Math.random() <= 0.05) {
            getById('embed').innerHTML =
            `<iframe width="560" height="315" src="https://www.youtube.com/embed/oHg5SJYRHA0?autoplay=1&rel=0&modestbranding=1&autohide=1&showinfo=0&controls=0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            this.videoPlayed = true;
            setTimeout(
                () => getById('embed').innerHTML = '',
                215000
            )
        }
        ++this.numClicks;
        this.updateElements();
    }

    // updates all HTML elements
    updateElements() {
        getById('clickCounter').innerText = this.numClicks.toString();
        const itemsList = getById('itemsList');
        itemsList.innerHTML = '';
        for(let i = 0; i < data.SHOP_ITEM_NUMS; ++i) {
            // pad an s when plural or zero
            let padding = 's';
            if(this.numOf[i] == 1) {
                padding = '';
            }
            itemsList.innerHTML += 
                `
                <p>
                <span class="font-weight-bold">${this.numOf[i]}</span> ${data.nameOf(i)}${padding}
                </p>
                `;
        }
        itemsList.innerHTML +=
        `
        <p>
        You are automatically producing <span class="font-weight-bold">${this.cps}</span> clicks per second.
        </p>
        `;
    }

    // attempt to buy amt of id
    attemptBuy(id, amt) {
        // not enough clicks
        if(data.costOf(id) * amt > this.numClicks) {
            return;
        }
        // update data values
        this.numClicks -= data.costOf(id) * amt;
        this.numOf[id] += amt;
        this.cps += data.cpsOf(id) * amt;
        // update HTML elements
        this.updateElements();
        // update interval
        for(let i = 0; i < amt; ++i) {
            let index = this.intervalManager.getRandomInterval();
            this.intervalManager.intervalVal[index] += data.cpsOf(id);
        }
    }
}

function saveData() {
    let obj = {
        numClicks: game.numClicks.toString(),
        cps: game.cps.toString(),
        videoPlayed: game.videoPlayed,
        numOf: game.numOf.map(x => x.toString()),
    };
    localStorage.setItem('buttonClickerSave', JSON.stringify(obj));
}

function loadData() {
    let obj = localStorage.getItem('buttonClickerSave');
    if(obj === null) {
        return;
    }
    obj = JSON.parse(obj);
    // reset game
    game.intervalManager = new IntervalManager(data.INTERVAL_NUM);
    game.intervalManager.launch(game);
    // set fields
    game.numClicks = BigInt(obj.numClicks);
    game.cps = BigInt(obj.cps);
    game.videoPlayed = obj.videoPlayed;
    game.numOf = obj.numOf.map(x => BigInt(x));
    // set intervals
    for(let id = 0; id < data.SHOP_ITEM_NUMS; ++id) {
        for(let num = 0n; num < game.numOf[id]; ++num) {
            let index = game.intervalManager.getRandomInterval();
            game.intervalManager.intervalVal[index] += data.cpsOf(id);
        }
    }
    // update HTML
    game.updateElements();
}

let game = new GameManager();
