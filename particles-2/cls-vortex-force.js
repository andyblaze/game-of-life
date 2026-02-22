export default class VortexForce {
    static type = "vortex";

    constructor() {
        this.strength = 0.005; // tweakable swirl strength
        this.clockwise = true; // flip for direction
        this.centerX = 360;
        this.centerY = 360;
    }

    apply(particles) {
        particles.forEach(p => {
            // Vector from center to particle
            let dx = p.pos.x - this.centerX;
            let dy = p.pos.y - this.centerY;

            let distSq = dx * dx + dy * dy;
            distSq = Math.max(distSq, 0.01);

            // Perpendicular vector (rotate 90°)
            let perpX, perpY;

            if (this.clockwise) {
                perpX = dy;
                perpY = -dx;
            } else {
                perpX = -dy;
                perpY = dx;
            }

            // Optional falloff (inverse distance, not square)
            let dist = Math.sqrt(distSq);
            let force = this.strength / dist;

            p.vel.x += perpX * force;
            p.vel.y += perpY * force;
        });
    }
}