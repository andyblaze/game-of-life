<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Fractal Explosions with Wraparound</title>
<style>
  body { margin:0; overflow:hidden; background:#111; }
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

// Shape class
class Shape {
  constructor(x, y, radius, color, generation=0) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.generation = generation;
    this.alpha = 1;
    this.vx = (Math.random()-0.5)*2;
    this.vy = (Math.random()-0.5)*2;
    this.explodeTimer = Math.random()*60 + 30;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.01;
    this.explodeTimer--;
  }
  draw(ctx) {
    const positions = [{x:this.x,y:this.y}];

    // Wraparound offsets
    if(this.x - this.radius < 0) positions.push({x:this.x+canvas.width, y:this.y});
    if(this.x + this.radius > canvas.width) positions.push({x:this.x-canvas.width, y:this.y});
    if(this.y - this.radius < 0) positions.push({x:this.x, y:this.y+canvas.height});
    if(this.y + this.radius > canvas.height) positions.push({x:this.x, y:this.y-canvas.height});
    // Corners
    if(this.x - this.radius < 0 && this.y - this.radius < 0) positions.push({x:this.x+canvas.width, y:this.y+canvas.height});
    if(this.x + this.radius > canvas.width && this.y - this.radius < 0) positions.push({x:this.x-canvas.width, y:this.y+canvas.height});
    if(this.x - this.radius < 0 && this.y + this.radius > canvas.height) positions.push({x:this.x+canvas.width, y:this.y-canvas.height});
    if(this.x + this.radius > canvas.width && this.y + this.radius > canvas.height) positions.push({x:this.x-canvas.width, y:this.y-canvas.height});

    positions.forEach(pos=>{
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = 12;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    });
  }
  shouldExplode() {
    return this.explodeTimer <= 0 && this.generation < 3 && this.alpha > 0.2;
  }
}

// Particle class
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random()-0.5)*3;
    this.vy = (Math.random()-0.5)*3;
    this.alpha = 1;
    this.radius = Math.random()*2+1;
    this.color = color;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.03;
  }
  draw(ctx) {
    const positions = [{x:this.x,y:this.y}];

    if(this.x - this.radius < 0) positions.push({x:this.x+canvas.width, y:this.y});
    if(this.x + this.radius > canvas.width) positions.push({x:this.x-canvas.width, y:this.y});
    if(this.y - this.radius < 0) positions.push({x:this.x, y:this.y+canvas.height});
    if(this.y + this.radius > canvas.height) positions.push({x:this.x, y:this.y-canvas.height});
    if(this.x - this.radius < 0 && this.y - this.radius < 0) positions.push({x:this.x+canvas.width, y:this.y+canvas.height});
    if(this.x + this.radius > canvas.width && this.y - this.radius < 0) positions.push({x:this.x-canvas.width, y:this.y+canvas.height});
    if(this.x - this.radius < 0 && this.y + this.radius > canvas.height) positions.push({x:this.x+canvas.width, y:this.y-canvas.height});
    if(this.x + this.radius > canvas.width && this.y + this.radius > canvas.height) positions.push({x:this.x-canvas.width, y:this.y-canvas.height});

    positions.forEach(pos=>{
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    });
  }
}

// Arrays
let shapes = [];
let particles = [];

// Initial seeds
for(let i=0;i<25;i++){
  const x = Math.random()*canvas.width;
  const y = Math.random()*canvas.height;
  const radius = 20 + Math.random()*20;
  const color = `hsl(${Math.random()*360},80%,60%)`;
  shapes.push(new Shape(x,y,radius,color));
}

// FPS monitoring
let lastTime = performance.now();
let frameCount = 0;

function animate() {
  ctx.fillStyle = "rgba(17,17,17,0.4)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // Update & draw shapes
  for(let i=shapes.length-1;i>=0;i--){
    const s = shapes[i];
    s.update();
    s.draw(ctx);

    if(s.shouldExplode()){
      const numChildren = 2 + Math.floor(Math.random()*3);
      for(let c=0;c<numChildren;c++){
        const angle = Math.random()*Math.PI*2;
        const childRadius = s.radius*0.5;
        const childColor = `hsl(${Math.random()*360},80%,60%)`;
        shapes.push(new Shape(s.x + Math.cos(angle)*childRadius, s.y + Math.sin(angle)*childRadius, childRadius, childColor, s.generation+1));
      }
      for(let p=0;p<10;p++){
        particles.push(new Particle(s.x, s.y, s.color));
      }
      shapes.splice(i,1);
    } else if(s.alpha <=0){
      shapes.splice(i,1);
    }
  }

  // Update & draw particles
  for(let i=particles.length-1;i>=0;i--){
    const p = particles[i];
    p.update();
    p.draw(ctx);
    if(p.alpha<=0) particles.splice(i,1);
  }

  // Auto-seed new shapes
  if(shapes.length<20){
    const x = Math.random()*canvas.width;
    const y = Math.random()*canvas.height;
    const radius = 20 + Math.random()*20;
    const color = `hsl(${Math.random()*360},80%,60%)`;
    shapes.push(new Shape(x,y,radius,color));
  }

  // FPS logging
  frameCount++;
  if(frameCount % 60 === 0){
    const now = performance.now();
    const fps = Math.round(60000 / (now - lastTime));
    console.log("FPS:", fps);
    lastTime = now;
  }

  requestAnimationFrame(animate);
}

animate();
</script>
</body>
</html>
