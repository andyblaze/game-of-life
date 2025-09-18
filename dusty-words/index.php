<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Dusty Words - Random Placement</title>
<style>
  body {
    margin: 0;
    overflow: hidden;
    background: #000; /* parchment-like */
  }
  canvas { display: block; }
</style>
</head>
<body>
<canvas id="canvas"></canvas>
<script type="text/javascript">
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
/* === CONFIGURATION === */
const CONFIG = {
  SPAWN_X: canvas.width / 2,   // center of fountain
  SPAWN_WIDTH: 400,             // how wide the base is
  SPAWN_HEIGHT: 100, // how tall the vertical band is at the bottom
  CONE_ANGLE: 90, // spread around vertical
  INIT_SPEED: 1.5,
  NUM_PARTICLES: 1500,
  WORD_PARTICLE_COUNT: 500,
  FORM_STEPS: 480,
  HOLD_STEPS: 240,
  DISPERSAL_STEPS: 300,
  FREE_TIME: 600,
  WORDS: [
  "ᛗᚨᚷᛁᚲ",  // MAGIC
  "ᛚᛁᚹᛁᚾᚷ",  // LIVING
  "ᛞᚢᛊᛏ",    // DUST
  "ᚨᛚᛁᚹᛖ",   // ALIVE
  "ᚠᛁᚱᛖ",    // FIRE
  "ᚨᛊᚺ",     // ASH
  "ᛊᛗᚨᚲᛖ",   // SMOKE
  "ᛖᛗᛒᛖᚱᛊ", // EMBERS
  "ᚠᛚᚨᛗᛖ"    // FLAME
],
  FONT: "bold 120px serif",
  FORMATION_SPEED: 0.008,
  NOISE_SPEED: 0.3,
  DUST_DIRECTION: 270,
  SPEED_FACTOR: {
      MIN: 0.7,
      MAX: 2.7
  },
  NOISE_SCALE: 0.002,
  WORD_AREA: {           // configurable placement zone
    MIN_X: 150,
    MAX_X: window.innerWidth - 150,
    MIN_Y: 150,
    MAX_Y: window.innerHeight - 150
  },
  PARTICLE_COLORS: [
      "hsla(16, 100%, 54%, 1)",   // #ff4500 orange-red (flame core)
      "hsla(9, 100%, 64%, 1)",    // #ff6347 tomato orange
      "hsla(39, 100%, 50%, 1)",   // #ffa500 classic orange
      "hsla(51, 100%, 50%, 1)",   // #ffd700 golden yellow
      "hsla(60, 100%, 80%, 1)",   // #ffff99 pale yellow spark
      "hsla(0, 100%, 50%, 1)",    // #ff0000 deep red ember
      "hsla(0, 100%, 25%, 1)",    // #800000 smoldering dark red
      "hsla(0, 0%, 27%, 1)"       // #444444 occasional ash/ember fade
    ]
};
/* ====================== */



class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.tx = null;
    this.ty = null;
    this.inWord = false;
    this.color = CONFIG.PARTICLE_COLORS[Math.floor(Math.random() * CONFIG.PARTICLE_COLORS.length)];
  }

  update() {
    if (this.inWord && this.tx !== null && this.ty !== null) {
      this.x += (this.tx - this.x) * CONFIG.FORMATION_SPEED;
      this.y += (this.ty - this.y) * CONFIG.FORMATION_SPEED;
    } else {
      // Brownian motion + perlin drift
      let rad = CONFIG.DUST_DIRECTION * Math.PI / 180;
      let dx = Math.cos(rad) * CONFIG.NOISE_SPEED;
      let dy = Math.sin(rad) * CONFIG.NOISE_SPEED;
      let n = perlin(this.x * CONFIG.NOISE_SCALE, this.y * CONFIG.NOISE_SCALE);
      dx += (n - 0.5) * CONFIG.NOISE_SPEED;
      dy += (n - 0.5) * CONFIG.NOISE_SPEED;

// existing Brownian
let bx = this.vx;
let by = this.vy;

// CORRECT mapping: normalizedBottom = 0 at top, 1 at bottom
let normalizedBottom = Math.max(0, Math.min(1, this.y / canvas.height));

// linear interpolate: bottom -> SPEED_FACTOR_MAX, top -> SPEED_FACTOR_MIN
const sf = CONFIG.SPEED_FACTOR.MIN + (CONFIG.SPEED_FACTOR.MAX - CONFIG.SPEED_FACTOR.MIN) * normalizedBottom;

// apply combined motion scaled by sf
this.x += (bx + dx);// * sf;
this.y += (by + dy) * sf;

// Horizontal wrap stays the same
if (this.x < 0) this.x = canvas.width;
if (this.x > canvas.width) this.x = 0;

// Vertical wrap is customized for fire motes
if (this.y < 0) {
  // respawn at the fire base area
  this.x = CONFIG.SPAWN_X + (Math.random() - 0.5) * CONFIG.SPAWN_WIDTH;
  this.y = canvas.height - Math.random() * CONFIG.SPAWN_HEIGHT;
}
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, 1.5, 1.5);
  }
}

