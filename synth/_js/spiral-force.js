export default class SpiralForce {
    constructor(cfg) {
        this.cfg = cfg;

        this.cx = cfg.centerX;
        this.cy = cfg.centerY;

        this.strength = cfg.spiral_force * 10;
    }

    reset(cfg) {
        this.strength = cfg.spiral_force * 10;
    }

    update(t, pos) {

        // vector from center
        const dx = pos.x - this.cx;
        const dy = pos.y - this.cy;

        const dist = Math.sqrt(dx*dx + dy*dy) || 1;

        // rotate slightly
        const angle = Math.atan2(dy, dx);
        const newAngle = angle + this.strength * 0.02;

        // push outward/inward slightly
        const newDist = dist + this.strength * 0.05;

        pos.x = this.cx + Math.cos(newAngle) * newDist;
        pos.y = this.cy + Math.sin(newAngle) * newDist;
    }
}