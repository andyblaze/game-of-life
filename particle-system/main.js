function byId(id) {
    return document.getElementById(id);
}

function labelSynch(label, ctrl) {
    label.textContent = ctrl.value;
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
angleSlider.oninput = () => labelSynch(angleVal, angleSlider);//angleVal.textContent = angleSlider.value;
sizeSlider.oninput = () => labelSynch(sizeVal, sizeSlider);//sizeVal.textContent = sizeSlider.value;
lifetimeSlider.oninput = () => labelSynch(lifetimeVal, lifetimeSlider);//lifetimeVal.textContent = lifetimeSlider.value;
speedSlider.oninput = () => labelSynch(speedVal, speedSlider);//speedVal.textContent = speedSlider.value;
spreadSlider.oninput = () => labelSynch(spreadVal, spreadSlider);//spreadVal.textContent = spreadSlider.value;
startOffsetSlider.oninput = () => labelSynch(startOffsetVal, startOffsetSlider);//startOffsetVal.textContent = startOffsetSlider.value;
alphaSlider.oninput = () => labelSynch(alphaVal, alphaSlider);//alphaVal.textContent = alphaSlider.value;

labelSynch(angleVal, angleSlider);
labelSynch(sizeVal, sizeSlider);
labelSynch(lifetimeVal, lifetimeSlider);
labelSynch(speedVal, speedSlider);
labelSynch(spreadVal, spreadSlider);
labelSynch(startOffsetVal, startOffsetSlider);
labelSynch(alphaVal, alphaSlider);

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

const Cfg = {

};

class Particle {
    constructor(cfg) {
        this.x = cfg.x;
        this.y = cfg.y;
        this.vx = cfg.vx;
        this.vy = cfg.vy;
        this.size = cfg.size;
        this.alpha = cfg.alpha;
        this.life = cfg.life;
        this.maxLife = cfg.maxLife;
    }
    update() {

    }
    draw(ctx, color, alpha) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
function spawnParticle() {
  // Base angle from slider (degrees → radians)
  const baseAngle = parseFloat(angleSlider.value) * (Math.PI / 180);

  // Spread: random offset from base angle
  const offset = (Math.random() - 0.5) * spreadSlider.value * (Math.PI / 180);

  const angle = baseAngle + offset;
  const pSize = parseFloat(sizeSlider.value);
  const startOffset = parseFloat(startOffsetSlider.value);
  const halfSpan = (startOffset + pSize * 2) / 2;
  const conf = {
    x: (canvas.width / 2) - (1 + Math.floor(Math.random() * 8)),
    y: (canvas.height / 2) + (Math.random() * 2 - 1) * halfSpan,
    vx: Math.cos(angle) * speedSlider.value,
    vy: Math.sin(angle) * speedSlider.value,
    size: pSize,
    alpha: parseFloat(alphaSlider.value),
    life: parseInt(lifetimeSlider.value),
    maxLife: parseInt(lifetimeSlider.value)
  };
  particles.push(new Particle(conf));
  //console.log(conf);
}

// Update and draw particles
function updateParticles() {

  const startRgb = hexToRgb(colorStart.value);
  const midRgb   = hexToRgb(colorMid.value);
  const endRgb   = hexToRgb(colorEnd.value);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    // Move
    p.x += p.vx;
    p.y += p.vy;

    // Age
    p.life--;
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

    p.draw(ctx, color, alpha);

    /*ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `rgba(
      ${Math.round(color.r)},
      ${Math.round(color.g)},
      ${Math.round(color.b)},
      ${alpha}
    )`;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();*/
  }
}


// Animation loop
function animate() {
  spawnParticle();
  updateParticles();
  requestAnimationFrame(animate);
}

animate();
