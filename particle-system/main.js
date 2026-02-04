// Grab sliders and color pickers
const sizeSlider = document.getElementById('size-slider');
const sizeVal = document.getElementById('size-val');
const lifetimeSlider = document.getElementById('lifetime-slider');
const lifetimeVal = document.getElementById('lifetime-val');
const speedSlider = document.getElementById('speed-slider');
const speedVal = document.getElementById('speed-val');
const spreadSlider = document.getElementById('spread-slider');
const spreadVal = document.getElementById('spread-val');
const alphaSlider = document.getElementById('alpha-slider');
const alphaVal = document.getElementById('alpha-val');

const colorStart = document.getElementById('color-start');
const colorMid = document.getElementById('color-mid');
const colorEnd = document.getElementById('color-end');

// Update slider display
sizeSlider.oninput = () => sizeVal.textContent = sizeSlider.value;
lifetimeSlider.oninput = () => lifetimeVal.textContent = lifetimeSlider.value;
speedSlider.oninput = () => speedVal.textContent = speedSlider.value;
spreadSlider.oninput = () => spreadVal.textContent = spreadSlider.value;
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

// Spawn a particle
function spawnParticle() {
  const angle = (Math.random() - 0.5) * spreadSlider.value * (Math.PI/180);
  particles.push({
    x: canvas.width/2,
    y: canvas.height/2,
    vx: Math.cos(angle) * speedSlider.value,
    vy: Math.sin(angle) * speedSlider.value,
    size: parseFloat(sizeSlider.value),
    alpha: parseFloat(alphaSlider.value),
    life: parseInt(lifetimeSlider.value),
    maxLife: parseInt(lifetimeSlider.value)
  });
}

// Update and draw particles
function updateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const startRgb = hexToRgb(colorStart.value);
  const midRgb = hexToRgb(colorMid.value);
  const endRgb = hexToRgb(colorEnd.value);

  for (let i = particles.length-1; i >= 0; i--) {
    const p = particles[i];

    // Move
    p.x += p.vx;
    p.y += p.vy;

    // Fade life
    p.life--;
    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    // Compute t for color interpolation (0=start, 0.5=mid, 1=end)
    let t = 1 - p.life / p.maxLife;
    let color;
    if (t < 0.5) {
      color = lerpColor(startRgb, midRgb, t*2);
    } else {
      color = lerpColor(midRgb, endRgb, (t-0.5)*2);
    }

    ctx.fillStyle = `rgba(${Math.round(color.r)},${Math.round(color.g)},${Math.round(color.b)},${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
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
