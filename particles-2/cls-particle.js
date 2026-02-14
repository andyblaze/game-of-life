import { HSLAString, mt_rand } from "./functions.js";

export default class Particle { 
    constructor(cfg) {
        this.pos = { x: cfg.x, y: cfg.y };
        this.vel = { x: cfg.vx, y: cfg.vy };
        this.life = cfg.life;
        this.age = 0;
        this.color = cfg.color;//, a: cfg.alpha };
        this.size = cfg.size;
        this.tweens = cfg.tweens;
        this.seed = Math.random() * 1000;
    }

    update(dt) {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y * dt;
        this.age += dt;
        const t = this.age / this.life;
        this.tweens.apply(this, t);
    }

    isAlive() {
        return this.age < this.life;
    }

    draw(ctx) {
const g = ctx.createRadialGradient(
    this.pos.x, this.pos.y, 0,
    this.pos.x, this.pos.y, this.size
);
const c = this.color;

g.addColorStop(0, `hsla(${c.h}, ${c.s}%, ${c.l}%, ${c.a})`);
g.addColorStop(1, `hsla(${c.h}, ${c.s}%, ${c.l}%, 0)`);

ctx.fillStyle = g;
ctx.beginPath();
ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
ctx.fill();
/*
        ctx.fillStyle = HSLAString(this.color);
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
        ctx.fill();*/
    }
}
