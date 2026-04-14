import ResourceAggregator from "../base-classes/resource-aggregator.js";

export default class ObjectFactory {
    constructor(r, b, g) {
        this.registry = r;
        this.balance = b;
        this.grid = g;
    }
    getCtor(registry, type) {
        const Ctor = registry[type];
        if ( !Ctor ) throw new Error(`ObjectFactory.create(type) : Unknown type: ${type} Typo ?`);
        return Ctor;
    }
    getBaseOutput(type) {
        return this.balance.outputs[type];
    }
    getInputs(type) {
        return this.balance.inputs[type] || {};
    }
    getRandomTile(type) {
        if ( type === "bread" || type === "power" )
            return this.grid.randomTile();
        return this.grid.randomTile(type);
    }
    createFarm(type) {
        const Ctor = this.getCtor(this.registry.buildings, type);
        const baseOutput = this.getBaseOutput(type);
        const tile = this.grid.randomTile(type);
        return new Ctor(type, tile, baseOutput);
    }
    create(type) {
        const Ctor = this.getCtor(this.registry.buildings, type);
        const baseOutput = this.getBaseOutput(type);
        const inputs = this.getInputs(type);
        const tile = this.getRandomTile(type);
        return new ResourceAggregator(new Ctor(type, tile, baseOutput, inputs));
    }
    createPopulation(type, n, actors) {
        const Ctor = this.getCtor(this.registry.populations, type);
        return new Ctor(n, actors);
    }
}