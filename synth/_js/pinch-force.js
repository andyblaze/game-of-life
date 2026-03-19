export default class PinchForce {
    constructor(cfg) { 
        this.cfg = cfg;
        this.cx = cfg.centerX;
        this.cy = cfg.centerY;
        this.strength = cfg.pinch_force;
    }

    reset() { 
        this.strength = this.cfg.pinch_force;
    }

    update(t, pos) {
        if ( this.strength === 0 ) return;

        // Vector from center → point
        const dx = pos.x - this.cx;
        const dy = pos.y - this.cy;

        const dist = Math.sqrt(dx*dx + dy*dy);

        // Guard against divide-by-zero
        if (dist === 0) return;

        // Normalized direction
        const nx = dx / dist;
        const ny = dy / dist;

        // Pinch factor
        // Larger strength → stronger compression toward center
        const factor = 1 - (this.strength * 0.02);

        // Clamp so we don't invert the geometry
        const scale = Math.max(0.05, factor);

        // New distance after pinch
        const newDist = dist * scale;

        // Move point along the radial direction
        pos.x = this.cx + nx * newDist;
        pos.y = this.cy + ny * newDist;
    }
}