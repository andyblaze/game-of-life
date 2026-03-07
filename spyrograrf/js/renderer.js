import { lerpHSLAColor, HSLAString } from "./functions.js";

class ColorTween {
    constructor(cfg, speed = 0.2) {
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
        this.phase += this.speed * dt;

        let cycle = this.phase % 2;
        let t = cycle > 1 ? 2 - cycle : cycle;

        return lerpHSLAColor(this.start, this.end, t);
    }
}


export default class Renderer {
    constructor(cfg) { 
        this.cr = new ColorTween(cfg);
        this.cfg = cfg;
        this.prev = null;
        this.cfg.ctx.lineWidth = 0.5;          
        this.color = cfg.color_start;                     
    }
    draw(px, py, dt) {
        if ( this.prev ) {
            this.color = this.cr.update(dt);
            const ctx = this.cfg.ctx;

            ctx.beginPath();
            ctx.moveTo(this.prev.x, this.prev.y);
            ctx.lineTo(px, py);

            ctx.strokeStyle = HSLAString(this.color);
            ctx.stroke();
        }
        this.prev = { x: px, y: py };
    }

    reset() {
        this.prev = null;
        this.cr.reset(this.cfg);
        //this.baseHue = 0;
    }
}
/*class Renderer {
    constructor(cfg) {
        this.cfg = cfg;
        this.prev = null;
        this.cfg.ctx.lineWidth = 0.5;
        this.cfg.ctx.strokeStyle = "#ff0000";
    }
    draw(px, py) {
        if ( this.prev ) {
            this.cfg.ctx.beginPath();
            this.cfg.ctx.moveTo(this.prev.x, this.prev.y);
            this.cfg.ctx.lineTo(px, py);
            this.cfg.ctx.stroke();
        }
        this.prev = { x: px, y: py };
    }
    reset() {
        this.prev = null;
    }
}*/
