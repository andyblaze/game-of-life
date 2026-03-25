import ResourceAggregator from "./resource-aggregator.js";
import { Human } from "./resources.js";
import { HumanBehaviour } from "./strategies.js";

export default class Population extends ResourceAggregator {
    constructor(msgsys) {
        super();
        this.messageSys = msgsys;
    }
    tick() {
        let msg1 = {};
        let msg2 = {};
        for ( const r of this.resources ) {
            r.tick();
            msg1 = r.msg;
        }
        msg2 = this.messageSys.emit("population");
        this.notify([
            { type: "population", output: this.resources.length },
            { type: "morale", output: this.attr("morale") },
            msg1, msg2
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
    add(n) {
        for ( let i = 0; i < n; i++ ) {
            let r = new Human(new HumanBehaviour(), this.messageSys);
            this.resources.push(r);
            this.resource = r.resource;
        }
    }
    getCount() {
        return this.resources.length;
    }
    getAll() {
        return this.resources;
    }
}