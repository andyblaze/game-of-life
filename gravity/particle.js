import BaseParticle from "./base-particle.js";

export default class Particle extends BaseParticle {
    constructor(x, y, screenSz, color="hsl(120,80%,55%)") {
        super(x, y, screenSz);
        this.vx = (Math.random()-0.5) * 2;
        this.vy = (Math.random()-0.5) * 2;
        this.color = color;
        this.drag = 0.995;
        this.radius = 2;
        // colors
        this.colorPhase = 120;
        this.hue = 120;
        this.colorSpeed = 30;
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
        
        // colors 
        const t = performance.now() * 0.001; // seconds
        this.hue = (this.colorPhase + t * this.colorSpeed) % 360;
        // Neon: high saturation, mid-high lightness
        this.color = `hsl(${this.hue}, 80%, 55%)`;
        
        this.screenWrap();
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
    }
}