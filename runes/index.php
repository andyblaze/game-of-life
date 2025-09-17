<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Multiple Rune Carving</title>
<style>
  body { margin:0; background:#d9c7a0; display:flex; justify-content:center; align-items:center; height:100vh; }
  canvas { display:block; background:#d9c7a0; }
</style>
</head>
<body>
<canvas id="canvas" width="600" height="400"></canvas>
<script>
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Configurable runes
const runes = ["ᚠ","ᚢ"]; // add more
const runeFont = "120px serif";
const lightSource = {x:-1,y:-1};

// Assign each rune a position
const runePositions = [
  {x: canvas.width/4, y: canvas.height/2},
  {x: 3*canvas.width/4, y: canvas.height/2}
];

// Offscreen canvases for each rune
const runeCanvases = runes.map(() => {
  const c = document.createElement('canvas');
  c.width = canvas.width;
  c.height = canvas.height;
  return c;
});

// Draw engraved rune on offscreen canvas
function drawRuneEngraved(ctx,rune,posX,posY){
  ctx.save();
  ctx.font=runeFont;
  ctx.textAlign='center';
  ctx.textBaseline='middle';

  const shadowOffsetX = lightSource.x*2;
  const shadowOffsetY = lightSource.y*2;
  const highlightOffsetX = -lightSource.x*2;
  const highlightOffsetY = -lightSource.y*2;

  ctx.fillStyle='#a08e66';
  ctx.shadowColor='rgba(0,0,0,0.6)';
  ctx.shadowOffsetX=shadowOffsetX;
  ctx.shadowOffsetY=shadowOffsetY;
  ctx.fillText(rune,posX,posY);

  ctx.shadowColor='rgba(255,255,255,0.4)';
  ctx.shadowOffsetX=highlightOffsetX;
  ctx.shadowOffsetY=highlightOffsetY;
  ctx.fillText(rune,posX,posY);

  ctx.restore();
}

// Pre-render all runes at their positions
runes.forEach((r,i)=>drawRuneEngraved(runeCanvases[i].getContext('2d'),r,runePositions[i].x,runePositions[i].y));

// Collect hit rectangles for all runes
let hitPool=[];
const hitSize=15;
runeCanvases.forEach((rc,index)=>{
  const imgData = rc.getContext('2d').getImageData(0,0,rc.width,rc.height);
  for(let y=0;y<rc.height;y+=4){
    for(let x=0;x<rc.width;x+=4){
      const alpha = imgData.data[(y*rc.width+x)*4+3];
      if(alpha>0) hitPool.push({x,y,runeIndex:index});
    }
  }
});

// Shuffle hits
hitPool = hitPool.sort(()=>Math.random()-0.5);

// Particle system
let particles=[];
function spawnParticle(x,y){
  particles.push({x,y,vx:(Math.random()-0.5)*1.5,vy:Math.random()*1.5+0.5,alpha:1,size:Math.random()*2+1});
}
function updateParticles(){
  for(let p of particles){
    p.x+=p.vx;
    p.y+=p.vy;
    p.vy+=0.05;
    p.alpha-=0.03;
  }
  particles = particles.filter(p=>p.alpha>0);
}
function drawParticles(){
  for(const p of particles){
    ctx.fillStyle=`rgba(120,100,80,${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fill();
  }
}

// Revealed hit rectangles
let revealedRects=[];

// Hit rate control
let frameCount=0;
const hitInterval=45; // hit every 5 frames
const hitsPerInterval=5; // hits per interval

function carveHits(){
  for(let i=0;i<hitsPerInterval && hitPool.length>0;i++){
    const hit=hitPool.pop();
    revealedRects.push(hit);
    const pos = runePositions[hit.runeIndex];
    // spawn a few particles at the hit position
    for(let j=0;j<3;j++) spawnParticle(hit.x, hit.y);
  }
}

function drawHits(){
  revealedRects.forEach(hit=>{
    const rc = runeCanvases[hit.runeIndex];
    const pos = runePositions[hit.runeIndex];
    // offset hit rectangles to rune position
    ctx.drawImage(rc, hit.x, hit.y, hitSize, hitSize, hit.x, hit.y, hitSize, hitSize);
  });
}

// Animation loop
function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  frameCount++;
  if(frameCount%hitInterval===0 && hitPool.length>0) carveHits();
  drawHits();
  updateParticles();
  drawParticles();
  requestAnimationFrame(animate);
}

animate();
</script>
</body>
</html>
