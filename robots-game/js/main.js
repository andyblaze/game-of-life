class IronMining {
    constructor() {
        this.resource = "iron";
    }
    tick(mulltiplier) {
        return 1 * mulltiplier;
    }
}
class CoalMining {
    constructor() {
        this.resource = "coal";
    }
    tick(mulltiplier) {
        return 0.5 * mulltiplier;
    }
}
class WheatFarming {
    constructor() {
        this.resource = "wheat";
    }
    tick(mulltiplier) {
        return 0.75 * mulltiplier;
    }
}
class Resource {
    constructor(s) {
        this.strategy = s;
        this.resource = s.resource;
        this.workers = 0;
        this.output = 0;

    }
    tick() {
        this.output += this.strategy.tick(this.workers);
    }
    assignWorkers(num) {
        this.workers += num;
    }
}

class Human extends Resource {
    constructor() {
        super("human");
    }
    tick() {

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

class ResourceAggregator extends Observable {
    constructor() {     
        super();   
        this.resources = [];
        this.output = 0;
        this.resource = "";
    }
    tick() {
        for( const r of this.resources ) {
            r.tick();
            this.output = this.resources.reduce((sum, r) => sum + r.output, 0);
        }
        this.notify({ type: this.resource, output: this.output });
    }
    add(r) {
        this.resources.push(r);
        this.resource = r.resource;
    }
}

class Population extends ResourceAggregator {
    constructor() {
        super();
    }
    tick() {
        //this.pop += Math.floor(Math.random() * 3);
        this.notify({ type: "population", output: this.resources.length });
    }
    get(n) {
        if ( this.resources.length === 0 ) return [];
        //let result = n;
        if ( this.resources.length - n > 0 ) {            
            //this.pop -= n;
        }
        else {
            //result = this.pop;
            //this.pop = 0;
        }
        return 3;//result;
    }
}

class HUD {
    constructor() {

    }
    update(resource) {
        document.getElementById(resource.type).innerText = resource.output;
        //console.log(resource);
    }
}
const hud = new HUD();

//const population = new Population();
//population.add(new Human());
//population.addObserver(hud);

const Fe_mine = new Resource(new IronMining());
Fe_mine.assignWorkers(3);//population.get(3));
const ironMines = new ResourceAggregator();
ironMines.add(Fe_mine);

const C_mine = new Resource(new CoalMining());
C_mine.assignWorkers(3);
const coalMines = new ResourceAggregator();
coalMines.add(C_mine);

const W_farm = new Resource(new WheatFarming());
W_farm.assignWorkers(3);
const wheatFarms = new ResourceAggregator();
wheatFarms.add(W_farm);

//const wheatFarms = new ResourceAggregator();
//wheatFarms.add(new Farm("wheat"));

ironMines.addObserver(hud);
coalMines.addObserver(hud);
wheatFarms.addObserver(hud);

function loop(timestamp) {
    ironMines.tick();
    coalMines.tick();
    wheatFarms.tick();
    //population.tick();
    requestAnimationFrame(loop);
}

loop(performance.now());