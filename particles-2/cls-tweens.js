import { lerp, lerpHSLAColor } from "./functions.js";

export class TweenCollection {
    constructor() { 
        this.items = []; 
    }
    add(b) { 
        this.items.push(b); 
    }
    apply(particle, t) {
        for (const b of this.items) 
            b.update(particle, t);
    }
}

export class AlphaOverLife {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    update(p, t) {
        p.color.a = this.start + (this.end - this.start) * t;
    }
}

export class ColorOverLife {
    constructor(start, end, alpha) {
        this.start = { ...start, a: alpha };
        this.end   = { ...end,   a: 0 };
    }

    update(p, t) {
        p.color = lerpHSLAColor(this.start, this.end, t);
    }
}

export class SizeOverLife {
    constructor(start, end) {
        this.start = start;
        this.end   = end;
    }

    update(p, t) {
        p.size = lerp(this.start, this.end, t);
    }
}

export class NoiseDrift {
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
