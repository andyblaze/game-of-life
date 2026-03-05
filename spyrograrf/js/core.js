export default class Core {
    constructor(cfg) {
        this.cfg = cfg;
        // core parameters
        this.R = cfg.outerRadius;
        this.r = cfg.innerRadius;
        this.d = cfg.penOffset;
        this.t = cfg.theta;
        this.pos = { };
    }
    update(dt) {
        this.t += dt;
    }
    getPoint(t) {
        const x = (this.R - this.r) * Math.cos(t)
                + this.d * Math.cos(((this.R - this.r) / this.r) * t);

        const y = (this.R - this.r) * Math.sin(t)
                - this.d * Math.sin(((this.R - this.r) / this.r) * t);

        return {
            x: this.cfg.centerX + x,
            y: this.cfg.centerY + y
        };
    }
}
