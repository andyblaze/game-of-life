import ColorConfig from "./color-config.js";
import { mt_rand, lerpHSL, randomVelocityPair } from "./functions.js";
import BaseParticle from "./base-particle.js";
import { curlNoise } from "./perlin-2d.js";

export default class Effector extends BaseParticle {
    constructor(x, y, screenSz, strength) {
        super(x, y, screenSz);
        const { vx, vy } = randomVelocityPair(0.001);
        this.vX = vx;
        this.vY = vy;

        this.strength = strength; // positive = attract, negative = repel
        this.baseStrength = strength;
        this.radius = Math.abs(strength / 1.5);
        // Pick a random palette for this Effector
        this.palette = ColorConfig.randomPalette();
        // Start color at base
        this.color = { ...this.palette.base };
        this.period = mt_rand(600, 900) * 60;
        this.phase = Math.random() * 2 * Math.PI;
        this.startTime = performance.now();
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
    }
    lerpColors() {
        const t = performance.now() - this.startTime;
        const norm = (Math.sin((t / this.period) * 2 * Math.PI + this.phase) + 1) / 2;
        const c = lerpHSL(this.palette.base, this.palette.accent, norm);
        return `hsl(${c.h},${c.s}%,${c.l}%)`;  
    }
    update() {
        const timeScale = 9000;
        const dt = performance.now() - this.startTime;
        const n = curlNoise(
            this.x * timeScale,
            this.y * timeScale
        );
        //console.log(n);
        // Strength of drift
        const dX = mt_rand(5, 10); // tune: 0.1 = gentle, 2 = wild
        const dY = mt_rand(5, 10); // tune: 0.1 = gentle, 2 = wild
        this.vX += n.x * dX;
        this.vY += n.y * dY;

        this.x += this.vX * 0.5;
        this.y += this.vY * 0.5;
        this.strength = this.baseStrength * Math.sin((dt / this.period) * 2 * Math.PI);
        this.color = this.lerpColors();
        this.screenWrap();
        let tmp = this.strength;
        if ( Math.random() > 0.01 && this.strength > 0 ) { this.strength = -200; this.strength = tmp; }
    }
    update1() {
        const t = performance.now() - this.startTime;
        this.strength = this.baseStrength * Math.sin((t / this.period) * 2 * Math.PI);
        
        this.color = this.lerpColors();
        
        this.x += this.vX;
        this.y += this.vY;
        
        this.screenWrap();
    }
}