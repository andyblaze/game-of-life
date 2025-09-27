import { mt_rand, randomFrom, degToRad, colorToStr } from "./functions.js";
export default class Particle {
    constructor(x, y, config) {
        this.originalX = x;
        this.originalY = y;
        this.lifetime = config.lifetime ?? mt_rand(200, 300); // frames
        this.spread = config.spread ? degToRad(config.spread) : degToRad(10);
        this.color = config.color ? {...config.color} : {h:0, s:"0%", l:"100%", a:1};
        this.setRandomColor(config);
        this.history = [];        // past positions
        this.maxTrail = config.maxTrail ?? 8;       // how many to keep
        this.gravity = config.gravity ?? 0.05;
        this.speed = config.speed ?? 3
        this.size = config.size ?? 2;
        this.jitter = config.jitter ?? false;
        this.canReset = config.canReset ?? false;
        this.reset();
    }
    setRandomColor(config) {
        this.color = config.colors ? {...randomFrom(config.colors)} : this.color;
    }
    active() {
        return this.age <= this.lifetime || this.alpha > 0;
    }
    reset() {
        this.x = this.originalX;
        this.y = this.originalY;
        const baseAngle = -Math.PI / 2; // straight up
        //const spread = Math.PI / 1.3;     // cone - more number = tighter cone
        const angle = baseAngle + (Math.random() - 0.5) * this.spread;
        const speed = this.speed + Math.random() * this.speed;         // 2–5 px/frame
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 3;       // bias upward
        this.age = 0;  
        this.alpha = 1;
        this.history = [];
    }
    setReset(r) {
        this.canReset = r;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;

        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > this.maxTrail) {
            this.history.shift(); // remove oldest
        }

        this.vy += this.gravity; // gravity per frame
        this.vx += Math.random() * 0.01; // wind 
        if ( this.jitter )
            this.vx += mt_rand(-9, 9) / 25;
        this.age++;
        this.alpha = 1 - this.age / this.lifetime;
        this.color.a = this.alpha;

        // reset when dead
        if (this.age > this.lifetime || this.alpha <= 0) {
            if ( this.canReset ) this.reset();
        }
        return this.active();
    }
    drawArc(ctx, x, y, sz, color) {
        ctx.fillStyle = colorToStr(color);
        ctx.beginPath();
        ctx.arc(x, y, sz, 0, Math.PI * 2);
        ctx.fill();
    }
    drawtrail(ctx) {
        ctx.beginPath();
        for (let i = 0; i < this.history.length; i++) {
            const p = this.history[i];
            this.color.a = (i / this.history.length) * this.alpha;
            this.drawArc(ctx, p.x, p.y, 2, this.color);
        }
    }
    draw(ctx) {
        this.drawtrail(ctx);
        this.drawArc(ctx, this.x, this.y, this.size, this.color);
    }
}
