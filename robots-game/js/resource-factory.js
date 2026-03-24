import { FarmedResource } from "./resources.js";
import ResourceAggregator from "./resource-aggregator.js";
import MessageSystem from "./message-system.js";
import Population from "./population.js";

export default class ResourceFactory {
    constructor(cfg) {
        //this.cfg = cfg;
        this.messageSystem = new MessageSystem(cfg);
    }
    createFarmedResource(type) {
        return new FarmedResource(type, this.messageSystem);
    }
    createAggregator(type) {
        const res = this.createFarmedResource(type);
        const agg = new ResourceAggregator();
        agg.add(res);
        return agg;
    }
    createPopulation() {
        return new Population(this.messageSystem);
    }
}