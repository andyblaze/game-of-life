import { HSLAString, mt_rand } from "./functions.js";

export default class Particle { 
    constructor(cfg) {
        this.pos = { x: cfg.x, y: cfg.y };
        this.vel = { x: cfg.vx, y: cfg.vy };
        this.life = cfg.life;
        this.age = 0;
        this.color = cfg.color;
        this.size = cfg.size;
        this.tweens = cfg.tweens;
        this.seed = Math.random() * 1000;
    }

    update(dt) {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y * dt;
        this.age += dt;
    }
    dt() {
        return this.age / this.life;
    }

    isAlive() {
        return this.age < this.life;
    }
}
