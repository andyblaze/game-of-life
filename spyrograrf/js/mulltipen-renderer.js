import { HSLAString } from "./functions.js";

export default class MultiPenRenderer {
    constructor(cfg) { 
        this.cfg = cfg;

        // Two pens: main and offset
        this.pens = [
            { prev: null, color: { ...cfg.color_start }, offsetX: 0, offsetY: 0 },
            { prev: null, color: { ...cfg.color_start }, offsetX: 100, offsetY: 100 } // small offset for second pen
        ];

        this.cfg.ctx.lineWidth = 0.5;
    }

    draw(px, py, dt) {
        const ctx = this.cfg.ctx;

        for (const pen of this.pens) {
            const x = px + pen.offsetX;
            const y = py + pen.offsetY;

            if (pen.prev) {
                ctx.beginPath();
                ctx.moveTo(pen.prev.x, pen.prev.y);
                ctx.lineTo(x, y);
                ctx.strokeStyle = HSLAString(pen.color);
                ctx.stroke();
            }

            pen.prev = { x, y };
        }
    }

    reset() {
        for (const pen of this.pens) {
            pen.prev = null;
        }
    }
}
