import { FarmedResource } from "./resources.js";
import ResourceAggregator from "./resource-aggregator.js";

export default class ResourceFactory {
    createFarmedResource(type) {
        return new FarmedResource(type);
    }
    createAggregator(type, cfg) {
        const res = this.createFarmedResource(type);
        const agg = new ResourceAggregator(cfg);
        agg.add(res);
        return agg;
    }
}