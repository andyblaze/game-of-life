import { mt_randf, lerp, lerpHSLAColor } from "./functions.js";
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
        tweenBehaviors.add(new SizeOverLife(cfg.size, 20.5));
        tweenBehaviors.add(new NoiseDrift(this.perlin, 1, 0.1, 0.02));
        return tweenBehaviors;
    }

    spawnParticle(cfg) {
        const halfSpread = cfg.spread / 2;
        const offset = mt_randf(-halfSpread, halfSpread);
        const finalAngle = cfg.angle + offset;
        const radians = (finalAngle - 90) * (Math.PI / 180);
        const conf = {
            x: this.pos.x,
            y: this.pos.y,
            vx: Math.cos(radians) * cfg.speed_x, 
            vy: Math.sin(radians) * cfg.speed_y,    
            life: cfg.life,        
            color: { ...cfg.color_start },
            size: cfg.size,         // radius            
            tweens: this.buildTweens(cfg)
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
