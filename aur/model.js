import Aurora from "./aurora.js";

export default class Model {
    constructor(cfg) {
        this.global = cfg.global();
        this.cfg = cfg;
        this.auroras = [];
        this.initAuroras(cfg);
    }
    initAuroras(cfg) {
        for (let i = 0; i < this.global.numLights; i++) { 
            const t = cfg.getRandom();
            this.auroras.push(new Aurora(cfg, t));
        }
    }
    /*resolveInteraction(a, b) {
        a.archetype.interact(a, b);
        b.archetype.interact(b, a); 
    }*/   
    tick() {
        this.auroras.forEach(a => a.update());
        return this.auroras;
    }
}