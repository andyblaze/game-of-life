export default class RotationForce {
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