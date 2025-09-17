<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Dusty Words</title>
<style>
  body {
    margin: 0;
    overflow: hidden;
    background: #d8c9a6; /* parchment-like */
  }
  canvas { display: block; }
</style>
</head>
<body>
<canvas id="canvas"></canvas>
<script>
/* === CONFIGURATION === */
const CONFIG = {
  NUM_PARTICLES: 2000,       // background dust
  WORD_PARTICLE_COUNT: 500,  // how many dust join the word
  FORM_STEPS: 400,           // frames to form word (higher = slower formation)
  FORMATION_SPEED: 0.01, // smaller = slower drift into word
  HOLD_STEPS: 240,           // frames to hold word
  DISPERSAL_STEPS: 440,      // frames before next word starts
  FREE_TIME: 300,            // idle dust frames between words
  WORDS: ["MAGIC", "LIVING", "DUST", "ALIVE", "FIRE", "ASH", "SMOKE", "EMBERS", "FLAME"],
  FONT: "bold 120px serif"
};
/* ====================== */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.tx = null;
    this.ty = null;
    this.inWord = false;
  }
  update() {
    if (this.inWord && this.tx !== null && this.ty !== null) {
      this.x += (this.tx - this.x) * CONFIG.FORMATION_SPEED;
      this.y += (this.ty - this.y) * CONFIG.FORMATION_SPEED;
    } else {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }
  }
  draw() {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(this.x, this.y, 1.5, 1.5);
  }
}

const particles = [];
for (let i = 0; i < CONFIG.NUM_PARTICLES; i++) {
  particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
}

let wordPhase = 0; // 0=free,1=form,2=hold,3=disperse
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
      if (data.data[idx+3] > 128) {
        pts.push({x, y});
      }
    }
  }
  return pts;
}

function assignWordTargets(text) {
  const targets = createWordTargets(text);
  wordTargets = [];
  const sampleSize = Math.min(CONFIG.WORD_PARTICLE_COUNT, targets.length);
  for (let i = 0; i < sampleSize; i++) {
    const t = targets[Math.floor(Math.random() * targets.length)];
    wordTargets.push(t);
  }
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

function animate(time) {
  requestAnimationFrame(animate);
  ctx.clearRect(0,0,canvas.width,canvas.height);

  for (const p of particles) {
    p.update();
    p.draw();
  }

  // Word lifecycle with config params
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

  // FPS counter
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
