import BaseRenderer from "./cls-baserenderer.js";
import { HSLAString, randomFrom } from "./functions.js";

export default class RepulsorRenderer {
    static type = "repulsor";

    constructor() {
        this.weakmap = new WeakMap();
        this.strength = 0.5; // tweakable repulsion constant
    }

draw(particles, ctx) {

    // Find existing repulsor
    let repulsor = null;

    particles.forEach(p => {
        if (this.weakmap.get(p)) {
            repulsor = p;
        }
    });

    // If none exists, choose one and mark it
    if (!repulsor) {
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

        let force = this.strength / distSq;

        p.vel.x += dx * force;
        p.vel.y += dy * force;
    });

    // Draw
    particles.forEach(p => {
        ctx.fillStyle = HSLAString(p.color);
        ctx.beginPath();
        ctx.arc(p.pos.x, p.pos.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
}
}

BaseRenderer.register(RepulsorRenderer);