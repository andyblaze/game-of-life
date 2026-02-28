export default class VortexForce {
    static type = "vortex";

    constructor(cfg) {
        this.cfg = cfg;
        this.baseStrength = 0.005; // tweak this
        this.centerX = cfg.canvasCenter.x;
        this.centerY = cfg.canvasCenter.y;
    }

    apply(particles) {
        const strength = this.baseStrength * this.cfg.vortex; 
        particles.forEach(p => {
            // Vector from center to particle
            let dx = p.pos.x - this.centerX;
            let dy = p.pos.y - this.centerY;

            let distSq = dx * dx + dy * dy;
            distSq = Math.max(distSq, 0.01);

            // Perpendicular vector (rotate 90°)
            let perpX, perpY;

            perpX = dy;
            perpY = -dx;

            // Optional falloff (inverse distance, not square)
            let dist = Math.sqrt(distSq);
            let force = strength / dist;

            p.vel.x += perpX * force;
            p.vel.y += perpY * force;
        });
    }
}