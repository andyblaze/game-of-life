import { randomFrom } from "./functions.js";

export default class AttractorForce {
    static type = "attractor";

    constructor() {
        this.weakmap = new WeakMap();
        this.strength = 0.1; // tweakable attraction constant
    }

    apply(particles) {
        // Find existing attractor
        let attractor = null;
        particles.forEach(p => {
            if (this.weakmap.get(p)) {
                attractor = p;
            }
        });

        // If none exists, pick one and mark it
        if (!attractor) {
            attractor = randomFrom(particles);
            this.weakmap.set(attractor, true);
        }

        // Apply attraction
        particles.forEach(p => {
            if (p === attractor) return;

            let dx = attractor.pos.x - p.pos.x; // note inverted vector
            let dy = attractor.pos.y - p.pos.y;
            let distSq = dx * dx + dy * dy;
            distSq = Math.max(distSq, 0.01);

            let force = this.strength / distSq;

            p.vel.x += dx * force;
            p.vel.y += dy * force;
        });
    }
}