import Perlin from './perlin.js';
const perlin = new Perlin();

class ExcitationStrategy {
    update(dt, df) {} // called every frame. dt is delta, df is Dreamflow object
}

export default class RandomExcite extends ExcitationStrategy {
    constructor(config) { 
        super(); 
        this.cfg = config;
        this.accumExc = 0;
        this.x = 240;
        this.y = 136;
        this.vX = 0;
        this.vY = 0;//.00009;
        this.initPerlin();
    }
    initPerlin() {
        // perlin 
        // get some randomness in there
        this.driftScale = 0.002 + Math.random() * 0.01;
        this.driftTimeScale = 0.0002 + Math.random() * 0.04;
        this.driftStrength = 0.05 + Math.random() * 0.015;
        this.driftDrag = 0.87 + Math.random() * 0.002;
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

        this.x += -0.35 + this.vX;
        this.y += this.vY;
    }
    screenWrap() {
        const w = this.cfg.W;
        const h = this.cfg.H;
        const pad = 1; // small margin prevents jitter

        /*if (this.x < 0) this.x = this.cfg.W;
        else if (this.x > this.cfg.W) this.x = 0;

        if (this.y < 0) this.y = this.cfg.H;
        else if (this.y > this.cfg.H) this.y = 0; */
        
        //console.log(this.x, this.y);
        
        //return;

        if (this.x < 2) { this.x = w -2; this.vX -= 3; }
        else if (this.x > w-2 ) { this.x = 2; this.vX += 3; }

        if (this.y < 2) { this.y = h -2; this.vY -= 3; }
        else if (this.y > h-2) { this.y = 2; this.vY += 3; }
    }
    update(dt, df) { 
        this.screenWrap();
        this.applyDrift(dt);
        //const pulses = this.cfg.excitationRate * dt * 0.01;
        //this.accumExc += pulses;
        //while (this.accumExc >= 1) {
        //    this.accumExc -= 1;
            //this.x += 0.5;//const x = Math.random() * this.cfg.W;
            //const y = Math.random() * this.cfg.H;
            df.exciteAt(this.x, this.y, 1.5, 1);
        //}
    }
}