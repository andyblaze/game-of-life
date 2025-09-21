import CONFIG from "./config.js";
import { mt_rand } from "./functions.js";

class Ember {
    constructor(config) {
        this.config = config;
        this.trailLength = config.TRAIL_LENGTH;
        this.maxLife = config.LIFETIME; // ms        
        this.init(this.config);
    }
    init(config) {
        // Spawn position (rectangle)
        this.x = config.SPAWN_X + (Math.random() - 0.5) * config.SPAWN_WIDTH;
        this.y = config.SPAWN_Y - (Math.random() * config.SPAWN_HEIGHT);

        // Random velocity in a cone
        const angleDeg = config.MIN_ANGLE + Math.random() * (config.MAX_ANGLE - config.MIN_ANGLE);
        const rad = angleDeg * Math.PI / 180;
        const speed = config.MIN_SPEED + Math.random() * (config.MAX_SPEED - config.MIN_SPEED);
        this.vx = Math.sin(rad) * speed;
        this.vy = -Math.cos(rad) * speed; // negative because canvas y=0 is top

        // Color pick
        const colorIndex = Math.floor(Math.random() * config.COLORS.length);
        this.color = {...config.COLORS[colorIndex]};

        this.trail = [];

        // Lifetime
        this.life = 0;
        this.alive = true;
    }
    update(dt) {
        // dt = time delta in ms
        this.life += dt;
        this.color.a = Math.max(0, 1 - this.life / this.maxLife);
        if (this.life >= this.maxLife && this.color.a <= 0) {
            this.alive = false;
            this.init(this.config);
        }

        // Add previous position to trail
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > this.trailLength) this.trail.shift();

        // Apply motion
        this.vy += this.config.GRAVITY;
        this.vx += (Math.random() - 0.5) * (this.config.WIND);
        this.x += this.vx;
        this.y += this.vy;
    }
    draw(ctx) {
        // Draw trail
        for (let i = 0; i < this.trail.length; i++) {
            const p = this.trail[i];          
            ctx.fillStyle = `hsla(${this.color.h}, ${this.color.s}, ${this.color.l}, ${this.color.a})`;
            ctx.fillRect(p.x, p.y, 2, 2);
        }
        // Draw current position
        ctx.fillStyle = `hsla(${this.color.h}, ${this.color.s}, ${this.color.l}, ${this.color.a})`;
        ctx.fillRect(this.x, this.y, 2, 2);
    }
}
export default class EmberManager {
    constructor(config) {
        this.config = config;
        this.embers = [];
        this.active = [];
        this.animating = false;
        this.spawnTimer = 0; // counts down
        this.nextSpawn = this.randomSpawnTime(); // time until next spawn (s)
        for ( let i = 0; i < config.POOL_SIZE; i++ ) {
            this.embers.push(new Ember(config));
        }
    }
    randomSpawnTime() {
        return mt_rand(3, 8);
    }
    spawn() {
        if ( Math.random() > this.config.SPAWN_CHANCE ) return false;
        const count = mt_rand(1, 3);
        for (let i = 0; i < count; i++) {
            const ember = this.embers[mt_rand(0, this.embers.length -1)];
            this.active.push(ember);
        }
        return true;
    }
    update(dt, ctx) {
        const deltaSeconds = dt / 1000;
        this.spawnTimer += deltaSeconds;
        if (this.spawnTimer >= this.nextSpawn) {
            if ( this.spawn() === true ) {
                this.spawnTimer = 0;
                this.nextSpawn = this.randomSpawnTime();
            }
            else this.active = [];
        }

        // update/draw active embers
        for (const e of this.active) {
            e.update(dt);
            e.draw(ctx);
        }
        //this.active = this.active.filter(e => e.alive);
    }
}