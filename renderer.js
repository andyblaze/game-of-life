
export default class MatrixView {
    constructor(config, width, height) {
        this.config = config;
        console.log("mv.c", width, height);
        this.createOffscreenBuffer(window.innerWidth, window.innerHeight);

        // Pre-compute font strings
        this.font = `${config.fontSize}px ${config.fontFamily}`;
    }
    resize(width, height) {
        this.offscreen.width = width;
        this.offscreen.height = height;
        console.log("mv.rs", this.offscreen.width, this.offscreen.height);
    }
    createOffscreenBuffer(width, height) {
        this.offscreen = document.createElement('canvas');
        console.log("mv.cob", width, height);
        this.resize(width, height);        
        this.offCtx = this.offscreen.getContext('2d');
    }
    clear() {
        this.offCtx.clearRect(0, 0, this.offscreen.width, this.offscreen.height);
    }
    drawDrop(drop, x, charHeight) {
        const ctx = this.offCtx;
        ctx.font = this.font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        const isGhost = drop.isGhost;
        const cfg = isGhost ? this.config.GHOST : this.config.NORMAL;

        for (let i = 0; i < drop.chars.length; i++) {
            const char = drop.chars[i];
            const alpha = drop.alphas[i];

            ctx.fillStyle = `rgba(${cfg.color.join(',')},${alpha})`;
            ctx.fillText(char, x + cfg.offsetX, drop.y + i * charHeight + cfg.offsetY);
        }
    }
    blitToScreen(screenCtx) {
        screenCtx.clearRect(0, 0, this.offscreen.width, this.offscreen.height);
        screenCtx.drawImage(this.offscreen, 0, 0);
    }
}