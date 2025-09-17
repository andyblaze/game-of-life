<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Rune Carving – Hammer & Chisel</title>
<style>
  body {
    margin: 0;
    background: #d9c7a0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  canvas { display: block; background: #d9c7a0; }
</style>
</head>
<body>
<canvas id="canvas" width="600" height="400"></canvas>
<script>
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const rune = "ᚠ";
const runeFont = "120px serif";
const lightSource = { x: -1, y: -1 }; // top-left

// Offscreen canvas for full rune
const offCanvas = document.createElement('canvas');
offCanvas.width = canvas.width;
offCanvas.height = canvas.height;
const offCtx = offCanvas.getContext('2d');

// Draw rune with engraved effect
function drawRuneEngraved(ctx, rune) {
  ctx.save();
  ctx.font = runeFont;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const shadowOffsetX = lightSource.x * 2;
  const shadowOffsetY = lightSource.y * 2;
  const highlightOffsetX = -lightSource.x * 2;
  const highlightOffsetY = -lightSource.y * 2;

  // Dark shadow inside groove
  ctx.fillStyle = '#a08e66';
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowOffsetX = shadowOffsetX;
  ctx.shadowOffsetY = shadowOffsetY;
  ctx.fillText(rune, offCanvas.width/2, offCanvas.height/2);

  // Light highlight inside groove
  ctx.shadowColor = 'rgba(255,255,255,0.4)';
  ctx.shadowOffsetX = highlightOffsetX;
  ctx.shadowOffsetY = highlightOffsetY;
  ctx.fillText(rune, offCanvas.width/2, offCanvas.height/2);

  ctx.restore();
}

drawRuneEngraved(offCtx, rune);

// Determine rune bounding box (simple scan)
let minX = offCanvas.width, minY = offCanvas.height;
let maxX = 0, maxY = 0;
const imgData = offCtx.getImageData(0,0,offCanvas.width, offCanvas.height);
for (let y = 0; y < offCanvas.height; y++) {
  for (let x = 0; x < offCanvas.width; x++) {
    const alpha = imgData.data[(y*offCanvas.width + x)*4 + 3];
    if (alpha > 0) {
      if(x<minX) minX=x; if(x>maxX) maxX=x;
      if(y<minY) minY=y; if(y>maxY) maxY=y;
    }
  }
}

// Particle system
let particles = [];
function spawnParticle(x, y) {
  particles.push({
    x, 
    y,
    vx: (Math.random()-0.5)*1.5,   // slight left/right
    vy: Math.random()*1.5 + 0.5,   // downward
    alpha: 1,
    size: Math.random()*2+1
  });
}
function updateParticles() {
  for (let p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.05; // gravity
    p.alpha -= 0.03;
  }
  particles = particles.filter(p => p.alpha > 0);
}
function drawParticles() {
  for (let p of particles) {
    ctx.fillStyle = `rgba(120,100,80,${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
    ctx.fill();
  }
}

// Hammer & chisel carving
let revealedRects = [];
const hitSize = 15; // size of each hit cluster
function carveHit() {
  // Pick random point inside bounding box
  const x = Math.floor(Math.random()*(maxX-minX-hitSize)+minX);
  const y = Math.floor(Math.random()*(maxY-minY-hitSize)+minY);
  revealedRects.push({x,y});
  
  // Spawn particles at hit
  for(let i=0;i<5;i++) spawnParticle(x + Math.random()*hitSize, y + Math.random()*hitSize);
}

function drawHits() {
  for (const r of revealedRects) {
    ctx.drawImage(offCanvas, r.x, r.y, hitSize, hitSize, r.x, r.y, hitSize, hitSize);
  }
}

let frameCount = 0;
const hitInterval = 10; // hit every 5 frames

// Animation loop
function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  frameCount++;
  if (frameCount % hitInterval === 0 && revealedRects.length < 150) {
    carveHit();
  }

  drawHits();
  updateParticles();
  drawParticles();

  requestAnimationFrame(animate);
}

animate();
</script>
</body>
</html>
