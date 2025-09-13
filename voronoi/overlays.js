import { mt_rand } from "./functions.js";

export class FullScreenOverlay {
    constructor({ color = "255, 0, 0", min = 0.05, max = 0.2, speed = 0.025, scale = 0.25 } = {}) {
        this.color = color;
        this.min = min;
        this.max = max;
        this.speed = speed;
        this.scale = scale;

        this._elapsed = 0;
        this._opacity = (this.max - this.min) / 2;

        // --- pre-render setup ---
        this.buffer = document.createElement("canvas");
        this.buffer.width = window.innerWidth * this.scale;
        this.buffer.height = window.innerHeight * this.scale;
        this.bufCtx = this.buffer.getContext("2d");

        // fill buffer once (solid color, full alpha)
        this.bufCtx.fillStyle = `rgb(${this.color})`;
        this.bufCtx.fillRect(0, 0, this.buffer.width, this.buffer.height);
    }

    update() {
        this._elapsed = (this._elapsed + this.speed) % (Math.PI * 2);
        const amplitude = (this.max - this.min) / 2;
        const midpoint = (this.max + this.min) / 2;
        this._opacity = midpoint + amplitude * Math.sin(this._elapsed);
    }

    draw(ctx, width, height) {
        this.update();
        ctx.save();
        ctx.globalAlpha = this._opacity;
        ctx.drawImage(this.buffer, 0, 0, width, height); // scaled blit
        ctx.restore();
    }
}

export class GodRay {
    constructor(cfg) {
        this.cfg = cfg;
        this.time = 0;

        // Optional plankton positions
        this.plankton = [];
        for (let i = 0; i < (cfg.planktonCount); i++) {
this.plankton.push({
    x: Math.random() * cfg.canvasWidth,
    y: Math.random() * cfg.canvasHeight,
    speed: 0.1 + Math.random() * 0.3,   // vertical speed
    drift: (Math.random() - 0.5) * 0.05 // horizontal drift speed
});
        }
    }

    update(deltaTime) {
        this.time += deltaTime;

        // Move plankton
this.plankton.forEach(p => {
    p.y += p.speed;
    p.x += p.drift;

    // wrap around
    if (p.y > this.cfg.canvasHeight) {
        p.y = 0;
        p.x = Math.random() * this.cfg.canvasWidth;
    }
    if (p.x < 0) p.x = this.cfg.canvasWidth;
    if (p.x > this.cfg.canvasWidth) p.x = 0;
});
    }

    draw(ctx) {
        const {canvasWidth, canvasHeight, baseHue} = this.cfg;
        const t = this.time;

        // === Gradient drift (water light field) ===
        const drift = Math.sin(t * 0.0002) * 50; // ±50px gentle drift
        const g = ctx.createLinearGradient(drift, 0, canvasWidth + drift, canvasHeight);

        g.addColorStop(0,   `hsla(${baseHue + Math.sin(t*0.0005)*10}, 70%, 50%, 0.02)`);
        g.addColorStop(0.5, `hsla(${baseHue + Math.sin(t*0.0007)*10}, 70%, 50%, 0.03)`);
        g.addColorStop(1,   `hsla(${baseHue + Math.sin(t*0.0006)*10}, 70%, 50%, 0.02)`);

        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // === Plankton ===
        this.plankton.forEach(p => {
            let px = p.x;
            let py = p.y;

            if (this.cfg.planktonDrift) {
                // Drift horizontally with water "currents"
                //px += Math.sin(this.time * p.driftSpeed + p.driftPhase) * p.driftAmp;
            }

            ctx.fillStyle = 'hsla(60, 80%, 90%, 0.9)';
            ctx.fillRect(px, py, 3, 3);
        });
    }
}

