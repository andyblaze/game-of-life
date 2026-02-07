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
    x: (cfg.canvas.width / 2) - (1 + Math.floor(Math.random() * 8)),
    y: (cfg.canvas.height / 2) + (Math.random() * 2 - 1) * halfSpan,
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
        this.boundingBox = { t:0, r:0, b:0, l:0 };
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
    update(cfg) {
        this.setColors(cfg);
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            p.update();

            let minX = 1000;
            //let maxX = 0;

            if ( p.life <= 0 ) {
                const pX = Math.round(p.x);
                if ( pX > this.boundingBox.l ) this.boundingBox.l = pX;
                if ( Math.round(p.y) > this.maxY ) this.maxY = Math.round(p.y);
                //, Math.round(p.y))
            this.particles.splice(i, 1);
            //console.log(256 - this.maxX, 256 - this.maxY);
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

// Animation loop
function animate() {
    for ( let i = 0; i < config.multiplier; i++ )
        particleEmitter.add(spawnParticle(config));
    config.ctx.clearRect(0, 0, config.canvas.width, config.canvas.height);
    particleEmitter.update(config);
    requestAnimationFrame(animate);
}

animate();
