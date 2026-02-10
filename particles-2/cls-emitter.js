import { mt_randf } from "./functions.js";
import Particle from "./cls-particle.js";

export default class Emitter {
    constructor(x, y) {
        this.pos = { x, y };
        this.particles = [];
    }

    spawnParticle(cfg) {
        const p = new Particle(
            this.pos.x,
            this.pos.y,
            mt_randf(-0.5, 0.5),   // vx
            mt_randf(-1, -0.5),    // vy upward
            mt_randf(1, 2),        // life
            { h: 30, s: 100, l: 50, a: 1 }, // color
            cfg.size         // radius
        );
        this.particles.push(p);
    }

    update(cfg, dt) {
        this.spawnParticle(cfg);
        this.particles.forEach(p => p.update(dt));
        // remove dead particles
        this.particles = this.particles.filter(p => p.isAlive());
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }
}
