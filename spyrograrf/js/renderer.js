import { lerpHSLAColor, HSLAString } from "./functions.js";

class ColorTween {
    constructor(start, end, alpha, speed = 0.2) {
        this.start = { ...start, a: alpha };
        this.end   = { ...end,   a: alpha };
        this.speed = speed;
        this.phase = 0;
    }
    reset(cfg) {
        
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
        this.cr = new ColorTween(cfg.color_start, cfg.color_end, cfg.alpha);
        this.cfg = cfg;
        this.prev = null;
        this.cfg.ctx.lineWidth = 0.5;          // thin lines for dense patterns
        this.color = cfg.color_start;                     // starting hue
        //this.alpha = cfg.alpha;                      // low alpha to prevent mud
        //this.hueStep = 0.5;                    // hue change per segment
    }
    draw(px, py, dt) {
        if (this.prev) {
            this.color = this.cr.update(dt);
            const ctx = this.cfg.ctx;

            ctx.beginPath();
            ctx.moveTo(this.prev.x, this.prev.y);
            ctx.lineTo(px, py);

            // HSL rainbow stroke
            ctx.strokeStyle = HSLAString(this.color);
            ctx.stroke();

            // Increment hue for next segment
            //this.baseHue += this.hueStep;
            //if (this.baseHue >= 360) this.baseHue -= 360;
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
