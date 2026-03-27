import { FarmedResource } from "./resources.js";
import ResourceAggregator from "./resource-aggregator.js";
import MessageSystem from "./message-system.js";
import Population from "./population.js";
import { Consumer } from "./consumers.js";

export default class ResourceFactory {
    constructor(cfg, economy) {
        //this.cfg = cfg;
        this.economy = economy;
        this.messageSystem = new MessageSystem(cfg);
    }
    createFarmedResource(type) {
        return new FarmedResource(type, this.messageSystem);
    }
    createAggregator(type) {
        const res = this.createFarmedResource(type);
        const agg = new ResourceAggregator(this.economy);
        agg.add(res);
        return agg;
    }
    createPopulation() {
        return new Population(this.messageSystem);
    }
    createConsumer(farms, type, consumptionRate) {
        return new Consumer(farms, type, consumptionRate);
    }
}