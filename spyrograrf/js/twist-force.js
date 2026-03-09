export default class TwistForce {
    constructor(cfg) {
        this.cfg = cfg;
        this.cx = cfg.centerX;
        this.cy = cfg.centerY;

        // slider control
        this.strength = cfg.twist_force;
    }

    reset(cfg) {
        this.strength = cfg.twist_force;
    }

    update(t, pos) {
        if ( this.strength === 0 ) return;

        // vector from center
        const dx = pos.x - this.cx;
        const dy = pos.y - this.cy;

        const dist = Math.sqrt(dx*dx + dy*dy);

        // angle of the point around the center
        const angle = Math.atan2(dy, dx);

        // twist amount grows with distance from center
        const twist = this.strength * dist * 0.001;   // tweak scale here

        // new rotated angle
        const newAngle = angle + twist;

        // convert back to cartesian
        pos.x = this.cx + Math.cos(newAngle) * dist;
        pos.y = this.cy + Math.sin(newAngle) * dist;
    }
}