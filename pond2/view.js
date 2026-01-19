export default class View {
    constructor(id, config) {
        this.onscreen = document.getElementById(id);
        this.onCtx = this.onscreen.getContext("2d");
        this.offscreen = document.createElement("canvas");
        this.offCtx = this.offscreen.getContext("2d");
        this.cfg = config;
    }
    resize(w, h) {
        this.onscreen.width = w;
        this.onscreen.height = h;
        this.offscreen.width = w;
        this.offscreen.height = h;
    }
    drawFood(f) {
        const ctx = this.offCtx;
        const spikes = 5; // number of star points
        const outerRadius = 4;
        const innerRadius = 2;

        ctx.save();
        ctx.beginPath();
        ctx.translate(f.x, f.y);
        ctx.moveTo(0, -outerRadius);
        for (let i = 0; i < spikes; i++) {
            ctx.rotate(Math.PI / spikes);
            ctx.lineTo(0, -innerRadius);
            ctx.rotate(Math.PI / spikes);
            ctx.lineTo(0, -outerRadius);
        }
        ctx.closePath();

        ctx.fillStyle = f.color;
        ctx.shadowColor = "rgba(0,255,0,1)";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
    }
    draw(data) {
        // background water
        this.offCtx.fillStyle = "rgba(20, 40, 60, 1)";
        this.offCtx.fillRect(0, 0, this.offscreen.width, this.offscreen.height);
        // draw critters
        data.critters.forEach(c => {
            c.draw(this.offCtx);
        });
        data.food.forEach(f => {
            this.drawFood(f);
        });
        this.blit();
    }
    blit() {
        this.onCtx.clearRect(0, 0, this.onscreen.width, this.onscreen.height);
        this.onCtx.drawImage(this.offscreen, 0, 0);  
    }
}