import { WavyMask, FullScreenOverlay } from "./overlays.js";
function applyWaveClip(ctx, width = 1920, height = 680, waveY = 250, phase = 1, offsets = []) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, waveY);

    const waveCount = 6;             // number of full sine waves across the screen
    const waveLength = width / waveCount;
    const waveHeight = 40;           // amplitude of the wave

    // Wavy bottom line using sine
    for (let x = width; x >= 0; x -= 10) {  // step in pixels
        const y = waveY + Math.sin((x / waveLength) * 2 * Math.PI + phase) * waveHeight;
        ctx.lineTo(x, y);
    }

    ctx.lineTo(0, waveY);
    ctx.closePath();

    // Soft debug fill (remove later)
    ctx.fillStyle = "rgba(0,200,0,0.1)";
    ctx.fill();

    // Clip everything to below this path
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
        this.mask = new WavyMask();//this.onscreen.width, this.onscreen.height);
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
    applyWaveClip(this.offCtx, this.offscreen.width, this.offscreen.height, 600);
        // draw auroras
        data.forEach(a => {
            a.draw(this.offCtx);
        });
        this.offCtx.restore(); // restore after clip
        //if (this.mask) {
            // apply mask as a destination-in so lights get clipped
           // this.offCtx.globalCompositeOperation = "source-atop";
            //this.mask.draw(this.offCtx);
            //this.offCtx.globalCompositeOperation = "source-over"; // reset
        //}        
        this.blit();
    }
    blit() {
        this.onCtx.clearRect(0, 0, this.onscreen.width, this.onscreen.height);
        this.onCtx.drawImage(this.offscreen, 0, 0);  
    }
}