// Simple pseudo-perlin
function perlin(x, y){
  return (Math.sin(x*12.9898 + y*78.233) * 43758.5453 % 1 + 1) % 1;
}

const particles = [];
for (let i = 0; i < CONFIG.NUM_PARTICLES; i++) {
// spawn position
let x = CONFIG.SPAWN_X + (Math.random() - 0.5) * CONFIG.SPAWN_WIDTH;
let y = canvas.height - Math.random() * CONFIG.SPAWN_HEIGHT;

// initial velocity
let angleDeg = (Math.random() - 0.5) * CONFIG.CONE_ANGLE; // spread around vertical
let speed = CONFIG.INIT_SPEED || 1.5; // adjust as needed
let rad = angleDeg * Math.PI / 180;

let vx = Math.sin(rad) * speed; // horizontal
let vy = -Math.cos(rad) * speed; // vertical upward

particles.push(new Particle(x, y, vx, vy));
}

let wordPhase = 0;
let wordTimer = 0;
let wordTargets = [];
let currentWord = 0;

function createWordTargets(text) {
  const off = document.createElement("canvas");
  const octx = off.getContext("2d");
  off.width = canvas.width;
  off.height = canvas.height;
  octx.fillStyle = "black";
  octx.textAlign = "center";
  octx.textBaseline = "middle";
  octx.font = CONFIG.FONT;
  octx.fillText(text, off.width/2, off.height/2);

  const data = octx.getImageData(0, 0, off.width, off.height);
  const pts = [];
  for (let y = 0; y < off.height; y += 4) {
    for (let x = 0; x < off.width; x += 4) {
      const idx = (y * off.width + x) * 4;
      if (data.data[idx+3] > 128) pts.push({x,y});
    }
  }
  return pts;
}

function assignWordTargets(text) {
  const targets = createWordTargets(text);
  const sampleSize = Math.min(CONFIG.WORD_PARTICLE_COUNT, targets.length);

  // Random center position within WORD_AREA
  const centerX = CONFIG.WORD_AREA.MIN_X + Math.random() * (CONFIG.WORD_AREA.MAX_X - CONFIG.WORD_AREA.MIN_X);
  const centerY = CONFIG.WORD_AREA.MIN_Y + Math.random() * (CONFIG.WORD_AREA.MAX_Y - CONFIG.WORD_AREA.MIN_Y);

  wordTargets = [];
  for (let i = 0; i < sampleSize; i++) {
    const t = targets[Math.floor(Math.random() * targets.length)];
    wordTargets.push({
      x: t.x - canvas.width/2 + centerX,
      y: t.y - canvas.height/2 + centerY
    });
  }

  // assign particles
  const chosen = [];
  while (chosen.length < sampleSize) {
    const p = particles[Math.floor(Math.random() * particles.length)];
    if (!p.inWord) {
      p.inWord = true;
      p.tx = wordTargets[chosen.length].x;
      p.ty = wordTargets[chosen.length].y;
      chosen.push(p);
    }
  }
}

function releaseParticles() {
  for (const p of particles) {
    p.inWord = false;
    p.tx = null;
    p.ty = null;
  }
}

let lastTime = performance.now();
let frames = 0;
const bg = new Image();
bg.src = "bg.jpg";
function animate(time) {
  requestAnimationFrame(animate);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  //ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
  for (const p of particles) {
    p.update();
    p.draw();
  }

  // Word lifecycle
  wordTimer++;
  if (wordPhase === 0 && wordTimer > CONFIG.FREE_TIME) {
    assignWordTargets(CONFIG.WORDS[currentWord]);
    wordPhase = 1; wordTimer = 0;
  } else if (wordPhase === 1 && wordTimer > CONFIG.FORM_STEPS) {
    wordPhase = 2; wordTimer = 0;
  } else if (wordPhase === 2 && wordTimer > CONFIG.HOLD_STEPS) {
    releaseParticles();
    wordPhase = 3; wordTimer = 0;
  } else if (wordPhase === 3 && wordTimer > CONFIG.DISPERSAL_STEPS) {
    currentWord = (currentWord + 1) % CONFIG.WORDS.length;
    wordPhase = 0; wordTimer = 0;
  }

  // FPS
  frames++;
  if (time - lastTime >= 1000) {
    console.log("FPS:", frames);
    frames = 0;
    lastTime = time;
  }
}
animate();
</script>
</body>
</html>
