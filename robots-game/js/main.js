import { mt_rand, byId, randomFrom } from "./functions.js";

class IronMining {
    constructor() {
        this.resource = "iron";
    }
    tick(workers) {
        let str = 0;
        for ( const w of workers )
            str += w.attr("strength");
        return 0.1 * str;
    }
}
class CoalMining {
    constructor() {
        this.resource = "coal";
    }
    tick(workers) {
        return 0.5 * workers.length;
    }
}
class WheatFarming {
    constructor() {
        this.resource = "wheat";
    }
    tick(workers) {
        return 0.75 * workers.length;
    }
}
class HumanBehaviour {
    constructor() {
        this.resource = "human";
    }
    tick(parent) {
        parent.morale -= 1;
    }
}
class BaseResource {
    constructor(s) {
        this.strategy = s;
    }    
}
class FarmedResource extends BaseResource {
    constructor(s) {
        super(s);
        this.resource = s.resource;
        this.workers = [];
        this.output = 0;

    }
    tick() {
        this.output += this.strategy.tick(this.workers);
    }
    assignWorkers(n, population) {
        const workers = population.getAvailable(n);
        for ( const w of workers ) {
            w.assignedTo = this;
        }
        this.workers = workers;
    }
}

class Human extends BaseResource {
    constructor(s) {
        super(s);
        this.int = mt_rand(20, 80);
        this.morale = mt_rand(20, 80);
        this.strength = mt_rand(20, 80);
        this.assignedTo = null;
    }
    tick() {
        this.strategy.tick(this);
    }
    attr(a) {
        return this[a];
    }
}

class Observable {
    constructor() {
        this.observers = [];
    }
    addObserver(o) {
        this.observers.push(o);
    }
    notify(data) {
        for ( const o of this.observers ) {
            o.update(data);
        }
    }
}

class Config {
    constructor(msgs) {
        this.messages = [
            "A message",
            "Message to you",
            "Help me Tom Cruise",
            "There's a problem",
            "All is not well",
            "A collapse",
            "Many people unwell"
        ];
    }
    getMessage() {
        return randomFrom(this.messages);
    }
}

class ResourceAggregator extends Observable {
    constructor(cfg) {     
        super();  
        this.cfg = cfg; 
        this.resources = [];
        this.output = 0;
        this.resource = "";
    }
    tick() {
        for( const r of this.resources ) {
            r.tick();
            this.output = this.resources.reduce((sum, r) => sum + r.output, 0);
        }
        const msg = this.createMessage();
        this.notify([{ type: this.resource, output: this.output }, msg]);
    }
    add(r) {
        this.resources.push(r);
        this.resource = r.resource;
    }
    assignWorkers(idx, n, pop) {
        this.resources[idx].assignWorkers(n, pop);
    }
    createMessage() {
        const msg = { type: "msg", output: "" };
        if ( mt_rand(0, 5000) > 4990 ) 
            msg.output = this.cfg.getMessage();  
        return msg;      
    }
}

class Population extends ResourceAggregator {
    constructor() {
        super();
    }
    tick() {
        for ( const r of this.resources ) {
            r.tick();
        }
        this.notify([
            { type: "population", output: this.resources.length },
            { type: "morale", output: this.attr("morale") }
        ]);
    }
    getAvailable(n) {
        const available = this.resources.filter(r => r.assignedTo === null);
        return available.slice(0, n);
    }
    attr(a) {
        let result = 0;
        for ( const r of this.resources ) {
            result += r.attr(a);
        }
        return result;
    }
}

class HUD {
    constructor() {

    }
    update(data) {
        for ( const d of data ) {
            if ( d.type === "msg" && d.output === "" ) continue;
            byId(d.type).innerText = d.output;
        }
    }
}


const population = new Population();
for ( let i = 0; i < 12; i++ )
    population.add(new Human(new HumanBehaviour()));

const config = new Config();

function createResource(type) { //  factory function, will be a class later
    const res = new FarmedResource(type);
    const agg = new ResourceAggregator(config);
    agg.add(res);
    return agg;
}
const hud = new HUD();


const ironMines = createResource(new IronMining); 
const coalMines = createResource(new CoalMining()); 
const wheatFarms = createResource(new WheatFarming()); 

ironMines.assignWorkers(0, 3, population);
coalMines.assignWorkers(0, 1, population);
wheatFarms.assignWorkers(0, 2, population);

ironMines.addObserver(hud);
coalMines.addObserver(hud);
wheatFarms.addObserver(hud);
population.addObserver(hud);

function loop(timestamp) {
    ironMines.tick();
    coalMines.tick();
    wheatFarms.tick();
    population.tick();
    requestAnimationFrame(loop);
}

loop(performance.now());