import Star from "./star-class.js?gh";
import Simulation from "./sim-class.js";
import ParticleSystem from "./particles-class.js";

export default class Model {
    constructor(config) {
        this.starA = new Star(
            config, 
            { mass: config.M1, radius: 4, colorA: {h:40, s:100, l:70, a:1}, colorB: { h: 10, s: 80, l: 60, a: 1 }, pulseRate: 0.47 }
        ); // !!!!!!! FIX RADIUS !!!!!!
        this.starB = new Star(
            config, 
            {mass: config.M2,  radius: 12, colorA: { h: 170, s: 80, l: 70, a: 1 }, colorB: { h: 210, s: 90, l: 90, a: 1 }, pulseRate: 0.52 }
        );
        this.sim = new Simulation(config);
        this.sim.initBinary(this.starA, this.starB);
        this.particles = new ParticleSystem(this.starA, this.starB, config);
    }
    update(dt) {
        // subdivide the time-step for stability/accuracy
        const sub = 4;
        const sdt = dt / sub;
        for ( let i = 0; i < sub; i++ ) {
            this.sim.integrateStars(sdt, this.starA, this.starB);  // !!!!!!!!!! PUT STARS INTO SIM OBJECT ? !!!!!!
        }
        this.starA.update(dt);
        this.starB.update(dt); 
        this.particles.update(dt);
        return [this.sim, this.starA, this.starB, this.particles];
    }
}