// Grab sliders and color pickers
const angleSlider = document.getElementById('angle-slider');
const sizeSlider = document.getElementById('size-slider');
const angleVal = document.getElementById('angle-val');
const sizeVal = document.getElementById('size-val');
const lifetimeSlider = document.getElementById('lifetime-slider');
const lifetimeVal = document.getElementById('lifetime-val');
const speedSlider = document.getElementById('speed-slider');
const speedVal = document.getElementById('speed-val');
const spreadSlider = document.getElementById('spread-slider');
const spreadVal = document.getElementById('spread-val');
const startOffsetSlider = document.getElementById('start-offset-slider');
const startOffsetVal = document.getElementById('start-offset-val');
const alphaSlider = document.getElementById('alpha-slider');
const alphaVal = document.getElementById('alpha-val');

const colorStart = document.getElementById('color-start');
const colorMid = document.getElementById('color-mid');
const colorEnd = document.getElementById('color-end');

// Update slider display
angleSlider.oninput = () => angleVal.textContent = angleSlider.value;
sizeSlider.oninput = () => sizeVal.textContent = sizeSlider.value;
lifetimeSlider.oninput = () => lifetimeVal.textContent = lifetimeSlider.value;
speedSlider.oninput = () => speedVal.textContent = speedSlider.value;
spreadSlider.oninput = () => spreadVal.textContent = spreadSlider.value;
startOffsetSlider.oninput = () => startOffsetVal.textContent = startOffsetSlider.value;
alphaSlider.oninput = () => alphaVal.textContent = alphaSlider.value;

// Canvas setup
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
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
    constructor() {

    }
    update() {

    }
    draw(ctx) {

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

  particles.push({
    x: (canvas.width / 2) - (1 + Math.floor(Math.random() * 8)),
    y: (canvas.height / 2) + (Math.random() * 2 - 1) * halfSpan,
    vx: Math.cos(angle) * speedSlider.value,
    vy: Math.sin(angle) * speedSlider.value,
    size: pSize,
    alpha: parseFloat(alphaSlider.value),
    life: parseInt(lifetimeSlider.value),
    maxLife: parseInt(lifetimeSlider.value)
  });
}

// Update and draw particles
function updateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    ctx.fillStyle = `rgba(
      ${Math.round(color.r)},
      ${Math.round(color.g)},
      ${Math.round(color.b)},
      ${alpha}
    )`;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
}


// Animation loop
function animate() {
  spawnParticle();
  updateParticles();
  requestAnimationFrame(animate);
}

animate();
