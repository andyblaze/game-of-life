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

colorStart.oninput = () => controlSynch(colorStart);
colorMid.oninput = () => controlSynch(colorMid);
colorEnd.oninput = () => controlSynch(colorEnd);


class Cfg {
    constructor() {
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
        this.colorStart = hexToRgb(byId("color-start").value);
        this.colorMid = hexToRgb(byId("color-mid").value);
        this.colorEnd = hexToRgb(byId("color-end").value);
    }
}
const config = new Cfg();

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

// Canvas setup
const canvas = byId("particle-canvas");
const ctx = canvas.getContext("2d");

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
  const conf = {
    x: (canvas.width / 2) - (1 + Math.floor(Math.random() * 8)),
    y: (canvas.height / 2) + (Math.random() * 2 - 1) * halfSpan,
    vx: Math.cos(angle) * cfg.speed,
    vy: Math.sin(angle) * cfg.speed,
    size: pSize,
    alpha: cfg.alpha,
    life: cfg.life,
    maxLife: cfg.maxLife 
  };
  return new Particle(conf);
}

class ParticleEmitter {
    constructor(cfg) {
        this.setColors(cfg);
        this.particles = [];
    }
    setColors(cfg) {
        this.startRgb = cfg.colorStart;
        this.midRgb = cfg.colorMid;
        this.endRgb = cfg.colorEnd;
    }
    add(p) {
        this.particles.push(p);
    }
    update(cfg) {
        this.setColors(cfg);
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            p.update();

            if ( p.life <= 0 ) {
            this.particles.splice(i, 1);
            continue;
            }

            // Lifetime ratios
            const lifeRatio = p.life / p.maxLife;       // 1 → 0
            const t = 1 - lifeRatio;                    // 0 → 1

            // Color interpolation
            let color = {};
            if ( t < 0.5 ) {
                color = lerpColor(this.startRgb, this.midRgb, t * 2);
            } else {
                color = lerpColor(this.midRgb, this.endRgb, (t - 0.5) * 2);
            }

            // Alpha over lifetime (ease-out)
            const fade = lifeRatio * lifeRatio;
            const alpha = p.alpha * fade;

            p.draw(ctx, color, alpha);
        }
    }
}

const particleEmitter = new ParticleEmitter(config);

// Animation loop
function animate() {
  particleEmitter.add(spawnParticle(config));
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  particleEmitter.update(config);
  requestAnimationFrame(animate);
}

animate();
