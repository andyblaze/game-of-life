import { mt_randf, lerp, lerpHSLAColor } from "./functions.js";
import Particle from "./cls-particle.js";

export default class Emitter {
    constructor(x, y) {
        this.pos = { x, y };
        this.particles = [];
    }

    spawnParticle(cfg) {
        const halfSpread = cfg.spread / 2;
        const offset = mt_randf(-halfSpread, halfSpread);
        const finalAngle = cfg.angle + offset;
        const radians = (finalAngle - 90) * (Math.PI / 180);
        const colour1 = { ...cfg.color_start };
        const colour2 = { ...cfg.color_end };
        colour1.a = cfg.alpha;
        colour2.a = cfg.alpha;
        const lifetimeTweens = {
            alpha: t => lerp(cfg.alpha, 0, t),
            color: t => lerpHSLAColor(colour1, colour2, t)
        };
        const conf = {
            x: this.pos.x,
            y: this.pos.y,
            vx: Math.cos(radians) * cfg.speed_x, 
            vy: Math.sin(radians) * cfg.speed_y,    
            life: cfg.life,        
            color: colour1,
            size: cfg.size,         // radius            
            tweens: lifetimeTweens
        };
        const p = new Particle(conf);
        this.particles.push(p);
    }

    update(cfg, dt) {
        this.spawnParticle(cfg);
        this.particles.forEach(p => p.update(dt));
        // remove dead particles
        this.particles = this.particles.filter(p => p.isAlive());
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }
}
