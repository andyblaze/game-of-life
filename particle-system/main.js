function byId(id) {
    return document.getElementById(id);
}

// Grab sliders and color pickers
const angleSlider = byId("angle-slider");
const sizeSlider = byId("size-slider");
const angleVal = byId("angle-val");
const sizeVal = byId("size-val");
const lifetimeSlider = byId("lifetime-slider");
const lifetimeVal = byId("lifetime-val");
const speedSlider = byId("speed-slider");
const speedVal = byId("speed-val");
const spreadSlider = byId("spread-slider");
const spreadVal = byId("spread-val");
const startOffsetSlider = byId("start-offset-slider");
const startOffsetVal = byId("start-offset-val");
const alphaSlider = byId("alpha-slider");
const alphaVal = byId("alpha-val");

const colorStart = byId("color-start");
const colorMid = byId("color-mid");
const colorEnd = byId("color-end");

// Update slider display
angleSlider.oninput = () => controlSynch(angleVal, angleSlider);
sizeSlider.oninput = () => controlSynch(sizeVal, sizeSlider);
lifetimeSlider.oninput = () => controlSynch(lifetimeVal, lifetimeSlider);
speedSlider.oninput = () => controlSynch(speedVal, speedSlider);
spreadSlider.oninput = () => controlSynch(spreadVal, spreadSlider);
startOffsetSlider.oninput = () => controlSynch(startOffsetVal, startOffsetSlider);
alphaSlider.oninput = () => controlSynch(alphaVal, alphaSlider);


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
    }
}
const config = new Cfg();

function controlSynch(label, ctrl) {
    label.textContent = ctrl.value;
    config.update();
}


controlSynch(angleVal, angleSlider);
controlSynch(sizeVal, sizeSlider);
controlSynch(lifetimeVal, lifetimeSlider);
controlSynch(speedVal, speedSlider);
controlSynch(spreadVal, spreadSlider);
controlSynch(startOffsetVal, startOffsetSlider);
controlSynch(alphaVal, alphaSlider);



// Canvas setup
const canvas = byId("particle-canvas");
const ctx = canvas.getContext("2d");
const particles = [];

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
        //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
  
  const baseAngle = cfg.baseAngle;

  // Spread: random offset from base angle
  const offset = (Math.random() - 0.5) * cfg.spread * (Math.PI / 180);

  const angle = baseAngle + offset;
  const pSize = cfg.size; 
  const startOffset = cfg.startOffset;
  const halfSpan = (startOffset + pSize * 2) / 2;
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
  particles.push(new Particle(conf));
}

class ParticleEmitter {
    constructor() {
        this.particles = [];
    }
    add(p) {
        this.particles.push(p);
    }
    update() {

    }
}

const particleEmitter = new ParticleEmitter();

// Update and draw particles
function updateParticles() {

  const startRgb = hexToRgb(colorStart.value);
  const midRgb   = hexToRgb(colorMid.value);
  const endRgb   = hexToRgb(colorEnd.value);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    p.update();

    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    // Lifetime ratios
    const lifeRatio = p.life / p.maxLife;       // 1 → 0
    const t = 1 - lifeRatio;                    // 0 → 1

    // Color interpolation
    let color;
    if (t < 0.5) {
      color = lerpColor(startRgb, midRgb, t * 2);
    } else {
      color = lerpColor(midRgb, endRgb, (t - 0.5) * 2);
    }

    // Alpha over lifetime (ease-out)
    const fade = lifeRatio * lifeRatio;
    const alpha = p.alpha * fade;
    //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    p.draw(ctx, color, alpha);
  }
}


// Animation loop
function animate() {
  spawnParticle(config);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  updateParticles();
  requestAnimationFrame(animate);
}

animate();
