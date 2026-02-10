export default class Particle {
    constructor(x, y, vx, vy, life, color, radius) {
        this.pos = { x, y };
        this.vel = { x: vx, y: vy };
        this.life = life;
        this.age = 0;
        this.color = color;
        this.radius = radius;
    }

    update(dt) {
        this.pos.x += this.vel.x * dt;
        this.pos.y += this.vel.y * dt;
        this.age += dt;
    }

    isAlive() {
        return this.age < this.life;
    }

    draw(ctx) {
        const t = this.age / this.life;
        const alpha = this.color.a * (1 - t); // simple fade out
        ctx.fillStyle = `hsla(${this.color.h},${this.color.s}%,${this.color.l}%,${alpha})`;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
