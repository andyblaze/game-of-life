
export default class MatrixView {
    constructor(config) {
        this.config = config;

        // Pre-compute font strings
        this.font = `${config.fontSize}px ${config.fontFamily}`;
    }

    drawDrop(ctx, drop, x, charHeight) {
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
}