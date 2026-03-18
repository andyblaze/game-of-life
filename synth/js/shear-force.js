export default class ShearForce {

    constructor(cfg) {
        this.cfg = cfg;
        this.cx = cfg.centerX;
        this.cy = cfg.centerY;

        this.strength = cfg.shear_force;
    }

    reset() {
        this.strength = this.cfg.shear_force;
    }

    update(t, pos) {

        if (this.strength === 0) return;

        // work relative to centre
        const dx = pos.x - this.cx;
        const dy = pos.y - this.cy;

        // apply shear
        const sx = dx + dy * this.strength;
        const sy = dy;

        // restore to world coordinates
        pos.x = this.cx + sx;
        pos.y = this.cy + sy;
    }
}