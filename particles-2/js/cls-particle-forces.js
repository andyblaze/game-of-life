import AttractorForce from "./cls-attractor-force.js";
import RepulsorForce from "./cls-repulsor-force.js";
import VortexForce from "./cls-vortex-force.js";
import GravityForce from "./cls-gravity-force.js";

export default class ParticleForces {
    constructor(cfg) { 
        this.cfg = cfg;
        this.forces = {
            repulsor: new RepulsorForce(cfg),
            attractor: new AttractorForce(cfg),
            vortex: new VortexForce(cfg),
            gravity: new GravityForce(cfg)
        }
    }
    apply(particles) {
        for ( const [key, force] of Object.entries(this.forces) ) {
            force.apply(particles);
        }
    }
    set(key, val) {}
}