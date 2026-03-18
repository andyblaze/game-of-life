import { lerpHSLAColor } from "./functions.js";

export default class ColorTween {
    constructor(cfg, speed = 0.02) {
        this.cfg = cfg;
        this.reset();
        this.speed = speed;
    }
    reset() {
        this.start = { ...this.cfg.color_start, a: this.cfg.alpha };
        this.end   = { ...this.cfg.color_end,   a: this.cfg.alpha };
        this.phase = 0;
    }
    update(dt) {
        this.start = { ...this.cfg.color_start, a: this.cfg.alpha };
        this.end   = { ...this.cfg.color_end,   a: this.cfg.alpha };
        this.phase += this.speed * dt;

        let cycle = this.phase % 2;
        let t = cycle > 1 ? 2 - cycle : cycle;

        return lerpHSLAColor(this.start, this.end, t);
    }
}
