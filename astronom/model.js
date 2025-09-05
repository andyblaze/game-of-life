import Item from "./item.js";

export default class Model {
    constructor(cfg) {
        this.global = cfg.global();
        this.cfg = cfg;
        this.items = [];
        this.initItems(cfg);
    }
    initItems(cfg) {
        for (let i = 0; i < this.global.numItems; i++) { 
            const t = cfg.data.types[i];
            this.items.push(new Item(cfg, t));
        }
    } 
    tick() {
        this.items.forEach(i => i.update());
        return this.items;
    }
}