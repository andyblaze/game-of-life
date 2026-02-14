import { mt_randf, mt_rand } from "./functions.js";
import Particle from "./cls-particle.js";
import { TweenCollection, AlphaOverLife, ColorOverLife, SizeOverLife, NoiseDrift } from "./cls-tweens.js";
import PerlinNoise from "./cls-perlin.js";

export default class Emitter {
    constructor(x, y) {
        this.pos = { x, y };
        //this.tweenBehaviors = tweens;
        this.particles = [];
        this.perlin = new PerlinNoise();
    }

    buildTweens(cfg) {
        const tweenBehaviors = new TweenCollection();
        tweenBehaviors.add(new AlphaOverLife(cfg.alpha, 0));
        tweenBehaviors.add(new ColorOverLife(cfg.color_start, cfg.color_end, cfg.alpha));
        tweenBehaviors.add(new SizeOverLife(cfg.size_start, cfg.size_end));
        tweenBehaviors.add(new NoiseDrift(this.perlin, 1, 0.1, 0.02));
        return tweenBehaviors;
    }
    lifeTimeVariance(cfg) {
        const variance_rate = cfg.life * cfg.life_variance;
        return mt_rand(-variance_rate, variance_rate); 
    }
    spawnOffset(axisOffset) {
        return axisOffset === 0 ? axisOffset : mt_rand(-axisOffset, axisOffset);
    }

    spawnParticle(cfg) {
        const halfSpread = cfg.spread / 2;
        const offset = mt_randf(-halfSpread, halfSpread);
        const finalAngle = cfg.angle + offset;
        const radians = (finalAngle - 90) * (Math.PI / 180);
        const conf = {
            x: this.pos.x + this.spawnOffset(cfg.spawn_offsetX),
            y: this.pos.y+ this.spawnOffset(cfg.spawn_offsetY),
            vx: Math.cos(radians) * cfg.speed_x, 
            vy: Math.sin(radians) * cfg.speed_y + mt_randf(-0.5, 0.5),
            life: cfg.life + this.lifeTimeVariance(cfg),        
            color: { ...cfg.color_start },
            size: cfg.size_start,         // radius            
            tweens: this.buildTweens(cfg)
        };
        const p = new Particle(conf);
        this.particles.push(p);
    }

    update(cfg, dt) {
        for ( let i = 0; i < cfg.multiplier; i++ ) {
            this.spawnParticle(cfg); 
        }
        this.particles.forEach(p => p.update(dt));
        // remove dead particles
        this.particles = this.particles.filter(p => p.isAlive());
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }
}
