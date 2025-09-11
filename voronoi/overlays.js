
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