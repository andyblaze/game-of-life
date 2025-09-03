import { mt_rand, skyHeight, lerpColor } from "./functions.js";

class AuroraDrawing {
    constructor() {
        this.phase = 0;
        this.phaseOffset = Math.random() * Math.PI * 2; 
        this.stopPhase = Math.random() * Math.PI * 2;
        this.baseAlphas = [
            Math.random() * 0.05 + 0,    // top transparent-ish
            Math.random() * 0.1 + 0.15,  // mid-light
            Math.random() * 0.1 + 0.25,  // mid-lower
            Math.random() * 0.3 + 0.3    // bottom brighter
        ];
        this.colorCurrent = null;
    }
    colorDrift(c) {
        const drift = 1;
        if ( c[2]+drift >= 255) drift = -1;
        if ( c[2]-drift <=200) drift = 1;
        return c[2]+drift;
    }
draw(ctx, aurora) {
    const a = aurora;
    const w = ctx.canvas.width;
    const h = skyHeight(ctx.canvas.height);

    this.phase += 0.03; // speed of shimmer, tweak as needed
    const phase = this.phase + this.phaseOffset;
// alpha oscillations with tiny randomness
const alpha0 = Math.max(0, this.baseAlphas[0]  + 0.05 * Math.sin(phase)     + (Math.random() - 0.5) * 0.01);
const alpha1 = Math.max(0, this.baseAlphas[1]  + 0.05 * Math.sin(phase + 1) + (Math.random() - 0.5) * 0.01);
const alpha2 = Math.max(0, this.baseAlphas[2]  + 0.05 * Math.sin(phase + 2) + (Math.random() - 0.5) * 0.01);
const alpha3 = Math.max(0, this.baseAlphas[3]  + 0.05 * Math.sin(phase + 3) + (Math.random() - 0.5) * 0.01);

    // drift gradient endpoints subtly to simulate tilt
    const drift = mt_rand(20, 80) * Math.sin(this.phase);
    const grad = ctx.createLinearGradient(drift, 0, drift, h);

    this.colorCurrent = a.color;
    this.stopPhase += 0.002; // slow drift speed, tweak as needed
    // compute drifting stop position (0.5 → 0.7)
    const stopPos0 = 0.1 + 0.1 * Math.sin(this.stopPhase+0.002); // 0.0 ± 0.1 → [0.0,0.1]
    const stopPos1 = 0.6 + 0.1 * Math.sin(this.stopPhase); // 0.6 ± 0.1 → [0.5,0.7]
    const stopPos2 = 0.7 + 0.1 * Math.sin(this.stopPhase+0.0002); // 0.7 ± 0.1 → [0.8,0.9]
    grad.addColorStop(stopPos0, `rgba(${this.colorCurrent.join(",")},${alpha0})`);
    grad.addColorStop(stopPos1, `rgba(${this.colorCurrent.join(",")},${alpha1})`);
    grad.addColorStop(stopPos2, `rgba(${this.colorCurrent.join(",")},${alpha2})`);
    grad.addColorStop(1, `rgba(${this.colorCurrent.join(",")},${alpha3})`);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
}

    draw1(ctx, aurora) {
        const a = aurora;
        // dimensions
        const w = ctx.canvas.width;
        const h = skyHeight(ctx.canvas.height);
        // gradient fill
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, "rgba(" + a.color.join(",") + ",0)");   // top transparent
        grad.addColorStop(0.6, "rgba(" + a.color.join(",") + ",0.2)");
        grad.addColorStop(0.8, "rgba(" + a.color.join(",") + ",0.3)");
        grad.addColorStop(1, "rgba(" + a.color.join(",") + ",0.75)");
        
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
    }
}
export class Type1Drawing extends AuroraDrawing {
    constructor() {
        super();
    }
}
export class Type2Drawing extends AuroraDrawing {
    constructor() {
        super();
    }
    /*draw(ctx, aurora) {
        const a = aurora;

        // draw the Type2 light     
    }*/
}
export class Type3Drawing extends AuroraDrawing {
    constructor() {
        super();
    }
    /*draw(ctx, aurora) {
        const a = aurora;

        // draw the Type2 light     
    }*/
}

