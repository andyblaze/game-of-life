export default class BuildingSystem { 
    constructor(w, f) {
        this.world = w;
        this.factory = f;
        this.buildings = {};
    }
    buildFarm(e) {
        const type = e.currentTarget.dataset.type;
        this.world.addToAggregator(this.factory.createFarm(type));
        const evt = { type: "state-change", source: "builder", state: `new ${type} building` };
        this.world.emitEvent(evt);
    }
    render() {
        this.buildings = this.world.items;
        //console.log(this.buildings.iron);
    }
}
