import { HSLAString } from "./functions.js";

export default class Renderer {
    constructor(cfg) { 
        this.cfg = cfg;
        this.prev = null;
        this.cfg.ctx.lineWidth = 0.5;          
        this.color = cfg.color_start;                     
    }
    draw(px, py, dt) {
        if ( this.prev ) {
            const ctx = this.cfg.ctx;

            ctx.beginPath();
            ctx.moveTo(this.prev.x, this.prev.y);
            ctx.lineTo(px, py);

            ctx.strokeStyle = HSLAString(this.color);
            ctx.stroke();
        }
        this.prev = { x: px, y: py };
    }
    getColorAlpha() {
        return this.color.a;
    }
    setColorAlpha(a) {
        this.color.a = a;
    }
    reset() {
        this.prev = null;
    }
}
