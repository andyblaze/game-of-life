class HUD {
    constructor() {
        this.elements = {};
    }
    update(data) { 
        for (const d of data) {
            if ( !this.elements[d.type] ) {
                this.elements[d.type] = document.getElementById(d.type);
            }
            this.elements[d.type].innerText = d.output;
        }
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
    stockUnknown(type) {
        const ok = !(type in this.stocks);
        if ( true === ok ) {
            console.error(type + " is not in stocks. Typo ?");
        }
        return ok;
    }
    deposit(d) {
        if ( this.stockUnknown(d.type) ) return;
        this.stocks[d.type] += d.amount;
    }
    hasResource(r) {
        if ( this.stockUnknown(r.type) ) return false;
        return this.stocks[r.type] >= r.amount;
    }
    consume(c) {
        if ( this.stockUnknown(c.type) ) return 0;
        if ( this.stocks[c.type] - c.amount < 0  ) return 0;
        this.stocks[c.type] -= c.amount;
        return c.amount;
        
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
        this.result = {type: "", amount: 0};
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
        world.deposit(this.result);
    }
    tick(world) {
        this.ontick(world);        
    }
}
class ResourceFarm extends Tickable {
    type = "";
    constructor(type) {
        super();
        this.type = type;
        this.result.type = type;
        this.product = this.type;
        this.output = { type: this.type, amount: 0 };
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
        this.result.amount = 1;
    }
}
class CoalMine extends ResourceFarm {
    type = "coal";
    constructor() {
        super("coal");
    }
    produce(world) {
         this.result.amount = 2;
    }
}
class WoodFarm extends ResourceFarm {
    type = "wood";
    constructor() {
        super("wood");
    }
    produce(world) {
         this.result.amount = 2;
    }
}
class WheatFarm extends ResourceFarm {
    type = "wheat";
    constructor() {
        super("wheat");
    }
    produce(world) {
         this.result.amount = 2;
    }
}
class Bakery extends ResourceFarm {
    type = "bread";
    constructor() {
        super("bread");
        this.wood = 0;
        this.wheat = 0;
        this.inputs = {
            wheat: { type: "wheat", amount: 16 },
            wood: { type: "wood", amount: 16 }
        };
        this.output = { type: "bread", amount: 1 };
    }
    consume(world) {
        const ok = Object.entries(this.inputs).every(
            ([type, input]) => world.hasResource(input)
        );

        if ( !ok ) return;

        for (const [type, input] of Object.entries(this.inputs)) {
            this[type] = world.consume(input);
        }
    }
    produce(world) { 
        this.output.amount = 0;
        if ( this.wood > 0 && this.wheat > 0 ) { 
            this.output.amount = 1;
            this.result = this.output;
        }
    }
    finalise(world) {
        this.wood = 0;
        this.wheat = 0;
    }
}
class PowerPlant extends ResourceFarm {
    type = "power";
    constructor() {
        super("power");
        this.wood = 0;
        this.coal = 0;
        this.wheat = 0;
        this.inputs = {
            coal: { type: "coal", amount: 8 },
            wood: { type: "wood", amount: 12 },
            wheat: { type: "wheat", amount: 32 }
        };
        this.output = { type: "power", amount: 1 };
    }
    consume(world) {
        world.consume({ type: "power", amount: 1 });

        if ( world.hasResource({ type: "power", amount: 100 }) ) return;

        // burn excess wheat as first preference 
        if ( world.hasResource({ type: "wheat", amount: 100 }) ) {
            this.wheat = world.consume(this.inputs.wheat);
            return;
        }

        this.coal = world.consume(this.inputs.coal);
        if ( this.coal > 0 ) return;

        this.wood = world.consume(this.inputs.wood);
    }
    produce(world) { 
        this.output.amount = 0;
        if ( this.wood > 0 || this.coal > 0 || this.wheat > 0 ) { 
            this.output.amount = (this.wood / 6) + (this.coal / 2) + (this.wheat / 32); 
            this.result = this.output;
        }
    }
    finalise(world) {
        this.wood = 0;
        this.coal = 0;
        this.wheat = 0;
    }
}

const hud = new HUD();

const world = new World();
world.add(new GameItem(new PowerPlant()));
world.add(new GameItem(new Bakery()));
world.add(new GameItem(new IronMine()));
world.add(new GameItem(new CoalMine()));
world.add(new GameItem(new WoodFarm()));
world.add(new GameItem(new WheatFarm()));
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
