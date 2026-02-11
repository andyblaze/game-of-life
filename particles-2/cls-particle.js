import { HSLAString, lerp, lerpHSLAColor } from "./functions.js";

export default class Particle { 
    constructor(cfg) {
        this.pos = { x: cfg.x, y: cfg.y };
        this.vel = { x: cfg.vx, y: cfg.vy };
        this.life = cfg.life;
        this.age = 0;
        this.color = cfg.color;//, a: cfg.alpha };
        this.radius = cfg.size;
        this.tweens = { ...cfg.tweens };
    }

    update(dt) {
        this.pos.x += this.vel.x ;//* dt;
        this.pos.y += this.vel.y * dt;
        this.age += dt;
    }

    isAlive() {
        return this.age < this.life;
    }

    draw(ctx) {
        const t = this.age / this.life;
        const alpha = this.tweens.alpha(this.age / this.life);//this.color.a * (1 - t); // simple fade out
        this.color.a = alpha;
        this.color = this.tweens.color(this.age / this.life);
        ctx.fillStyle = HSLAString(this.color);
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
