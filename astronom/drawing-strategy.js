import { mt_rand, lerpColor, clamp } from "./functions.js";

class PulseRing {
    constructor(x, y, maxRadius = 60, duration = 1000) {
        this.x = x;
        this.y = y;
        this.maxRadius = maxRadius;
        this.duration = duration;
        this.startTime = 0;//performance.now();
    }

    draw(ctx, now) {
        const age = now - this.startTime; //console.log(age , this.duration);
        //if (age > this.duration) return false; // finished

        const t = age / this.duration; // 0 → 1
        const radius = t * this.maxRadius;
        const alpha = 1 - t; // fade out

        ctx.strokeStyle = `rgba(200,200,255,${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.stroke();

        return true; // still alive
    }
}
// pulse alpha generator
function pulsar(timer, cycle = 6000) {
    const tNorm = (timer % cycle) / cycle; // 0 → 1

    // timings as fractions of cycle
    const fadeInEnd  = 0.05;  // 200ms / 4000ms
    const holdEnd    = 0.30;  // 1200ms / 4000ms
    const fadeOutEnd = 0.35;  // 1400ms / 4000ms

    // fade in: 0 → 1
    let alpha = clamp(tNorm / fadeInEnd, 0, 1);

    // hold
    if (tNorm >= fadeInEnd && tNorm < holdEnd) alpha = 1;

    // fade out: 1 → 0
    if (tNorm >= holdEnd && tNorm < fadeOutEnd) {
        alpha = 1 - clamp((tNorm - holdEnd) / (fadeOutEnd - holdEnd), 0, 1);
    }
    return alpha;
}

class ItemDrawing {
    constructor() {}
    draw(ctx) {}
}
export class Type1Drawing extends ItemDrawing {
    constructor() {
        super();
        this.phase = 0; // pulse phase
        this.timer = 0;
        this.cycle = 6000; // ms
        this.rings = [];
        this.wasOn = false;
        this.rings.push(new PulseRing(80, 80));
    }
    draw(ctx, obj) {
        const baseColor = obj.cfg.item("types")[0].color.join(","); // r,g,b
        const size = obj.cfg.item("types")[0].size;

        this.timer += 16.67; // tick time
        if ( this.timer > this.cycle ) this.timer = 0;
        const alpha = pulsar(this.timer, this.cycle);
        
        if ( alpha > 0.999 ) {
            
            //this.rings[0].draw(ctx, performance.now());
        }
        //this.wasOn = (alpha === 1);
        
        ctx.fillStyle = `rgba(${baseColor},${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(80, 80, obj.cfg.item("types")[0].size, 0, Math.PI*2);
        ctx.fill();
    }
}
export class Type2Drawing extends ItemDrawing {
    constructor() {
        super();
    }
    /*draw(ctx, aurora) {
        const a = aurora;

        // draw the Type2 light     
    }*/
}
export class Type3Drawing extends ItemDrawing {
    constructor() {
        super();
    }
    /*draw(ctx, aurora) {
        const a = aurora;

        // draw the Type2 light     
    }*/
}

