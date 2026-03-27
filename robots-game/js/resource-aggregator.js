import { Observable } from "./util-classes.js";

export default class ResourceAggregator extends Observable {
    constructor() {     
        super();  
        this.resources = [];
        this.output = 0;
        this.resource = "";
    }
    tick() {
        let msg = {};
        for( const r of this.resources ) {
            r.tick();
            this.output += this.resources.reduce((sum, r) => sum + r.output, 0);
            msg = r.msg;
        }
        this.notify([{ type: this.resource, output: this.output }, msg]);
    }
    add(r) {
        this.resources.push(r);
        this.resource = r.resource;
    }
    assignWorkers(idx, n, pop) {
        this.resources[idx].assignWorkers(n, pop);
    }
    getResource(n) {
        if ( this.output - n < 0 ) return 0;
        this.output -= n;
        return n;
    }
    resourceName() {
        return this.resource;
    }
}