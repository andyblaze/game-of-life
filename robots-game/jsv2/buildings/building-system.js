export default class BuildingSystem { 
    constructor(w, f) {
        this.world = w;
        this.factory = f;
    }
    buildFarm(e) {
        const type = e.currentTarget.dataset.type;
        this.world.addToAggregator(this.factory.createFarm(type));
        const evt = { type: "state-change", source: "builder", state: `new ${type} building` };
        this.world.emitEvent(evt);
    }
}
