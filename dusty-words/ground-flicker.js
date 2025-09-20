import CONFIG from "./config.js";
import { clamp, mt_rand } from "./functions.js";

export default class GroundFlicker {
    constructor(config) {
        this.config = config;
        this.width = config.SCREEN_W - config.marginX * 2;
        this.height = config.height; 
        this.x = config.marginX;
        this.y = config.height;

        this.cells = [];
        this.time = 0;

        // Initialize random cell centers within region
        for (let i = 0; i < config.numCells; i++) {
            this.cells.push({
                x: this.x + Math.random() * this.width,
                y: this.y + mt_rand(this.height, config.SCREEN_H),//Math.random() * this.height,
                phase: Math.random() * Math.PI * 2  // random phase for flicker
            });
        }
    }
    update(dt) {
        this.time += dt;

        // Optionally jitter cell centers slightly
        for (let cell of this.cells) {
            cell.x += (Math.random() - 0.5) * this.config.jitter;
            cell.y += (Math.random() - 0.5) * this.config.jitter;

            // keep cells within bounds
            cell.x = clamp(cell.x, this.x, this.x + this.width); //Math.min(Math.max(cell.x, this.x), this.x + this.width);
            cell.y = clamp(cell.y, this.y, this.y + this.height);//Math.min(Math.max(cell.y, this.y), this.y + this.height);
        }
    }
    draw(ctx) {
        //const ctx = this.ctx;
        ctx.save();
        ctx.globalCompositeOperation = this.config.blendMode;

        for (let cell of this.cells) {
            // compute flicker using sine wave
            const flicker = Math.sin(this.time * this.config.flickerSpeed + cell.phase);
            const lightness = clamp(this.config.baseLightness + flicker * this.config.flickerAmplitude, 0, 90);
            // draw a soft circular cell
            const gradient = ctx.createRadialGradient(cell.x, cell.y, 0, cell.x, cell.y, this.height / 2);
            gradient.addColorStop(0, `hsla(40,80%,${lightness + 10}%,0.3)`);
            gradient.addColorStop(0.5, `hsla(40,80%,${lightness + 10}%,0.2)`);
            gradient.addColorStop(1, `hsla(40,50%,${lightness}%,0)`);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(cell.x, cell.y, this.height / 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}
