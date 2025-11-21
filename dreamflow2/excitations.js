import Perlin from './perlin.js';
const perlin = new Perlin();

class ExcitationStrategy {
    update(dt, df) {} // called every frame. dt is delta, df is Dreamflow object
}

class Eff {
    constructor(c) {
        this.cfg = c;
        this.x = Math.random() * 470 + 10;
        this.y = Math.random() * 260 + 10;
        this.vX = 0;
        this.vY = 0;
        this.strength = 2.5 * (Math.random() - 0.5);
        this.initPerlin();
    }            
    initPerlin() {
        // perlin 
        // get some randomness in there
        this.driftScale = 0.2 + Math.random() * 0.01;
        this.driftTimeScale = 0.2 + Math.random() * 0.04;
        this.driftStrength = 0.5 + Math.random() * 0.15;
        this.driftDrag = 0.7 + Math.random() * 0.002;
    }
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

        this.x += this.vX * 0.0001;
        this.y += this.vY * 0.0001;
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
    update(t, df) {  
        this.applyDrift(t);
        this.screenWrap();
        df.exciteAt(this.x, this.y, 5, 0.7);
    }
}

export default class RandomExcite extends ExcitationStrategy {
    constructor(config) { 
        super(); 
        this.cfg = config;
        this.accumExc = 0;
        this.x = Math.random() * 460 + 10;
        this.y = Math.random() * 250 + 10;
        this.vX = Math.random() * 0.5;
        this.vY = Math.random() * 0.5;//.00009;
        this.initPerlin();
        this.es = [];
        for ( let i = 1; i < 20; i ++ )
            this.es.push(new Eff(this.cfg));

    }
    initPerlin() {
        // perlin 
        // get some randomness in there
        this.driftScale = 0.002 + Math.random() * 0.001;
        this.driftTimeScale = 0.0002 + Math.random() * 0.004;
        this.driftStrength = 0.05 + Math.random() * 0.015;
        this.driftDrag = 0.7 + Math.random() * 0.0002;
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

        this.x += -0.1 + this.vX;
        this.y += -0.1 + this.vY;
    }
    applyGravity(t, df) {
        /*const es = [];
        for ( let i = 1; i < 20; i ++ )
            es.push({
                x: Math.random() * 300 + 100, 
                y: Math.random() * 180 + 50, 
                strength: 0.2
            });*/
        for (let e of this.es) {
            e.update(t, df);
            let dx = e.x - this.x;
            let dy = e.y - this.y;
            let dist2 = dx*dx + dy*dy;
            if (dist2 < 1) dist2 = 1; // avoid divide by 0
            let force = e.strength / dist2;
            this.vX += force * dx;
            this.vY += force * dy;
            // Apply drag
            //this.vx *= this.drag;
            //this.vy *= this.drag;
            e.x += 0.1;
        }
        this.x += this.vX;
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
        this.applyGravity(dt, df);
        this.screenWrap();
        //this.applyDrift(dt);
        //const pulses = this.cfg.excitationRate * dt * 0.01;
        //this.accumExc += pulses;
        //while (this.accumExc >= 1) {
        //    this.accumExc -= 1;
            //this.x += 0.5;//const x = Math.random() * this.cfg.W;
            //const y = Math.random() * this.cfg.H;
            df.exciteAt(this.x, this.y, 1, 0.7);
        //}
    }
}