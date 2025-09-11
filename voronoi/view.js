import { FullScreenOverlay } from "./overlays.js";
import { WavyMask } from "./masks.js";

export default class View {
    constructor(id, config) {
        this.onscreen = document.getElementById(id);
        this.onCtx = this.onscreen.getContext("2d");
        this.offscreen = document.createElement("canvas");
        this.offCtx = this.offscreen.getContext("2d");
        this.skyImage = new Image();
        this.skyImage.src = "sky.jpg";
        //this.overlay = new FullScreenOverlay(); 
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
    gradient(ctx, site, hue) {
        const g = ctx.createRadialGradient(site.x, site.y, 0, site.x, site.y, 80); console.log(hue);
        g.addColorStop(0, `hsla(${hue},80%,70%,0.7)`);
        g.addColorStop(1, `hsla(${hue},80%,30%,0.1)`);
    }
    draw(data) {
        this.offCtx.drawImage(this.skyImage, 0, 0, this.offscreen.width, this.offscreen.height);
        //ctx.clearRect(0, 0, width, height);
        for ( let i = 0; i < data.cells.length; i++ ) {
            const cell = data.cells[i];
            if ( cell.length < 3 ) continue;
            this.offCtx.beginPath();
            this.offCtx.moveTo(cell[0].x, cell[0].y);
            for ( let j = 1; j < cell.length; j++ ) 
                this.offCtx.lineTo(cell[j].x, cell[j].y);
            this.offCtx.closePath();
            let hue = (data.sites[i].x / this.offscreen.width * 360 + data.timestamp * 0.02) % 360;  console.log(hue);
            this.gradient(this.offCtx, data.sites[i], hue);
            //this.offCtx.fillStyle = `hsla(${hue},70%,40%,0.3)`;
            this.offCtx.strokeStyle = `hsla(${hue},80%,70%,0.5)`;
            this.offCtx.fill();
            this.offCtx.stroke();
        }
        //this.overlay.draw(this.offCtx, this.offscreen.width, this.offscreen.height);
        this.blit();
    }
    blit() {
        this.onCtx.clearRect(0, 0, this.onscreen.width, this.onscreen.height);
        this.onCtx.drawImage(this.offscreen, 0, 0);  
    }
}