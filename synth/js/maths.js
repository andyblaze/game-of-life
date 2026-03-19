export default class Maths {
    constructor(cfg) {
        this.cfg = cfg;
    }
    getPosition(tt) {
        const cfg = this.cfg;
        return { 
            x: (cfg.R - cfg.r) * Math.cos(tt) + cfg.r * Math.cos((cfg.R / cfg.r) * tt * cfg.ratio),
            y: (cfg.R - cfg.r) * Math.sin(tt) - cfg.r * Math.sin((cfg.R / cfg.r) * tt * cfg.ratio)
        };
    }
    getComplexity() {
        return Math.abs(this.cfg.R - this.cfg.r) + this.cfg.ratio * 10;
    }
}