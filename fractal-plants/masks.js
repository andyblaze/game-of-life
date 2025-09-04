import { skyHeight } from "./functions.js";
export class WavyMask {
    constructor(width = 1920, height = 1080, waveY = 520) {
        this.width = width;
        this.height = height;
        this.waveY = waveY;

        // defaults for wave properties
        this.waveCount = 1.5;//20;
        this.waveHeight = 10;
        this.step = 10;
        this.phase = 0;
    }
    setWave({ waveCount = 20, waveHeight = 20, step = 10, phase = 0 } = {}) {
        this.waveCount = waveCount;
        this.waveHeight = waveHeight;
        this.step = step;
        this.phase = phase;
    }
    update(deltaPhase) {
        this.phase = (this.phase + deltaPhase) % (2 * Math.PI);
        if (this.phase < 0) {
            this.phase += 2 * Math.PI;
        }
    }    
    unapply(ctx) {
        ctx.restore();
    }
    apply(ctx, deltaPhase) {
        this.update(deltaPhase);
        this.waveY = skyHeight(ctx.canvas.height) - this.waveHeight;
        ctx.save();
        ctx.beginPath();

        // polygon sides
        ctx.moveTo(this.width, this.height); // bottom-right
        ctx.lineTo(this.width, 0);           // top-right
        ctx.lineTo(0, 0);                    // top-left
        ctx.lineTo(0, this.height);          // bottom-left

        // sine wave bottom
        const waveLength = this.width / this.waveCount;
        /*const slope = 0.01; // pixels of rise per px of width, try 0.05–0.2 for gentle tilt
for (let x = 0; x <= this.width; x += this.step) {
    const baseY = this.waveY + slope * x;  // <-- tilt factor
    const waveY = baseY +
        Math.sin((x / waveLength) * 2 * Math.PI + this.phase) *
        this.waveHeight;
    ctx.lineTo(x, waveY);
}*/
        for (let x = 0; x <= this.width; x += this.step) {
            const y = this.waveY +
                      Math.sin((x / waveLength) * 2 * Math.PI + this.phase) *
                      this.waveHeight;
            ctx.lineTo(x, y);
        }
        ctx.closePath();

        // debug fill to see the mask shape
        ctx.fillStyle = "rgba(0,200,0,0.05)";
        ctx.fill();
        ctx.clip();
    }
}