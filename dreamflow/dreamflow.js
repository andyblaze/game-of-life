class DreamFlow {
    constructor(config, es=null) {
        this.cfg = config;
        this.exciteStrategy = es;
        // base values from config (slider-controlled)
        this.diffusion = config.diffusion;
        this.advection = config.advection;
        this.damping = config.damping;
        this.fadeStrength = config.fadeStrength;

        this.time = 0;
        // Buffers & precomputed indices
        this.size = 0;                // number of cells
        this.simA = null;
        this.simB = null;  // Float32Arrays length size*3 (rgb)
        this.neighbors3 = null;       // Int32Array length size*9 (neighborIndex*3)
        this.hue = null;              // per-cell hue bias
        this.imageData = null;
        // persistence buffer
        this.accumImage = null;
        this.running = true;
        this.alloc(config);
        this.seedRandom(1.0);
        this.scheduler = null;
    }
    precomputeNeighbors(config) {
        // neighbors order: (xm1,ym1),(x,ym1),(xp1,ym1),(xm1,y),(x,y),(xp1,y),(xm1,yp1),(x,yp1),(xp1,yp1)
        const nPerCell = 9;
        this.neighbors3 = new Int32Array(this.size * nPerCell);
        const W = config.W;
        const H = config.H;
        for ( let y = 0; y < H; y++ ) {
            const ym1 = (y>0) ? y-1 : 0;
            const yp1 = (y < H-1) ? y+1 : H-1;
            for ( let x = 0; x < W; x++ ) {
                const xm1 = (x>0) ? x-1 : 0;
                const xp1 = (x < W-1) ? x+1 : W-1;
                const baseCell = y * W + x;
                const cellIndex = baseCell * nPerCell;
                // fill nine neighbors' base*3
                this.neighbors3[cellIndex + 0] = (ym1 * W + xm1) * 3;
                this.neighbors3[cellIndex + 1] = (ym1 * W + x  ) * 3;
                this.neighbors3[cellIndex + 2] = (ym1 * W + xp1) * 3;
                this.neighbors3[cellIndex + 3] = (y   * W + xm1) * 3;
                this.neighbors3[cellIndex + 4] = (y   * W + x  ) * 3; // center
                this.neighbors3[cellIndex + 5] = (y   * W + xp1) * 3;
                this.neighbors3[cellIndex + 6] = (yp1 * W + xm1) * 3;
                this.neighbors3[cellIndex + 7] = (yp1 * W + x  ) * 3;
                this.neighbors3[cellIndex + 8] = (yp1 * W + xp1) * 3;
            }
        }
    }
    // Allocate arrays for current grid size
    alloc(config) {
        this.size = config.W * config.H;
        this.simA = new Float32Array(this.size * 3);
        this.simB = new Float32Array(this.size * 3);
        this.hue = new Float32Array(this.size);
        for ( let i = 0; i < this.size; i++ ) 
            this.hue[i] = Math.random();
        this.precomputeNeighbors(config);
        off.width = config.W;
        off.height = config.H;
        this.imageData = offCtx.createImageData(config.W, config.H);
    }
    seedRandom(str=1.0){
        for ( let i = 0, n = this.size * 3; i < n; i+=3 ) {
            this.simA[i  ] = (Math.random()-0.5) * str;
            this.simA[i+1] = (Math.random()-0.5) * str;
            this.simA[i+2] = (Math.random()-0.5) * str;
        }
    }
    nearestSampleBase(config, x, y) {
        // clamp to grid
        const ix = (x < 0) ? 0 : (x >= config.W ? config.W-1 : (x|0));
        const iy = (y < 0) ? 0 : (y >= config.H ? config.H-1 : (y|0));
        return (iy * config.W + ix) * 3;
    }
    clearAll() {
        this.simA.fill(0);
        this.simB.fill(0);
    }
    update(dt, offscreen, onscreen) {
        this.updateParams(dt);
        // perform 1..2 simulation substeps for stability
        const steps = (config.W * config.H > 200000) ? 2 : 1;
        for ( let s = 0; s < steps; s++ ) 
            this.step(this.cfg); 
        if ( this.exciteStrategy ) {
            this.exciteStrategy.update(dt, this);
        }
        this.autoDraw(dt);
        this.draw(offscreen, onscreen);
    }
    updateParams(dt) {
        this.time += dt;
        const drift = t => 0.5 + 0.5 * Math.sin(t);

        // base drift speed – very slow overall
        const base = 0.0005;  // smaller = slower drift

        // use different primes for each parameter
        const f1 = 3 * base;   // 2 × base
        const f2 = 5 * base;   // 3 × base
        const f3 = 7 * base;   // 5 × base
        const f4 = 11 * base;   // 7 × base

        this.diffusion    = drift(this.time * f1 + 0.3);             // 0 → 1
        this.advection    = drift(this.time * f2 + 1.1) * 2.0;       // 0 → 2
        this.damping      = drift(this.time * f3 + 2.7) * 0.02;      // 0 → 0.02
        this.fadeStrength = 0.7 + 0.29 * drift(this.time * f4 + 3.5);// 0.7 → 0.99

        // clamp for safety
        this.diffusion    = Math.max(0.1, Math.min(1, this.diffusion));
        this.advection    = Math.max(0, Math.min(2, this.advection));
        this.damping      = Math.max(0.01, Math.min(0.02, this.damping));
        this.fadeStrength = Math.max(0.7, Math.min(0.99, this.fadeStrength));
    }
    autoDraw(dt) {
        /*for ( const b of this.brushes )
            b.update(this);*/
        this.scheduler.update(dt, this);
    }
    // One simulation step (hot loop optimized)
    step(config) {
        const inv9 = 1/9;
        const A = this.simA, B = this.simB, N3 = this.neighbors3;
        const nPerCell = 9;

        // local copies of params for JIT friendliness
        const diff = this.diffusion;
        const adv = this.advection;
        const damp = this.damping;

        // iterate every cell by index i (cell index)
        // we will compute neighbor base offsets using neighbors3
        for ( let cell = 0, nBase = 0; cell < this.size; cell++, nBase += nPerCell ) {
            // neighbor base addresses (already multiplied by 3)
            // note: N3[nBase + k] is the starting index in A for that neighbor's R component
            const nb0 = N3[nBase + 0], nb1 = N3[nBase + 1], nb2 = N3[nBase + 2],
            nb3 = N3[nBase + 3], nb4 = N3[nBase + 4], nb5 = N3[nBase + 5],
            nb6 = N3[nBase + 6], nb7 = N3[nBase + 7], nb8 = N3[nBase + 8];

            // sum R channel across 9 neighbors
            // reading sequentially from A, which is Float32Array
            const rSum = A[nb0] + A[nb1] + A[nb2] + A[nb3] + A[nb4] + A[nb5] + A[nb6] + A[nb7] + A[nb8];
            const gSum = A[nb0+1] + A[nb1+1] + A[nb2+1] + A[nb3+1] + A[nb4+1] + A[nb5+1] + A[nb6+1] + A[nb7+1] + A[nb8+1];
            const bSum = A[nb0+2] + A[nb1+2] + A[nb2+2] + A[nb3+2] + A[nb4+2] + A[nb5+2] + A[nb6+2] + A[nb7+2] + A[nb8+2];

            // average
            const avgR = rSum * inv9;
            const avgG = gSum * inv9;
            const avgB = bSum * inv9;

            // compute luminance gradient using left/right/up/down neighbors (nearest)
            // left neighbor base = nb3, right = nb5, up = nb1, down = nb7
            const lumC = (A[nb4] + A[nb4+1] + A[nb4+2]) / 3;
            const lumL = (A[nb3] + A[nb3+1] + A[nb3+2]) / 3;
            const lumR = (A[nb5] + A[nb5+1] + A[nb5+2]) / 3;
            const lumU = (A[nb1] + A[nb1+1] + A[nb1+2]) / 3;
            const lumD = (A[nb7] + A[nb7+1] + A[nb7+2]) / 3;

            const gx = (lumR - lumL) * 0.5;
            const gy = (lumD - lumU) * 0.5;

            // velocity perpendicular to gradient -> swirl
            const vx =  gy * adv;
            const vy = -gx * adv;

            // backtrace (nearest sampling): compute approximate source cell (float coords)
            // compute current cell coords:
            const cy = (cell / config.W) | 0;
            const cx = cell - cy * config.W;
            const srcBase = this.nearestSampleBase(config, cx - vx, cy - vy);

            // read advected color (nearest)
            const advR = A[srcBase];
            const advG = A[srcBase + 1];
            const advB = A[srcBase + 2];

            // combine advected + diffusion average
            let newR = advR * (1 - diff) + avgR * diff;
            let newG = advG * (1 - diff) + avgG * diff;
            let newB = advB * (1 - diff) + avgB * diff;

            // apply damping
            newR *= (1 - damp);
            newG *= (1 - damp);
            newB *= (1 - damp);

            // clamp to safe range
            const baseOut = cell * 3;
            B[baseOut]   = newR < -1 ? -1 : (newR > 1.6 ? 1.6 : newR);
            B[baseOut+1] = newG < -1 ? -1 : (newG > 1.6 ? 1.6 : newG);
            B[baseOut+2] = newB < -1 ? -1 : (newB > 1.6 ? 1.6 : newB);
        }
        // swap
        const tmp = this.simA; this.simA = this.simB; this.simB = tmp;
    }
    draw(offscreen, onscreen) {
        dreamFlow.renderToOff(offscreen);
        dreamFlow.drawToScreen(onscreen);
    }
    // Render simA (Float32) -> imageData (Uint8ClampedArray) quickly
    renderToOff(offscreen) {
        const A = this.simA;
        const data = this.imageData.data;

        // first frame: allocate and zero
        if ( ! this.accumImage || this.accumImage.length !== data.length ) {
            this.accumImage = new Float32Array(data.length);
            for ( let i = 0; i < data.length; i++ ) 
                this.accumImage[i] = 0;
        }
        const accumImage = this.accumImage;
        const boost = 230;
        const fade = this.fadeStrength;

        for ( let cell = 0, p = 0; cell < this.size; cell++, p += 4 ) {
            const base = cell * 3;
            let r = A[base]   * 0.8 + 0.03;
            let g = A[base+1] * 0.8 + 0.02;
            let b = A[base+2] * 0.8 + 0.01;

            // minimal cross mix for richer colors
            const cr = r*1.0 + g*0.12 - b*0.05;
            const cg = -0.05*r + g*1.0 + b*0.08;
            const cb = 0.02*r + 0.08*g + b*1.0;

            // tone clamp
            const rr = Math.max(0, Math.min(1.4, cr));
            const gg = Math.max(0, Math.min(1.4, cg));
            const bb = Math.max(0, Math.min(1.4, cb));

            // blend with previous accumulation
            const oldR = accumImage[p];
            const oldG = accumImage[p+1];
            const oldB = accumImage[p+2];

            const newR = oldR*(1-fade) + rr*fade;
            const newG = oldG*(1-fade) + gg*fade;
            const newB = oldB*(1-fade) + bb*fade;

            accumImage[p]   = newR;
            accumImage[p+1] = newG;
            accumImage[p+2] = newB;

            data[p  ] = (newR * boost) | 0;
            data[p+1] = (newG * boost) | 0;
            data[p+2] = (newB * boost) | 0;
            data[p+3] = 255;
        }
        offscreen.putImageData(this.imageData, 0, 0);
    }
    drawToScreen(onscreen) {
        onscreen.imageSmoothingEnabled = true;
        onscreen.drawImage(off, 0, 0, canvas.width, canvas.height);
    }
    // Inject a soft pulse into simA at float grid coords
    exciteAt(gridX, gridY, radius, strength = 1) {
        if ( gridX < 0 || gridX >= this.cfg.W || gridY < 0 || gridY >= this.cfg.H ) return;
        const r2 = radius * radius;
        const x0 = Math.max(0, Math.floor(gridX - radius));
        const x1 = Math.min(this.cfg.W - 1, Math.floor(gridX + radius));
        const y0 = Math.max(0, Math.floor(gridY - radius));
        const y1 = Math.min(this.cfg.H - 1, Math.floor(gridY + radius));

        // pick a base hue for this pulse (warmish range, 0 = red, 0.08~0.12 = whites/oranges)
        let baseHue = Math.random() * 0.15 + 0.05; 

        for ( let y = y0; y <= y1; y++ ) {
            for ( let x = x0; x <= x1; x++ ) {
                const dx = x - gridX, dy = y - gridY;
                const d2 = dx*dx + dy*dy;
                if ( d2 <= r2 ) {
                    const f = 1 - Math.sqrt(d2) / radius;
                    const i = (y * this.cfg.W + x) * 3;

                    // small per-cell hue variation
                    let h = (baseHue + (Math.random() - 0.5 ) * 0.05) % 1;

                    // optional: slowly drift hue based on time or global frame
                    h += performance.now() * 0.0002; // tiny drift
                    h %= 1;

                    // HSL to RGB
                    const s = 0.8; // saturation
                    const l = 0.5; // lightness
                    const rgb = hslToRgb(h, s, l);

                    this.simA[i]   += rgb[0] * strength * f;
                    this.simA[i+1] += rgb[1] * strength * f;
                    this.simA[i+2] += rgb[2] * strength * f;
                }
            }
        }
    }  
    addScheduler(s) {
        this.scheduler = s;
    }
}