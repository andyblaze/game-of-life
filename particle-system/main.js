function byId(id) {
    return document.getElementById(id);
}

// Grab sliders and color pickers
const angleSlider = byId("angle-slider");
const sizeSlider = byId("size-slider");
const lifetimeSlider = byId("lifetime-slider");
const speedSlider = byId("speed-slider");
const spreadSlider = byId("spread-slider");
const startOffsetSlider = byId("start-offset-slider");
const alphaSlider = byId("alpha-slider");
const multiplierSlider = byId("multiplier-slider");

const colorStart = byId("color-start");
const colorMid = byId("color-mid");
const colorEnd = byId("color-end");

// Update slider display
angleSlider.oninput = () => controlSynch(angleSlider);
sizeSlider.oninput = () => controlSynch(sizeSlider);
lifetimeSlider.oninput = () => controlSynch(lifetimeSlider);
speedSlider.oninput = () => controlSynch(speedSlider);
spreadSlider.oninput = () => controlSynch(spreadSlider);
startOffsetSlider.oninput = () => controlSynch(startOffsetSlider);
alphaSlider.oninput = () => controlSynch(alphaSlider);
multiplierSlider.oninput = () => controlSynch(multiplierSlider);

colorStart.oninput = () => controlSynch(colorStart);
colorMid.oninput = () => controlSynch(colorMid);
colorEnd.oninput = () => controlSynch(colorEnd);


class Cfg {
    constructor(htmlId) {
        this.canvas = byId(htmlId);
        this.canvasW = this.canvas.width;
        this.canvasH = this.canvas.height;
        this.canvasCenter = { x: this.canvasW / 2, y: this.canvasH / 2 };
        this.ctx = this.canvas.getContext("2d");
        this.update();
    }
    update() {
        this.baseAngle = parseFloat(angleSlider.value) * (Math.PI / 180); // Base angle from slider (degrees → radians)
        this.speed = parseFloat(speedSlider.value);
        this.alpha = parseFloat(alphaSlider.value);
        this.life = parseInt(lifetimeSlider.value);
        this.maxLife = parseInt(lifetimeSlider.value);
        this.spread = parseInt(spreadSlider.value);
        this.size = parseFloat(sizeSlider.value);
        this.startOffset = parseFloat(startOffsetSlider.value);
        this.multiplier = parseInt(multiplierSlider.value);
        this.colorStart = hexToRgb(byId("color-start").value);
        this.colorMid = hexToRgb(byId("color-mid").value);
        this.colorEnd = hexToRgb(byId("color-end").value);
    }
}
const config = new Cfg("particle-canvas");

function controlSynch(ctrl) {
    const label = ctrl.dataset.lbl ?? null;
    if ( label !== null )
        byId(label).textContent = ctrl.value;
    config.update();
}

controlSynch(angleSlider);
controlSynch(sizeSlider);
controlSynch(lifetimeSlider);
controlSynch(speedSlider);
controlSynch(spreadSlider);
controlSynch(startOffsetSlider);
controlSynch(alphaSlider);
controlSynch(multiplierSlider);

// Helper: convert hex to rgb
function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

// Helper: interpolate colors
function lerpColor(c1, c2, t) {
  return {
    r: c1.r + (c2.r - c1.r) * t,
    g: c1.g + (c2.g - c1.g) * t,
    b: c1.b + (c2.b - c1.b) * t
  };
}

