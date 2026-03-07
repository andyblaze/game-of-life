class PinchForce {
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
class RotationForce {
    constructor(cfg) {
        this.cx = cfg.centerX;
        this.cy = cfg.centerY;
        this.force = cfg.rotation_force;
    }
    reset(cfg) {
        this.force = cfg.rotation_force;
    }
    update(t, pos) {
        if ( this.force === 0 ) return;
        const dx = pos.x - this.cx;
        const dy = pos.y - this.cy;
        const angle = t * this.force;   

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const rx = dx * cos - dy * sin;
        const ry = dx * sin + dy * cos;

        pos.x = this.cx + rx;
        pos.y = this.cy + ry;
    }
}

export default class Forces {
    constructor(cfg) {
        this.cfg = cfg;
        this.forces = [
            new RotationForce(cfg),
            new PinchForce(cfg)
        ];
    }
    update(t, pos) {
        for ( const f of this.forces ) {
            f.update(t, pos);
        }
    }
    reset() {
        for ( const f of this.forces ) {
            f.reset(this.cfg);
        }
    }
}