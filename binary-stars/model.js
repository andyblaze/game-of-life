import Star from "./star-class.js";
import Simulation from "./sim-class.js";

export default class Model {
    constructor(config) {
        this.starA = new Star(config, { mass: config.M1, radius: 4, hue: 40 }); // !!!!!!! FIX RADIUS !!!!!!
        this.starB = new Star(config, {mass: config.M2,  radius: 12, hue: 200 });
        this.sim = new Simulation(config);
        this.sim.initBinary(this.starA, this.starB);
    }
    update(dt) {
        // subdivide the time-step for stability/accuracy
        const sub = 4;
        const sdt = dt / sub;
        for ( let i = 0; i < sub; i++ ) {
            this.sim.integrateStars(sdt, this.starA, this.starB);  // !!!!!!!!!! PUT STARS INTO SIM OBJECT ? !!!!!!
        }        
        return [this.sim, this.starA, this.starB];
    }
}