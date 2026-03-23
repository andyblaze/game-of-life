import { mt_rand } from "./functions.js";
import { Observable } from "./util-classes.js";

export default class ResourceAggregator extends Observable {
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