const canvas = document.getElementById('sky');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let centerX = canvas.width / 2;
let centerY = canvas.height / 1.15;

// ------------------ Rotation Speed ------------------
const skySpeed = 0.0002; // all stars rotate at this slow rate

// ------------------ Stars ------------------
const totalStars = 400;
const stars = [];

// ------------------ Constellations (polar coordinates) ------------------
const scale = Math.min(canvas.width, canvas.height) / 300;

// Ursa Minor
const urMinor = [
    {x:0,y:0},{x:-10,y:-40},{x:10,y:-60},{x:25,y:-50},
    {x:35,y:-30},{x:15,y:-20},{x:0,y:-10}
];
// Ursa Major
const urMajor = [
    {x:-50,y:50},{x:-30,y:30},{x:-10,y:40},{x:10,y:30},
    {x:30,y:40},{x:50,y:20},{x:40,y:0}
];
// Orion (compact & stylized)
const orion = [
    {x:100,y:60},   // Betelgeuse (top-left shoulder)
    {x:140,y:100},  // belt left
    {x:160,y:110},  // belt center
    {x:180,y:100},  // belt right
    {x:220,y:60},   // Bellatrix (top-right shoulder)
    {x:140,y:150},  // Saiph (lower left leg)
    {x:180,y:150}   // Rigel (lower right leg)
];

// Cassiopeia (W shape)
const cassiopeia = [
    {x:-150, y:-50}, {x:-120, y:-80}, {x:-90, y:-50},
    {x:-60, y:-80}, {x:-30, y:-50}
];

// Pleiades (tight cluster)
const pleiades = [
    {x:180, y:-150}, {x:190, y:-140}, {x:200, y:-145},
    {x:210, y:-135}, {x:220, y:-140}, {x:215, y:-150}, {x:205, y:-155}
];

// Merge all constellations
const constellationPoints = [...urMinor, ...urMajor, ...orion, ...cassiopeia, ...pleiades];

// Add constellations to stars array
constellationPoints.forEach(c => {
    const x = c.x * scale;
    const y = c.y * scale;
    const radius = Math.sqrt(x*x + y*y);
    const angle = Math.atan2(y, x);
    stars.push({
        radius: radius,
        angle: angle,
        size: 1.4 + Math.random()*0.5 // slightly brighter
    });
});

// Fill remaining stars randomly around center
while(stars.length < totalStars){
    const radius = Math.random()*Math.sqrt(centerX*centerX + centerY*centerY);
    const angle = Math.random()*Math.PI*2;
    stars.push({
        radius: radius,
        angle: angle,
        size: Math.random()*1.8
    });
}

// ------------------ Shooting Stars ------------------
const shootingStars = [];
function createShootingStar(){
    shootingStars.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height/2,
        length: Math.random()*200+100,
        speed: Math.random()*10+5,
        angle: Math.random()*0.4+0.2
    });
}

// ------------------ Satellites ------------------
const satellites = [];
function createSatellite(){
    satellites.push({
        x:0,
        y:Math.random()*canvas.height/2,
        speed: Math.random()*2+1
    });
}

// ------------------ Planets ------------------
const planets=[];
const planetColors=['white','white','white'];
function createPlanet(){
    const startY = Math.random()*canvas.height/2 + 50;
    const amplitude = Math.random()*100+50;
    const speed = Math.random()*0.1+0.003;
    const color = planetColors[Math.floor(Math.random()*planetColors.length)];
    planets.push({
        x:-10,
        y:startY,
        startY:startY,
        amplitude:amplitude,
        speed:speed,
        color: color
    });
}

// ------------------ Drawing ------------------
function drawStars(){
    ctx.fillStyle="#0EBAE1";
    stars.forEach(star=>{
        const x = centerX + star.radius*Math.cos(star.angle);
        const y = centerY + star.radius*Math.sin(star.angle);
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI*2);
        ctx.fill();
        star.angle += skySpeed; // same speed for all stars
    });
}

function drawShootingStars(){
    ctx.strokeStyle='white';
    ctx.lineWidth=2;
    for(let i=shootingStars.length-1;i>=0;i--){
        const s=shootingStars[i];
        ctx.beginPath();
        ctx.moveTo(s.x,s.y);
        ctx.lineTo(s.x - s.length*Math.cos(s.angle), s.y - s.length*Math.sin(s.angle));
        ctx.stroke();
        s.x += s.speed*Math.cos(s.angle);
        s.y += s.speed*Math.sin(s.angle);
        if(s.x>canvas.width || s.y>canvas.height) shootingStars.splice(i,1);
    }
}

function drawSatellites(){
    ctx.fillStyle='lightgreen';
    for(let i=satellites.length-1;i>=0;i--){
        const sat=satellites[i];
        ctx.beginPath();
        ctx.arc(sat.x,sat.y,2,0,Math.PI*2);
        ctx.fill();
        sat.x += sat.speed;
        if(sat.x>canvas.width) satellites.splice(i,1);
    }
}

function drawPlanets(){
    for(let i=planets.length-1;i>=0;i--){
        const p=planets[i];
        const progress = p.x/canvas.width;
        p.y = p.startY - Math.sin(progress*Math.PI)*p.amplitude;
        ctx.fillStyle=p.color;
        ctx.beginPath();
        ctx.arc(p.x,p.y,6,0,Math.PI*2);
        ctx.fill();
        p.x += p.speed;
        if(p.x-6>canvas.width) planets.splice(i,1);
    }
}

// ------------------ Animation ------------------
const bg = new Image();
bg.src = "sky.png";

function animate(){
// draw background first
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    drawStars();
    drawPlanets();
    drawShootingStars();
    drawSatellites();

    requestAnimationFrame(animate);
}

// ------------------ Intervals ------------------
setInterval(createShootingStar,3000);
setInterval(createSatellite,5000);
setInterval(createPlanet,8000);

animate();

// ------------------ Resize ------------------
window.addEventListener('resize',()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    centerX = canvas.width/2;
    centerY = canvas.height/2;
});
