import Particle from "./particle.js";

export default class SprayFX {
    constructor(x, y, config) {
        this.isActive = true;
        this.particles = [];
        for ( let i = 0; i < config.count; i++ ) {
            this.particles.push(new Particle(x, y, config));
        }
    }
    getParticle(idx) {
        return this.particles[idx];
    }
    updateAndDraw(dt, ctx) {
        let allActive = true;
        for ( const p of this.particles ) {
            const active = p.update(dt);
            if (active) 
                p.draw(ctx);
            else 
                allActive = false;
        }
        this.isActive = allActive;
    }
    active() {
        return this.isActive;
    }
    inActive() {
        return ! this.isActive;
    }
}