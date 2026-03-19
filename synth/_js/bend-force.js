export default class BendForce {
    constructor(cfg) {
        this.cfg = cfg;
        this.cx = cfg.centerX;
        this.cy = cfg.centerY;

        // direction of pull
        this.dx = 5; // pixels to pull on X
        this.dy = -3; // pixels to pull on Y

        // strength: 0 = no effect, 1 = full effect
        this.strength = cfg.bend_force;
    }

    reset(cfg) {
        this.strength = cfg.bend_force;
    }

    update(t, pos) {
        if ( this.strength === 0 ) return;
        // distance from center
        const dxC = pos.x - this.cx;
        const dyC = pos.y - this.cy;
        const dist = Math.sqrt(dxC*dxC + dyC*dyC);
        const falloff = dist / 200; // increase with distance
pos.x += this.dx * this.strength * falloff;
pos.y += this.dy * this.strength * falloff;

        // falloff: closer to center gets pulled more, further away less
        //const falloff = 1 / (1 + dist/200); // tweak 200 for radius scale

        // apply pull
        //pos.x += this.dx * this.strength * falloff;
        //pos.y += this.dy * this.strength * falloff;
    }
}