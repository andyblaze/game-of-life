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
        this.dustParticles = []; // → array of current specks.
        this.charge = 0; // 0..1 → how “ready” the nursery is (fraction of buildTime).
        this.lastUpdate = 0; // → timestamp for time-based growth.
        this.startTime = performance.now();
    }
    update(obj) {
        this.charge = Math.min(1, (performance.now() - this.startTime) / obj.cfg.buildTime); //console.log(this.charge);
        if (Math.random() < obj.cfg.dustDensity * this.charge) { //console.log(this.dustParticles.length);
            const angle = Math.random() * Math.PI * 2;
            const r = (Math.random() - 0.9) * obj.cfg.patchRadius;
            this.dustParticles.push({
                x: obj.cfg.pos.x + (obj.global.width / 2) + Math.cos(angle) * r,
                y: obj.cfg.pos.y + (obj.global.height / 2) + Math.sin(angle) * r,
                alpha: Math.random() * 0.5 + 0.2
            });
        }
    }
    draw(ctx, obj) {
        this.update(obj);
        let {x, y} = obj.cfg.pos;
        x = x + (obj.global.width / 2);
        y = y + (obj.global.height / 2);
        ctx.fillStyle = "rgba(0,255,0,0)";
        ctx.beginPath();
        ctx.arc(x, y, obj.cfg.patchRadius, 0, Math.PI*2);
        ctx.fill();
        this.dustParticles.forEach(p=>{
            ctx.fillStyle = `rgba(5,5,5,${p.alpha})`;
            ctx.arc(p.x, p.y, 1, 0, Math.PI*2);
            ctx.fill();
        });
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

