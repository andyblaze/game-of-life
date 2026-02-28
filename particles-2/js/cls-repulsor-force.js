import { randomFrom } from "./functions.js";

export default class RepulsorForce {
    static type = "repulsor";

    constructor(cfg) {
        this.cfg = cfg;
        this.baseStrength = 0.5;
        this.weakmap = new WeakMap();
    }
    apply(particles) {
        const strength = this.baseStrength * this.cfg.repulsor; 
        // Find existing repulsor
        let repulsor = null;

        particles.forEach(p => {
            if (this.weakmap.get(p)) {
                repulsor = p;
            }
        });
        // If none exists, choose one and mark it
        if ( ! repulsor ) {
            repulsor = randomFrom(particles);
            this.weakmap.set(repulsor, true);
        }
        // Apply repulsion
        particles.forEach(p => {
            if (p === repulsor) return;

            let dx = p.pos.x - repulsor.pos.x;
            let dy = p.pos.y - repulsor.pos.y;
            let distSq = dx * dx + dy * dy;
            distSq = Math.max(distSq, 0.01);

            let force = strength / distSq;

            p.vel.x += dx * force;
            p.vel.y += dy * force;
        });
    }
}
