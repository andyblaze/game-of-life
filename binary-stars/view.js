import { getCanvas } from "./config.js";
import createBridgePath from "./path.js";

export default class View {
    constructor(config) {
        this.cfg = config;
        this.canvas = getCanvas();
        this.ctx = this.canvas.getContext("2d");
    }
    draw(data) {
        const path = createBridgePath(data[1], data[2]);
        for ( const d of data ) {
            d.draw(this.ctx);
        }
        // Example: draw 10 sample points along the path
        for (let i = 0; i <= 10; i++) {
            const t = i / 10;
            const {x, y} = path(t);
            const sx = this.canvas.width / 2 + x * this.cfg.visualScale;
            const sy = this.canvas.height / 2 + y * this.cfg.visualScale;
            this.ctx.fillStyle = "rgba(255,255,255,1)";
            this.ctx.fillRect(sx, sy, 1, 1); // small visual placeholder
        }
    }
}