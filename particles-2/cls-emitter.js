import { mt_randf, mt_rand } from "./functions.js";
import Particle from "./cls-particle.js";
import { TweenBuilder } from "./cls-tweens.js";

export default class Emitter {
    constructor(x, y) {
        this.pos = { x, y };
        this.particles = [];
    }
    lifeTimeVariance(cfg) {
        const variance_rate = cfg.life * cfg.life_variance;
        return mt_rand(-variance_rate, variance_rate); 
    }
    spawnOffset(axisOffset) { 
        return axisOffset === 0 ? axisOffset : mt_rand(-axisOffset, axisOffset);
    }
    speedVariance(axis, variance) {
        const variance_rate = axis * variance;
        return mt_randf(-variance_rate, variance_rate);
    }

    spawnParticle(cfg) { 
        const halfSpread = cfg.spread / 2;
        const offset = mt_randf(-halfSpread, halfSpread);
        const finalAngle = cfg.angle + offset;
        const radians = (finalAngle - 90) * (Math.PI / 180);
        const conf = {
            x: this.pos.x + this.spawnOffset(cfg.spawn_offsetX),
            y: this.pos.y+ this.spawnOffset(cfg.spawn_offsetY),
            vx: Math.cos(radians) * cfg.speed_x + this.speedVariance(cfg.speed_x, cfg.speed_varianceX), 
            vy: Math.sin(radians) * cfg.speed_y + this.speedVariance(cfg.speed_y, cfg.speed_varianceY), 
            life: cfg.life + this.lifeTimeVariance(cfg),        
            color: { ...cfg.color_start },
            size: cfg.size_start,        // radius       
            tweens: TweenBuilder.build(cfg)
        };
        const p = new Particle(conf);
        this.particles.push(p);
    }

    update(cfg, dt) {
        for ( let i = 0; i < cfg.density; i++ ) {
            this.spawnParticle(cfg); 
        }
        this.particles.forEach(p => p.update(dt));
        // remove dead particles
        this.particles = this.particles.filter(p => p.isAlive());
    }
}
