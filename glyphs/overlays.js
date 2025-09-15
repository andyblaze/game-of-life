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
    seedX: Math.random() * 1000,
    seedY: Math.random() * 1000,
    // fixed appearance
    size: 0.5 + Math.random() * 1.5,               // 0.5–2px
    hue: [60, 180, 200, 220, 260][Math.floor(Math.random() * 4)], // aqua → indigo
    light: 70 + Math.random() * 20,                // 70–90%
    alpha: 0.3 + Math.random() * 0.4               // 0.3–0.7
});
        }
    }

    update(deltaTime, perlin) {
        this.time += deltaTime;

        // Move plankton
this.plankton.forEach(p => {
    const nx = perlin.noise(this.time * 0.0001, p.seedX, 0);
    const ny = perlin.noise(this.time * 0.0001, p.seedY, 0);

    // Map noise [-1,1] → small drift
    const dx = (nx - 0.5) * 0.5; // adjust multiplier for strength
    const dy = (ny - 0.5) * 0.2;

    p.x += dx;
    p.y += dy;

    // wrap around edges
    if (p.x < 0) p.x = this.cfg.canvasWidth;
    if (p.x > this.cfg.canvasWidth) p.x = 0;
    if (p.y < 0) p.y = this.cfg.canvasHeight;
    if (p.y > this.cfg.canvasHeight) p.y = 0;
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
    ctx.fillStyle = `hsla(${p.hue}, 80%, ${p.light}%, ${p.alpha})`;
    ctx.fillRect(p.x, p.y, p.size, p.size);
});
    }
}

