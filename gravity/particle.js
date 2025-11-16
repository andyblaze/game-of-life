import BaseParticle from "./base-particle.js";

export default class Particle extends BaseParticle {
    constructor(x, y, color="rgb(0,255,0)") {
        super(x, y);
        this.vx = (Math.random()-0.5) * 2;
        this.vy = (Math.random()-0.5) * 2;
        this.color = color;
        this.drag = 0.995;
    }
    update(effectors) {
        for (let e of effectors) {
            let dx = e.x - this.x;
            let dy = e.y - this.y;
            let dist2 = dx*dx + dy*dy;
            if (dist2 < 1) dist2 = 1; // avoid divide by 0
            let force = e.strength / dist2;
            this.vx += force * dx;
            this.vy += force * dy;
            // Apply drag
            this.vx *= this.drag;
            this.vy *= this.drag;
        }
        this.x += this.vx;
        this.y += this.vy;
        
        this.screenWrap();
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI*2);
        ctx.fill();
    }
}