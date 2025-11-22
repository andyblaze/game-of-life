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
        this.startTime = performance.now();
        this.initColors();
        this.initGravity(8, 16);
        this.initPerlin();
        this.initRadius();
        this.ability = null;
        this.active = true;
        //this.setActive(false);
    }
    initGravity(lo, hi) {
        this.gravityPhase = Math.random() * Math.PI * 2; // independent
        this.gravityPeriod = mt_rand(lo, hi);
        this.gravityFrequency = 1 / this.gravityPeriod;
    }
    initRadius() {
        this.startRadius = 0.25;                   // starts non-interactive
        this.targetRadius = this.radius; // whatever your normal logic sets
        this.growDuration = 8000         // ms
        this.growStart = performance.now();             // set when introduced
    }
    setActive(a) {
        this.active = a;
        if ( false === a ) {
            this.tmpStrength = { base: this.baseStrength, str: this.strength };
            this.baseStrength = 0;
            this.strength = 0;
        }
        else {
            this.baseStrength = this.tmpStrength.base;
            this.strength = this.tmpStrength.str;
        }
    }
    addAbility(a) {
        this.ability = a;
    }
    initColors() {
        // Pick a random palette for this Effector
        this.palette = ColorConfig.randomPalette();
        // Start color at base
        this.color = { ...this.palette.base };
        this.period = mt_rand(100, 300) * 30;
        this.phase = Math.random() * 2 * Math.PI;
    }
    initPerlin() {
        // perlin 
        // get some randomness in there
        this.driftScale = 0.002 + Math.random() * 0.003;
        this.driftTimeScale = 0.0002 + Math.random() * 0.0004;
        this.driftStrength = 0.05 + Math.random() * 0.15;
        this.driftDrag = 0.87 + Math.random() * 0.02;
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
    applyStrength(t) {
        // advance independent gravity oscillator
        this.gravityPhase += t * this.gravityFrequency * 2 * Math.PI;

        // compute oscillating gravitational strength
        this.strength = this.baseStrength * Math.sin(this.gravityPhase);
        //console.log(this.strength);
    }
    applyAbility(now, t) {
        if ( this.ability.shouldActivate() ) {
            this.ability.activate(now);
        }
        const stillActive = this.ability.update(now, t);

        if ( false === stillActive ) {
            // restore normality
            this.ability.restore(this, t);
        }
    }
    applyRadius() {
        if ( this.startRadius < this.targetRadius ) { 
            this.startRadius += 60 / this.growDuration;
            this.radius = this.startRadius;
        }
    }
    update(dt) { 
        const now = performance.now();
        const t = now - this.startTime; console.log(dt, t, now);
        this.applyRadius();
        this.applyDrift(t);
        this.color = this.lerpColors();
        this.screenWrap();
        //if ( false === this.active ) return; 
        // --- ability system ---
        if ( null !== this.ability ) {
            this.applyAbility(now, t);
            //return; // done
        }
        // Standard effector (no ability)
        this.applyStrength(t);
    }
}