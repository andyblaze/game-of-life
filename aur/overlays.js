
export class WavyMask {
    constructor({ canvasWidth, canvasHeight, topY = 400, waveAmplitude = 40, waveLength = 150, softEdge = 50 } = {}) {
        this.width = canvasWidth;
        this.height = canvasHeight;
        this.topY = topY;
        this.waveAmplitude = waveAmplitude;
        this.waveLength = waveLength;
        this.softEdge = softEdge;

        this._phase = 0; // for animation if needed

        // create offscreen canvas
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d");

        this._buildMask();
    }

    _buildMask() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        const waveCount = Math.ceil(this.width / this.waveLength);

        // main mask shape
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.moveTo(0, this.topY);

        for (let i = 0; i <= waveCount; i++) {
            const x = i * this.waveLength;
            const y = this.topY + this.waveAmplitude * Math.sin((i / waveCount) * Math.PI * 2 + this._phase);
            ctx.lineTo(x, y);
        }

        ctx.lineTo(this.width, this.height);
        ctx.lineTo(0, this.height);
        ctx.closePath();
        ctx.fill();

        // soft vertical gradient at top
        const grad = ctx.createLinearGradient(0, this.topY, 0, this.topY + this.softEdge);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(1, "rgba(255,255,255,1)");
        ctx.globalCompositeOperation = "destination-in";
        ctx.fillStyle = grad;
        ctx.fillRect(0, this.topY, this.width, this.height - this.topY);
        ctx.globalCompositeOperation = "source-over";
    }

    update(phaseDelta = 0) {
        this._phase += phaseDelta;
        this._buildMask();
    }

    draw(ctx) {
        ctx.drawImage(this.canvas, 0, 0);
    }
}

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