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