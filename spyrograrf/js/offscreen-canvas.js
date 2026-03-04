export default class OffScreenCanvas {
    constructor(cfg) {
        this.cfg = cfg;
        this.canvas = document.createElement("canvas");
        this.canvas.width = cfg.canvasWidth;
        this.canvas.height = cfg.canvasHeight;
        this.ctx = this.canvas.getContext("2d");
    }
    clear() {
        this.ctx.clearRect(0, 0, this.cfg.canvasWidth, this.cfg.canvasHeight);
    }
}
