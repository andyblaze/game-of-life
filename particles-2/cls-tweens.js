import { lerp, lerpHSLAColor } from "./functions.js";
import PerlinNoise from "./cls-perlin.js";

class TweenCollection {
    constructor() { 
        this.items = []; 
    }
    add(i) { 
        this.items.push(i); 
    }
    apply(particle, t) {
        for (const i of this.items) 
            i.update(particle, t);
    }
}

class AlphaOverLife {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    update(p, t) {
        p.color.a = this.start + (this.end - this.start) * t;
    }
}

class ColorOverLife {
    constructor(start, end, alpha) {
        this.start = { ...start, a: alpha };
        this.end   = { ...end,   a: 0 };
    }

    update(p, t) {
        p.color = lerpHSLAColor(this.start, this.end, t);
    }
}

class SizeOverLife {
    constructor(start, end) {
        this.start = start;
        this.end   = end;
    }

    update(p, t) {
        p.size = lerp(this.start, this.end, t);
    }
}

class NoiseDrift {
    constructor(perlin, amount = 10, scale = 0.01, speed = 0.01) {
        this.perlin = perlin;
        this.amount = amount;
        this.scale = scale;
        this.speed = speed;
    }

    update(p, t, dt) {
        const nx = this.perlin.noise(
            p.seed * this.scale,
            p.age * this.speed
        );

        p.pos.x += nx * this.amount;
    }
}

export class TweenFactory {
    static perlin = new PerlinNoise();
    static build(cfg) {
        const tweenBehaviors = new TweenCollection();
        tweenBehaviors.add(new AlphaOverLife(cfg.alpha_start, cfg.alpha_end));
        tweenBehaviors.add(new ColorOverLife(cfg.color_start, cfg.color_end, cfg.alpha_start));
        tweenBehaviors.add(new SizeOverLife(cfg.size_start, cfg.size_end));
        tweenBehaviors.add(new NoiseDrift(this.perlin, 1, 0.1, 0.02));
        return tweenBehaviors;        
    }
}
