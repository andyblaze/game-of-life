import ColorConfig from "./color-config.js";
import { mt_rand, lerpHSL } from "./functions.js";
import BaseParticle from "./base-particle.js";

export default class Effector extends BaseParticle {
    constructor(x, y, strength) {
        super(x, y);
        this.vX = Math.random() - 0.9;
        this.vY = Math.random() - 0.9;
        if ( Math.random() < 0.5 ) {
            this.vX = -this.vX;
            this.vY = -this.vY;
        }
        this.strength = strength; // positive = attract, negative = repel
        this.baseStrength = strength;
        // Pick a random palette for this Effector
        this.palette = ColorConfig.randomPalette();
        // Start color at base
        this.color = { ...this.palette.base };
        this.period = mt_rand(20000, 50000);
        this.phase = Math.random() * 2 * Math.PI;
        this.startTime = performance.now();
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 6, 0, Math.PI*2);
        ctx.fill();
    }
    lerpColors() {
        const t = performance.now() - this.startTime;
        const norm = (Math.sin((t / this.period) * 2 * Math.PI + this.phase) + 1) / 2;
        const c = lerpHSL(this.palette.base, this.palette.accent, norm);
        return `hsl(${c.h},${c.s}%,${c.l}%)`;  
    }
    update() {
        const t = performance.now() - this.startTime;
        this.strength = this.baseStrength * Math.sin((t / this.period) * 2 * Math.PI);
        
        this.color = this.lerpColors();
        
        this.x += this.vX;
        this.y += this.vY;
        
        this.screenWrap();
    }
}