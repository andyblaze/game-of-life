class Resource {
    constructor(r) {
        this.output = 0;
        this.resource = r;
        this.workers = 0;

    }
    tick() {
        this.output += 1 * this.workers;
    }
    assignWorkers(num) {
        this.workers += num;
    }
}
class Mine extends Resource {
    constructor(r) {
        super(r);
    }
}

class Farm extends Resource {
    constructor(r) {
        super(r);
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

class HUD {
    constructor() {

    }
    update(resource) {
        document.getElementById(resource.type).innerText = resource.output;
        //console.log(resource);
    }
}
const hud = new HUD();

const mine = new Mine("iron");
mine.assignWorkers(3);
const ironMines = new ResourceAggregator();
ironMines.add(mine);

const coalMines = new ResourceAggregator();
coalMines.add(new Mine("coal"));

const wheatFarms = new ResourceAggregator();
wheatFarms.add(new Farm("wheat"));

ironMines.addObserver(hud);
coalMines.addObserver(hud);
wheatFarms.addObserver(hud);

function loop(timestamp) {
    ironMines.tick();
    coalMines.tick();
    wheatFarms.tick();
    requestAnimationFrame(loop);
}

loop(performance.now());