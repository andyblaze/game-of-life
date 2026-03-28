class HUD {
    update(data) { 
        for ( const d of data)
            document.getElementById(d.type).innerText = d.output;
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
        let data = [];
        for ( const [key, item] of Object.entries(this.stocks ) )
            data.push({ type: key, output: item });
        for ( const o of this.observers )
            o.update(data);
    }
}
class Tickable {
    constructor() {
        this.result = null;
    }
    consume(world) {}
    produce(world) {}
    finalise(world) {}
    ontick(world) {
        this.consume(world);
        this.produce(world);
        this.finalise(world);
    }
}
class GameItem extends Tickable {
    constructor(strat) {
        super();
        this.strategy = strat;
        this.product = strat.product;
        this.result = 0;
    }
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
class ResourceFarm extends Tickable {
    constructor(type) {
        super();
        this.type = type;
        this.product = this.type;
        this.output = 0;
    }
    tick(world) {
        this.ontick(world);
        return this.result;
    }

}
class IronMine extends ResourceFarm {
    type = "iron";
    constructor() {
        super("iron");
    }
    produce(world) {
        this.result = 1;
    }
}
class CoalMine extends ResourceFarm {
    type = "coal";
    constructor() {
        super("coal");
    }
    produce(world) {
        this.result = 2;
    }
}
const hud = new HUD();

const world = new World();
world.add(new GameItem(new IronMine()));
world.add(new GameItem(new CoalMine()));
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
