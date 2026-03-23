import ResourceAggregator from "./resource-aggregator.js";
import { Human } from "./resources.js";
import { HumanBehaviour } from "./strategies.js";

export default class Population extends ResourceAggregator {
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
    add(n) {
        for ( let i = 0; i < n; i++ ) {
            let r = new Human(new HumanBehaviour());
            this.resources.push(r);
            this.resource = r.resource;
        }
    }
}