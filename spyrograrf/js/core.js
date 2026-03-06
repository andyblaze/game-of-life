export default class Core {
    constructor(cfg) {
        this.cfg = cfg;
        // core parameters
        this.Rx = cfg.outerRadiusX;
        this.Ry = cfg.outerRadiusY;
        this.angleRad = (cfg.rotation * Math.PI) / 180;
        this.r = cfg.innerRadius;
        this.d = cfg.penOffset;
        this.t = cfg.theta;
        this.pos = { };
    }
    init(cfg) {
        this.Rx = cfg.outerRadiusX;
        this.Ry = cfg.outerRadiusY;
        this.angleRad = (cfg.rotation * Math.PI) / 180;
        this.r = cfg.innerRadius; 
        this.d = cfg.penOffset;   
    }
    update(dt) {
        this.t += dt;
    }
    getPoint(t) {
        const baseX = (this.Rx - this.r) * Math.cos(this.t);
        const baseY = (this.Ry - this.r) * Math.sin(this.t);

        const rot = ((this.Rx - this.r) / this.r) * this.t;

        const penX = this.d * Math.cos(rot);
        const penY = this.d * Math.sin(rot);

        const x = baseX + penX;
        const y = baseY - penY;

        return {
            x: this.cfg.centerX + x,
            y: this.cfg.centerY + y
        };
    }
}
