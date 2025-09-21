import { perlin, scaleY, randomFrom } from "./functions.js";
import CONFIG from "./config.js";

class Particle {
    constructor(x, y, config) {
        this.x = x;
        this.y = y;
        this.config = config;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.tx = null;
        this.ty = null;
        this.inWord = false;
        this.color = randomFrom(config.COLORS);
        this.shape = randomFrom(config.SHAPES);
        this.size = 1 + Math.random() * 2;
    }
    update(ctx) {
        if (this.inWord && this.tx !== null && this.ty !== null) {
            this.x += (this.tx - this.x) * this.config.FORMATION_SPEED;
            this.y += (this.ty - this.y) * this.config.FORMATION_SPEED;
        } else {
            // Brownian motion + perlin drift
            let rad = this.config.DIRECTION * Math.PI / 180;
            let dx = Math.cos(rad) * this.config.NOISE_SPEED;
            let dy = Math.sin(rad) * this.config.NOISE_SPEED;
            let n = perlin(this.x * this.config.NOISE_SCALE, this.y * this.config.NOISE_SCALE);
            dx += (n - 0.5) * this.config.NOISE_SPEED;
            dy += (n - 0.5) * this.config.NOISE_SPEED;

            // existing Brownian
            let bx = this.vx;
            let by = this.vy;

            // CORRECT mapping: normalizedBottom = 0 at top, 1 at bottom
            let normalizedBottom = Math.max(0, Math.min(1, this.y / ctx.canvas.height));

            // linear interpolate: bottom -> SPEED_FACTOR_MAX, top -> SPEED_FACTOR_MIN
            const sf = this.config.SPEED_FACTOR.MIN + (this.config.SPEED_FACTOR.MAX - this.config.SPEED_FACTOR.MIN) * normalizedBottom;

            // apply combined motion scaled by sf
            this.x += (bx + dx);// * sf;
            this.y += (by + dy) * sf;

            // Horizontal wrap stays the same
            if (this.x < 0) this.x = ctx.canvas.width;
            if (this.x > ctx.canvas.width) this.x = 0;

            // Vertical wrap is customized for fire motes
            if (this.y < 0) {
                // respawn at the fire base area
                this.x = this.config.SPAWN_X + (Math.random() - 0.5) * this.config.SPAWN_WIDTH;
                this.y = this.config.BASE_AREA - Math.random() * this.config.SPAWN_HEIGHT;
            }
        }
    }
    drawCircle(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, 2*Math.PI);
        ctx.fill();
    }
    drawTriangle(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size/2);
        ctx.lineTo(this.x - this.size/2, this.y + this.size/2);
        ctx.lineTo(this.x + this.size/2, this.y + this.size/2);
        ctx.closePath();
        ctx.fill();
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        switch(this.shape) {
          case 'circle':
            this.drawCircle(ctx);
            break;

          case 'rect':
            ctx.fillRect(this.x, this.y, this.size, this.size);
            break;

          case 'triangle':
            this.drawTriangle(ctx);
            break;

          case 'line':
            ctx.fillRect(this.x, this.y, 1, this.size); // very short vertical line
            break;
        }
    }
}

export default class ParticleManager {
    constructor(config) {
        this.config = config;
        this.particles = [];
        for (let i = 0; i < config.COUNT; i++) {
            // spawn position
            const x = config.SPAWN_X + (Math.random() - 0.5) * config.SPAWN_WIDTH;
            const y = scaleY(900) - Math.random() * config.SPAWN_HEIGHT;

            // initial velocity
            const angleDeg = (Math.random() - 0.5) * config.CONE_ANGLE; // spread around vertical
            const speed = config.INIT_SPEED; // adjust as needed
            const rad = angleDeg * Math.PI / 180;

            const vx = Math.sin(rad) * speed; // horizontal
            const vy = -Math.cos(rad) * speed; // vertical upward

            this.particles.push(new Particle(x, y, config));
        }
    }
    update(ctx) {
        for (const p of this.particles) {
            p.update(ctx);
            p.draw(ctx);
        }        
    }
    releaseParticles() {
        for (const p of this.particles) {
            p.inWord = false;
            p.tx = null;
            p.ty = null;
        }
    }
}