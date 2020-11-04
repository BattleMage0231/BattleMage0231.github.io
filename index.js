'use strict';

// constant data

function getById(id) {
    return document.getElementById(id);
}

function shuffleArray(arr) {
    console.log(arr);
    for (let i = arr.length - 1; i > 0; --i) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    console.log(arr);
}

const data = {
    // number of intervals
    INTERVAL_NUM: 20,
    // maximum number of intervals per purchase
    MAX_INTERVAL_PURCHASE: 40n,
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
    // cool facts
    NUM_COOL_FACTS: 29,
    COOL_FACTS: [
        'The phrase "goosebumps" was named after a man who died after being attacked by wild geese.',
        'The pineapple is the second most erotic fruit, next to the watermelon.',
        'Lake Superior was artificially created in 1920 to allow more fish to spawn locally.',
        'Most supercomputers are built with HTML5, the fastest and most verbose programming language.',
        'Experts suspect that Prime Minister John A. Macdonald was gay.',
        'In 2018, Discord was accused of shipping supplies to political terrorists during the Iraq Civil War.',
        'Statistically, you have a best friend named Joe.',
        'It is perfectly legal to show up naked to court in some states in the US.',
        'Space smells like the back of a Playstation 4.',
        'Unicorns existed in Madagascar until going extinct in the 15th century.',
        'Bumblebees are incable of love.',
        'In the Bible, the word "ant" is more common than the word "man".',
        'Originally, the French planed to use the Statue of Liberty as a Trojan Horse.',
        'Slavery is still legal in the Yukon and Northwest Territories.',
        'The blobfish was named after its discoverer, Steven T. Blob.',
        'Water was deadly to humans until 700BC.',
        'Forced laughter can take weeks off your life expectancy',
        'Some vaccines can cause you to exhibit fish-like characteristics.',
        'In 2011, the RCMP was briefly disbanded after catching every single criminal.',
        'Animals are four times more likely to be arrested in China than the United States.',
        'To live longer, the Queen of England engages in intense physical activity everyday.',
        'In Sweden, you can get arrested for using substitute swear words such as "frick".',
        'Some parts of Star Wars and Star Trek were actually filmed in space.',
        'The US government invented the hamburger to inflate the economy.',
        'All sharks suffer from Dissociative Identity Disorder.',
        'The Bermuda Triangle is actually a cyclic quadrilateral.',
        'It is impossible for fire hydrants to ejaculate in November.',
        'The toad is a sacred animal in Japan. Frogs, however, are believed to be embodimenst of the devil.',
        'The American Mathematics Contest outsources much of its problem setting to India.',
    ],
};

// manage intervals and automatic click incrementation

class IntervalManager {
    // creates a new instance of IntervalManager with intervalNum intervals per second
    constructor(intervalNum) {
        this.intervalNum = intervalNum;
        this.intervalVals = new Array(intervalNum).fill(0n);
        this.intervalPtr = 0;
    }
    // start the interval timer
    launch(gameManager) {
        let func = (gameManager) => {
            gameManager.numClicks += this.intervalVals[this.intervalPtr];
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
        this.itemAmounts = new Array(data.SHOP_ITEM_NUMS).fill(0n);
        this.numClicks = 0n;
        this.numButtonClicks = 0n;
        this.cps = 0n;
        this.videoPlayed = false;
        // set up interval manager
        this.intervalManager = new IntervalManager(data.INTERVAL_NUM);
        this.intervalManager.launch(this);
        // cool fact cache
        this.coolFactCache = data.COOL_FACTS;
        console.log(this.coolFactCache);
        shuffleArray(this.coolFactCache);
        console.log(this.coolFactCache);
    }

    numberOf(id) {
        return this.itemAmounts[id];
    }

    getCoolFact(x) {
        return this.coolFactCache[x];
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
        ++this.numButtonClicks;
        ++this.numClicks;
        this.updateElements();
    }

    // updates all HTML elements
    updateElements() {
        let clickString = this.numClicks.toString();
        getById('clickCounter').innerText = clickString;
        getById('topClickCounter').innerText = clickString;
        const itemsList = getById('itemsList');
        itemsList.innerHTML = '';
        for(let i = 0; i < data.SHOP_ITEM_NUMS; ++i) {
            // pad an s when plural or zero
            let padding = 's';
            if(this.numberOf(i) == 1) {
                padding = '';
            }
            itemsList.innerHTML += 
                `
                <p>
                <span class="font-weight-bold">${this.numberOf(i)}</span> ${data.nameOf(i)}${padding}
                </p>
                `;
        }
        itemsList.innerHTML +=
        `
        <p>
        You are automatically producing <span class="font-weight-bold">${this.cps}</span> clicks per second.
        </p>
        `;
        // cool fact
        if(this.numButtonClicks % 100n == 0n) {
            let fact = this.getCoolFact(Math.floor(Number(this.numButtonClicks / 100n)));
            if(fact) {
                getById('fact').innerText = fact;
            } else {
                getById('fact').innerText = 'The line below is a scam. There are no more cool facts.';
            }
        }
    }

    // unconditionally buy amt of id
    buy(id, amt) {
        // update data values
        this.itemAmounts[id] += amt;
        this.cps += data.cpsOf(id) * amt;
        // update HTML elements
        this.updateElements();
        // update interval
        // loop over every item if there are less than 40
        if(amt <= data.MAX_INTERVAL_PURCHASE) {
            for(let i = 0; i < amt; ++i) {
                let index = this.intervalManager.getRandomInterval();
                this.intervalManager.intervalVals[index] += data.cpsOf(id);
            }
        } else {
            // loop over segments of items if there are more than 40
            let segment = amt / data.MAX_INTERVAL_PURCHASE;
            for(let i = 0; i < data.MAX_INTERVAL_PURCHASE; ++i) {
                let index = this.intervalManager.getRandomInterval();
                this.intervalManager.intervalVals[index] += data.cpsOf(id) * segment;
            }
            // leftover extra cps
            let extra = amt % data.MAX_INTERVAL_PURCHASE;
            let index = this.intervalManager.getRandomInterval();
            this.intervalManager.intervalVals[index] += data.cpsOf(id) * extra;
        }
    }

    // attempt to buy amt of id
    attemptBuy(id, amt) {
        // not enough clicks
        if(data.costOf(id) * amt > this.numClicks) {
            return;
        }
        // buy
        this.numClicks -= data.costOf(id) * amt;
        this.buy(id, amt);
    }
}

function saveData() {
    let obj = {
        numClicks: game.numClicks.toString(),
        cps: game.cps.toString(),
        videoPlayed: game.videoPlayed,
        itemAmounts: game.itemAmounts.map(x => x.toString()),
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
    game.itemAmounts = obj.itemAmounts.map(x => BigInt(x));
    // set intervals
    for(let id = 0; id < data.SHOP_ITEM_NUMS; ++id) {
        game.buy(id, game.numberOf(id));
    }
    // update HTML
    game.updateElements();
}

// admin was submitted
function admin() {
    let elem = getById('admin-text');
    let text = elem.value;
    console.log(text);
    elem.value = '';
    console.log(text);
    eval(text);
}

let game = new GameManager();
