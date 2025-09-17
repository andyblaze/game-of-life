<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Interactive Dust - Smooth Word Formation</title>
<style>
  body { margin:0; overflow:hidden; background:#f5e3c4; }
  canvas { display:block; }
</style>
</head>
<body>
<canvas id="canvas"></canvas>
<script>
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const dustCount = 300;
let particles = [];
let wordParticles = [];
let showWord = false;
const words = ["MAGIC", "LIVING", "DUST", "ALIVE"];
let currentWord = words[Math.floor(Math.random()*words.length)];
let wordTimer = 0;
const wordLife = 600; // 10 seconds to fully form

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random()-0.5)*0.2;
    this.vy = (Math.random()-0.5)*0.2;
    this.radius = Math.random()*1.5+0.5;
    this.alpha = Math.random()*0.5 + 0.3;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Wraparound
    if(this.x<0) this.x=canvas.width;
    if(this.x>canvas.width) this.x=0;
    if(this.y<0) this.y=canvas.height;
    if(this.y>canvas.height) this.y=0;
  }
  draw(ctx){
    ctx.fillStyle = `rgba(100,70,50,${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
    ctx.fill();
  }
}

// Word particle
class WordParticle {
  constructor(x, y) {
    this.x = Math.random()*canvas.width;
    this.y = Math.random()*canvas.height;
    this.targetX = x;
    this.targetY = y;
    this.radius = Math.random()*1.5+0.5;
    this.alpha = 0;
  }
  update(progress){
    // Move toward target gradually
    this.x += (this.targetX - this.x) * 0.02 * progress;
    this.y += (this.targetY - this.y) * 0.02 * progress;

    // Tiny random jitter
    this.x += (Math.random()-0.5)*0.3;
    this.y += (Math.random()-0.5)*0.3;

    // Smooth alpha fade in
    this.alpha = progress;
  }
  draw(ctx){
    ctx.fillStyle = `rgba(80,50,30,${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
    ctx.fill();
  }
}

function initParticles(){
  for(let i=0;i<dustCount;i++){
    particles.push(new Particle(Math.random()*canvas.width, Math.random()*canvas.height));
  }
}

function createWordParticles(word){
  wordParticles = [];
  ctx.font = "bold 120px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const offCanvas = document.createElement("canvas");
  offCanvas.width = canvas.width;
  offCanvas.height = canvas.height;
  const offCtx = offCanvas.getContext("2d");
  offCtx.font = "bold 120px serif";
  offCtx.textAlign = "center";
  offCtx.textBaseline = "middle";
  offCtx.fillStyle = "black";
  offCtx.fillText(word, canvas.width/2, canvas.height/2);

  const imgData = offCtx.getImageData(0,0,canvas.width,canvas.height);
  for(let y=0;y<imgData.height;y+=6){
    for(let x=0;x<imgData.width;x+=6){
      const index = (y*imgData.width + x)*4;
      if(imgData.data[index+3]>128){
        wordParticles.push(new WordParticle(x,y));
      }
    }
  }
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Update & draw dust
  for(const p of particles){
    p.update();
    p.draw(ctx);
  }

  // Occasionally trigger a word
  if(!showWord && Math.random()<0.002){
    showWord = true;
    currentWord = words[Math.floor(Math.random()*words.length)];
    createWordParticles(currentWord);
    wordTimer = 0;
  }

  if(showWord){
    wordTimer++;
    const progress = Math.min(wordTimer / wordLife, 1);
    for(const wp of wordParticles){
      wp.update(progress);
      wp.draw(ctx);
    }
    if(wordTimer > wordLife + 180){ // linger 3s then disappear
      showWord=false;
      wordParticles=[];
    }
  }

  requestAnimationFrame(animate);
}

initParticles();
animate();
</script>
</body>
</html>
