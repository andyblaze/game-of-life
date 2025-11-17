import ColorConfig from "./color-config.js";
import { mt_rand, lerpHSL, randomVelocityPair } from "./functions.js";
import BaseParticle from "./base-particle.js";
//import { curlNoise } from "./perlin-2d.js";
import Perlin from './Perlin.js';
const perlin = new Perlin();

export default class Effector extends BaseParticle {
    constructor(x, y, screenSz, strength) {
        super(x, y, screenSz);
        const { vx, vy } = randomVelocityPair(0.006);
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
        // perlin 
        // get some randomness in there
        this.driftScale = 0.002 + Math.random() * 0.003;
        this.driftTimeScale = 0.0002 + Math.random() * 0.0004;
        this.driftStrength = 0.05 + Math.random() * 0.15;
        this.driftDrag = 0.87 + Math.random() * 0.02;
        // snapping to repulsor
        this.snapThreshold = 6;
        this.snapStrength  = -10;
        this.snapDuration  = 1000; // ms
        this.snapChance = 0.001;
        this.isSnapped = false;
        this.snapEndTime = 0;
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
    canSnap() {
        return (this.strength > this.snapThreshold && this.isSnapped === false && Math.random() < this.snapChance);
    } 
    // --- Perlin Drift -------------------------------------------------
    applyDrift(t) {
        // Normalize coordinates (important!)
        const nx = this.x * this.driftScale;
        const ny = this.y * this.driftScale;
        const nt = t * this.driftTimeScale;
        // Sample 3D Perlin noise
        const n = perlin.noise(nx, ny, nt);  // returns -1..1 or 0..1 depending on implementation

        // Convert noise → angle (full circle)
        const angle = n * Math.PI * 2;
        // Apply drift as a small directional push
        this.vX += Math.cos(angle) * this.driftStrength;
        this.vY += Math.sin(angle) * this.driftStrength;
        
        this.vX *= this.driftDrag;
        this.vY *= this.driftDrag;

        this.x += this.vX;
        this.y += this.vY;
    }
    applySnap(now) {
        this.isSnapped = true;
        this.snapEndTime = now + this.snapDuration;
        this.strength = this.snapStrength; // apply immediately
    }    
    update() {
        const now = performance.now();
        const t = now - this.startTime;
        this.applyDrift(t);
        this.color = this.lerpColors();
        this.screenWrap();
        if ( this.canSnap() ) {
            this.applySnap(now);
        }
        // --- SNAP MODE ---
        if ( this.isSnapped ) {
            this.strength = this.snapStrength;
            if (now >= this.snapEndTime) {
                this.isSnapped = false;
            }
        } else 
            this.strength = this.baseStrength * Math.sin((t / this.period) * 2 * Math.PI);
    }
}