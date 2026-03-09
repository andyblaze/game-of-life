export default class GravityForce {
    constructor(cfg) {
        this.cfg = cfg;

        this.gx = cfg.centerX;
        this.gy = cfg.centerY;

        this.strength = cfg.gravity_force;
    }

    reset(cfg) {
        this.strength = cfg.gravity_force;
    }

    update(t, pos) {
        if ( this.strength === 0 ) return;

        // vector toward gravity well
        const dx = this.gx - pos.x;
        const dy = this.gy - pos.y;

        // distance squared (avoids sqrt and feels nicer)
        const dist2 = dx*dx + dy*dy + 1;

        // inverse-square style falloff
        const pull = this.strength * 2000 / dist2;

        pos.x += dx * pull;
        pos.y += dy * pull;
    }
}