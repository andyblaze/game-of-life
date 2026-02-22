import RepulsorForce from "./cls-repulsor-force.js";
import VortexForce from "./cls-vortex-force.js";

export default class ParticleForces {
    constructor() {
        this.items = {
            repulsor: { active:false, force: new RepulsorForce() },
            vortex: { active: false, force: new VortexForce() }
        }
    }
    apply(particles) {
        for ( const [key, item] of Object.entries(this.items) ) {
            if ( item.active )
                item.force.apply(particles);
        }
    }
    set(key) {
        this.items[key].active = ! this.items[key].active;
    }
}