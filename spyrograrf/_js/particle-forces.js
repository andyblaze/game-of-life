import AttractorForce from "./attractor-force.js";
import RepulsorForce from "./repulsor-force.js";
import VortexForce from "./vortex-force.js";
import GravityForce from "./gravity-force.js";
import BoidsForce from "./boids-force.js";

export default class ParticleForces {
    constructor(cfg) { 
        this.cfg = cfg;
        this.forces = {
            repulsor: new RepulsorForce(cfg),
            attractor: new AttractorForce(cfg),
            vortex: new VortexForce(cfg),
            gravity: new GravityForce(cfg),
            boids: new BoidsForce(cfg)
        }
    }
    apply(particles) {
        for ( const [key, force] of Object.entries(this.forces) ) {
            if ( particles.length > 0 )
                force.apply(particles);
        }
    }
    set(key, val) {}
}