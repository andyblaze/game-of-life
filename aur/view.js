import { FullScreenOverlay } from "./overlays.js";
function applyWaveClip(ctx, width, height, waveY, phase = 0) {
    ctx.save();
    ctx.beginPath();

    // start bottom-right
    ctx.moveTo(width, height);
    // top-right
    ctx.lineTo(width, 0);
    // top-left
    ctx.lineTo(0, 0);
    // bottom-left
    ctx.lineTo(0, height);

    // wavy line along the bottom, back to bottom-right
    const waveCount = 20;
    const waveLength = width / waveCount;
    const waveHeight = 20;

    for (let x = 0; x <= width; x += 10) {       // step in pixels
        const y = waveY + Math.sin((x / waveLength) * 2 * Math.PI + phase) * waveHeight;
        ctx.lineTo(x, y);
    }

    ctx.closePath();

    // temporary fill to see the mask
    ctx.fillStyle = "rgba(0, 200, 0, 0.01)";
    ctx.fill();

    // now clip to this region
    ctx.clip();
}
export default class View {
    constructor(id, config) {
        this.onscreen = document.getElementById(id);
        this.onCtx = this.onscreen.getContext("2d");
        this.offscreen = document.createElement("canvas");
        this.offCtx = this.offscreen.getContext("2d");
        this.skyImage = new Image();
        this.skyImage.src = "sky.jpg";
        this.overlay = new FullScreenOverlay(); 
        this.cfg = config;
    }
    resize(w, h) {
        this.onscreen.width = w;
        this.onscreen.height = h;
        this.offscreen.width = w;
        this.offscreen.height = h;
    }
    overlayFog(height) {
        // --- Layered fog overlay ---
        const gradient = this.offCtx.createLinearGradient(
            0, this.offscreen.height - height, 0, this.offscreen.height
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.5, 'rgba(215, 215, 215, 0.5)');
        gradient.addColorStop(1, 'rgba(215, 215, 215, 0)');
        this.offCtx.fillStyle = gradient;
        this.offCtx.fillRect(0, this.offscreen.height - height, this.offscreen.width, height);
    }
    draw(data) {
        this.offCtx.drawImage(this.skyImage, 0, 0, this.offscreen.width, this.offscreen.height);
        this.overlay.draw(this.offCtx, this.offscreen.width, this.offscreen.height);
        // clip to below wavy line
        applyWaveClip(this.offCtx, this.offscreen.width, this.offscreen.height, 520);
        // draw auroras
        data.forEach(a => {
            a.draw(this.offCtx);
        });
        this.offCtx.restore(); // restore after clip     
        this.blit();
    }
    blit() {
        this.onCtx.clearRect(0, 0, this.onscreen.width, this.onscreen.height);
        this.onCtx.drawImage(this.offscreen, 0, 0);  
    }
}