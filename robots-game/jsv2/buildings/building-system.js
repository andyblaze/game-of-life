export default class BuildingSystem { 
    constructor(w, f, cfg) {
        this.world = w;
        this.factory = f;
        this.cfg = cfg;
        this.buildings = {};
    }
    buildFarm(e) {
        const type = e.currentTarget.dataset.type;
        this.world.addToAggregator(this.factory.createFarm(type));
        const evt = { type: "state-change", source: "builder", state: `new ${type} building` };
        this.world.emitEvent(evt);
    }
    render(ctx, timers) {
        const buildingTypes = this.world.items; //console.log(buildingTypes); 
        for ( const [type, building] of Object.entries(buildingTypes) ) { //console.log(type, building);
            for ( const b of building.resources ) {
                b.actor.render(ctx, timers);
            }
        }
    }
}
