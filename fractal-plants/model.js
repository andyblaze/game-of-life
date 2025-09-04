import Plant from "./plant.js";

export default class Model {
    constructor(cfg) {
        this.global = cfg.global();
        this.cfg = cfg;
        this.plants = [];
        this.initPlants(cfg);
    }
    initPlants(cfg) {
        for (let i = 0; i < this.global.numPlants; i++) { 
            const t = cfg.data.types[i];
            this.plants.push(new Plant(cfg, t));
        }
    }
    /*resolveInteraction(a, b) {
        a.archetype.interact(a, b);
        b.archetype.interact(b, a); 
    }*/   
    tick() {
        this.plants.forEach(p => p.update());
        return this.plants;
    }
}