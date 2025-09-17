<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Interactive Dust - Smooth Dispersal</title>
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

// PARAMETERS
const dustCount = 800;
let dustParticles = [];
let wordParticles = [];
let showWord = false;
const words = ["MAGIC", "LIVING", "DUST", "ALIVE"];
let currentWord = "";
let wordTimer = 0;
const wordLife = 600; // 10 seconds to form
const lingerTime = 180; // 3 seconds linger

// MAIN PARTICLE CLASS
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random()-0.5)*0.5;
    this.vy = (Math.random()-0.5)*0.5;
    this.radius = Math.random()*1.5+0.5;
    this.alpha = Math.random()*0.5 + 0.3;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx += (Math.random()-0.5)*0.01;
    this.vy += (Math.random()-0.5)*0.01;
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

// WORD PARTICLE
class WordParticle extends Particle {
  constructor(x, y) {
    super(Math.random()*canvas.width, Math.random()*canvas.height);
    this.targetX = x;
    this.targetY = y;
    this.alpha = 0;
    this.released = false;
  }
  update(progress){
    if(progress < 1){
      // Move toward target gradually
      this.x += (this.targetX - this.x) * 0.02 * progress;
      this.y += (this.targetY - this.y) * 0.02 * progress;
      this.alpha = progress;
    } else if(progress < 1 + lingerTime/wordLife){
      // Hold with slight jitter
      this.x += (Math.random()-0.5)*0.3;
      this.y += (Math.random()-0.5)*0.3;
      this.alpha = 1;
    } else {
      // Release into swirling dust
      if(!this.released){
        const angle = Math.random()*2*Math.PI;
        const speed = Math.random()*0.3 + 0.1;
        this.vx = Math.cos(angle)*speed;
        this.vy = Math.sin(angle)*speed;
        dustParticles.push(this);
        this.released = true;
      }
      // Move as free dust
      this.x += this.vx;
      this.y += this.vy;
      this.vx += (Math.random()-0.5)*0.01;
      this.vy += (Math.random()-0.5)*0.01;
      if(this.x<0) this.x=canvas.width;
      if(this.x>canvas.width) this.x=0;
      if(this.y<0) this.y=canvas.height;
      if(this.y>canvas.height) this.y=0;
      // Keep visible in dust layer
      this.alpha = 0.4 + Math.random()*0.1;
    }
  }
  draw(ctx){
    if(!this.released || this.alpha>0){
      ctx.fillStyle = `rgba(80,50,30,${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
      ctx.fill();
    }
  }
}

// INIT DUST
function initDust(){
  for(let i=0;i<dustCount;i++){
    dustParticles.push(new Particle(Math.random()*canvas.width, Math.random()*canvas.height));
  }
}

// CREATE WORD PARTICLES
function createWordParticles(word){
  wordParticles = [];
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
  wordTimer = 0;
  showWord = true;
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  dustParticles.forEach(p => { p.update(); p.draw(ctx); });

  if(!showWord && Math.random()<0.01){
    const word = words[Math.floor(Math.random()*words.length)];
    createWordParticles(word);
  }

  if(showWord){
    wordTimer++;
    const progress = wordTimer / wordLife;
    wordParticles.forEach(wp => { wp.update(progress); wp.draw(ctx); });
    if(progress > 1 + lingerTime/wordLife + 0.5){
      showWord=false;
      wordParticles = [];
    }
  }

  requestAnimationFrame(animate);
}

initDust();
animate();
</script>
</body>
</html>