class Particle {
    constructor(cfg) {
        Object.assign(this, cfg);
    }
    update() {
        // Move
        this.x += this.vx;
        this.y += this.vy;

        // Age
        this.life--;
    }
    draw(ctx, color, alpha) {
        ctx.fillStyle = `rgba(
            ${Math.round(color.r)},
            ${Math.round(color.g)},
            ${Math.round(color.b)},
            ${alpha}
        )`;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Spawn a particle
function spawnParticle(cfg) {   
  // Spread: random offset from base angle
  const offset = (Math.random() - 0.5) * cfg.spread * (Math.PI / 180);

  const angle = cfg.baseAngle + offset;
  const pSize = cfg.size; 
  const halfSpan = (cfg.startOffset + pSize * 2) / 2;
  const speed = cfg.speed * (0.9 + Math.random() * 0.2);
  const conf = {
    x: (cfg.canvasCenter.x) - (1 + Math.floor(Math.random() * 8)),
    y: (cfg.canvasCenter.y) + (Math.random() * 2 - 1) * halfSpan,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size: pSize,
    alpha: cfg.alpha,
    alphaJitter: (Math.random() < 0.1 ? 0.6 + (Math.random() * 0.4) : 1),
    life: cfg.life,
    maxLife: cfg.maxLife 
  };
  return new Particle(conf);
}

class ParticleEmitter {
    constructor(cfg) {
        this.setColors(cfg);
        this.particles = [];
        this.boundingBox = { t: cfg.canvasCenter.y, r: cfg.canvasCenter.x, b: cfg.canvasCenter.y, l: cfg.canvasCenter.x, w: 0, h: 0 };
        this.maxX = 0;
        this.maxY = 0;
    }
    setColors(cfg) {
        this.startRgb = cfg.colorStart;
        this.midRgb = cfg.colorMid;
        this.endRgb = cfg.colorEnd;
    }
    add(p) {  
        this.particles.push(p);
    }
    getColor(t) {
        let color = {};
        if ( t < 0.5 ) {
            color = lerpColor(this.startRgb, this.midRgb, t * 2);
        } else {
            color = lerpColor(this.midRgb, this.endRgb, (t - 0.5) * 2);
        } 
        return color;
    }
    getAlpha(p, ratio) {
        const fade = ratio * ratio;
        return p.alpha * p. alphaJitter * fade; 
    }
    setBoundingBox(p) {
        const pX = Math.round(p.x);
        const pY = Math.round(p.y);
        const pSz = p.size;
        const pL = Math.floor(pX - pSz);
        const pR = Math.ceil(pX + pSz);
        const pT = Math.floor(pY - pSz);
        const pB = Math.ceil(pY + pSz);
        if ( pL < this.boundingBox.l ) this.boundingBox.l = pL;
        if ( pR > this.boundingBox.r ) this.boundingBox.r = pR;
        if ( pT < this.boundingBox.t ) this.boundingBox.t = pT;
        if ( pB > this.boundingBox.b ) this.boundingBox.b = pB;
        this.boundingBox.w = this.boundingBox.r - this.boundingBox.l;
        this.boundingBox.h = this.boundingBox.b - this.boundingBox.t;
        //byId("bounding-box").innerText = JSON.stringify(this.boundingBox);
    }
    draw() {

    }
    update(cfg) {
        this.setColors(cfg);
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            p.update();
            this.setBoundingBox(p);

            if ( p.life <= 0 ) {
                this.particles.splice(i, 1);
                continue;
            }

            // Lifetime ratios
            const lifeRatio = p.life / p.maxLife;       // 1 → 0
            const t = 1 - lifeRatio;                    // 0 → 1

            const color = this.getColor(t);
            const alpha = this.getAlpha(p, lifeRatio);

            p.draw(cfg.ctx, color, alpha);
        }
    }
}

const particleEmitter = new ParticleEmitter(config);

class SpriteSheet {
    constructor(id) {
        this.canvas = byId(id);
        this.ctx = this.canvas.getContext("2d");
        this.boxSet = false;
        this.ssLeft = 0;
        this.ssTop = 0;
        this.ssNum = 48;
        this.ssCurr = 0;
        this.ssRowLen = 8;
        this.ssColLen = this.ssNum / this.ssRowLen;
        this.box = {};
        this.mode = "generating";
    }
    reset() {
        this.ssLeft = 0;
        this.ssTop = 0;
        this.ssCurr = 0;
    }
    setBox(box) {
        if ( this.boxSet === true ) return;
        this.canvas.width = box.w * this.ssRowLen;
        this.canvas.height = box.h * this.ssColLen;
        this.box = box;
        this.boxSet = true;
    }
    draw(src) {
        if ( this.ssCurr <= this.ssNum && this.mode === "generating" ) {
            this.ctx.drawImage(
                src,
                this.box.l, this.box.t,     // source x, y
                this.box.w, this.box.h,     // source width, height
                this.ssLeft, this.ssTop,             // destination x, y
                this.box.w, this.box.h      // destination width, height
            );
        }
    }
    setPos() {
        this.ssCurr++;
        this.ssLeft += this.box.w;
        if ( this.ssCurr % this.ssRowLen === 0 ) { this.ssLeft = 0; this.ssTop += this.box.h; }
    }
    play() {
        this.mode = "playing";
        const canvas = byId("sprite");
        canvas.width = this.box.w;
        canvas.height = this.box.h;
        const ctx = canvas.getContext("2d");
        this.reset();
        this.intvlID = window.setInterval(() => {
            ctx.clearRect(0, 0, this.box.w, this.box.h);
            ctx.drawImage(
                this.canvas,
                this.ssLeft, this.ssTop,
                this.box.w, this.box.h,
                0, 0,
                canvas.width, canvas.height
            );
            this.setPos();
            if ( this.ssCurr > this.ssNum ) this.reset();
        }, 16);
    }
    stop() {
        window.clearInterval(this.intvlID);
    }
}

const spriteSheet = new SpriteSheet("sprite-sheet");
byId("play-btn").onclick = () => { spriteSheet.play() };
byId("stop-btn").onclick = () => { spriteSheet.stop() };


const SIM_FPS = 60;
const SIM_STEP = 1000 / SIM_FPS; // ms per sim frame

let lastTime = performance.now();
let accumulator = 0;
const startTime = 0;
let elapsedTime = 0;

// Animation loop
function animate(now) {
    const delta = now - lastTime; 
    lastTime = now;
    accumulator += delta;
    elapsedTime += delta;
    while ( accumulator >= SIM_STEP ) {
        for ( let i = 0; i < config.multiplier; i++ ) {
            particleEmitter.add(spawnParticle(config));
        }

        config.ctx.clearRect(0, 0, config.canvasW, config.canvasH);
        particleEmitter.update(config);

        if ( elapsedTime > 4000 ) {
            spriteSheet.setBox(particleEmitter.boundingBox);            
            spriteSheet.draw(config.canvas);
            spriteSheet.setPos();
            
        }

        accumulator -= SIM_STEP;
    }
    requestAnimationFrame(animate);
}

animate(performance.now());
