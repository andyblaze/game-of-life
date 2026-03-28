class HUD {
    update(data) { 
        document.getElementById(data.type).innerText = data.output;
    }
}
class World {
    constructor() {
        this.observers = [];
        this.items = {};
        this.stocks = {};
    }
    addObserver(o) {
        this.observers.push(o);
    }
    add(item) {
        this.items[item.product] = item;
        this.stocks[item.product] = 0;
    }
    tick() {
        for ( const [key, item] of Object.entries(this.items) )
            item.tick(this);
        this.notify();
    }
    deposit(type, n) {
        this.stocks[type] += n;
    }
    notify() {
        for ( const o of this.observers )
            o.update({ type: "iron", output: this.stocks["iron"] });
    }
}
class GameItem {
    constructor(strat) {
        this.strategy = strat;
        this.product = strat.product;
        this.result = 0;
    }
    ontick(world) {
        this.consume(world);
        this.produce(world);
        this.finalise(world);
    }
    consume(world) {}
    produce(world) {
        this.result = this.strategy.tick(world);
    }
    finalise(world) {
        world.deposit(this.product, this.result);
    }
    tick(world) {
        this.ontick(world);        
    }
}
class IronMine {
    type = "iron";
    constructor() {
        this.product = this.type;
        this.output = 0;
    }
    tick(world) {
        return 1;
    }
}
const hud = new HUD();

const world = new World();
world.add(new GameItem(new IronMine()));
world.addObserver(hud);

let lastTime = 0;
let accumulator = 0;
const TICK_RATE = 1000; // ms per game tick 

function loop(timestamp) {
    const delta = timestamp - lastTime;
    lastTime = timestamp;
    accumulator += delta;
    //DeltaRreport.log(timestamp);

    // run game logic at fixed intervals
    while ( accumulator >= TICK_RATE ) {
        world.tick();
        accumulator -= TICK_RATE;        
    }
    // render would go here (canvas updates etc) at 60 fps
    requestAnimationFrame(loop);
}

loop(performance.now());
