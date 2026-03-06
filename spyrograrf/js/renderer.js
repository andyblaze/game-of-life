export default class Renderer {
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
}
