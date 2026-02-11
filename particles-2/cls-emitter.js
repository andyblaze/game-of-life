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
        const colour = { ...cfg.color_start };
        colour.a = cfg.alpha;
        const lifetimeTweens = {
            alpha: t => lerp(cfg.alpha, 0, t),
            color: t => lerpHSLAColor(colour, {h: 120, s: 80, l: 40, a: 0}, t)
        };
        const conf = {
            x: this.pos.x,
            y: this.pos.y,
            vx: Math.cos(radians) * cfg.speed_x, 
            vy: Math.sin(radians) * cfg.speed_y,    
            life: cfg.life,        
            color: colour,
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
