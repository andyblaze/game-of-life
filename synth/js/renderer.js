export default class Renderer {
    constructor(cfg, maths) {
        this.cfg = cfg;
        this.maths = maths;
        this.cfg.ctx.fillStyle = "rgba(0,0,0,0.2)";
        this.cfg.ctx.strokeStyle = "white";
    }
    draw(t) {
        const ctx = this.cfg.ctx;
        ctx.fillRect(0, 0, this.cfg.canvasW, this.cfg.canvasH);
        ctx.beginPath();

        let x0, y0;
        for ( let i = 0; i < 200; i++ ) {
            let tt = t + i * 0.02;

            const pos = this.maths.getPosition(tt);

            pos.x += this.cfg.centerX;
            pos.y += this.cfg.centerY;

            if ( i === 0 ) {
                ctx.moveTo(pos.x, pos.y);
                x0 = pos.x;
                y0 = pos.y;
            } 
            else {
                ctx.lineTo(pos.x, pos.y);
            }
        }
        ctx.stroke();
    }
}