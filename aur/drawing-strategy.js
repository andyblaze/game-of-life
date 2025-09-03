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
    alphaCalc(n) { // alpha oscillations with tiny randomness
        const phase = this.phase + this.phaseOffset;
        return Math.max(0, this.baseAlphas[n]  + 0.05 * Math.sin(phase + n) + (Math.random() - 0.5) * 0.01);
    }
    stopCalc(n) {
        return n + 0.1 * Math.sin(this.stopPhase);
    }
    makeGradient(ctx, h) {
        // drift gradient endpoints subtly to simulate tilt
        const drift = mt_rand(20, 80) * Math.sin(this.phase);
        const grad = ctx.createLinearGradient(drift, 0, drift, h);
        
        const alpha0 = this.alphaCalc(0);
        const alpha1 = this.alphaCalc(1);
        const alpha2 = this.alphaCalc(2);
        const alpha3 = this.alphaCalc(3);
        
        const stopPos0 = this.stopCalc(0.1);// + 0.1 * Math.sin(this.stopPhase); // 0.0 ± 0.1 → [0.0,0.1]
        const stopPos1 = this.stopCalc(0.6);// + 0.1 * Math.sin(this.stopPhase); // 0.6 ± 0.1 → [0.5,0.7]
        const stopPos2 = this.stopCalc(0.7);// + 0.1 * Math.sin(this.stopPhase); // 0.7 ± 0.1 → [0.8,0.9]
        const stopPos3 = 1;
    
        grad.addColorStop(stopPos0, `rgba(${this.colorCurrent.join(",")},${alpha0})`);
        grad.addColorStop(stopPos1, `rgba(${this.colorCurrent.join(",")},${alpha1})`);
        grad.addColorStop(stopPos2, `rgba(${this.colorCurrent.join(",")},${alpha2})`);
        grad.addColorStop(stopPos3, `rgba(${this.colorCurrent.join(",")},${alpha3})`);
        
        return grad;
    }
    driftColor(c) {
        const minG = 200;
        const maxG = 255;
        const mid = (minG + maxG) / 2;
        const amp = (maxG - minG) / 2;

        const g = Math.round(mid + amp * Math.sin(this.phase));
        return [c[0], g, c[2]];
    }
draw(ctx, aurora) {
    const a = aurora;
    const w = ctx.canvas.width;
    const h = skyHeight(ctx.canvas.height);

    this.phase += 0.03; // speed of shimmer, tweak as needed
    const phase = this.phase + this.phaseOffset;

    this.colorCurrent = this.driftColor(a.color);
    this.stopPhase += 0.002; // slow drift speed, tweak as needed

    const grad = this.makeGradient(ctx, h);
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

