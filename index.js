// constant data

function getById(id) {
    return document.getElementById(id);
}

const data = {
    // number of intervals
    INTERVAL_NUM: 20,
    // number of items
    SHOP_ITEM_NUMS: 4,
    // item properties
    ITEM_NAMES: [
        'Minimum Wage Worker',
        'Stoned Teenager',
        'PvP God',
        'Sweatshop',
    ],
    ITEM_COSTS: [
        100n,
        500n,
        1200n,
        4000n,
    ],
    ITEM_CPS: [
        1n,
        7n,
        20n,
        100n,
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
        this.videoPlated = false;
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
            itemsList.innerHTML += 
                `
                <p>
                <span class="font-weight-bold">${this.numOf[i]}</span> ${data.nameOf(i)}s
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

let game = new GameManager();
