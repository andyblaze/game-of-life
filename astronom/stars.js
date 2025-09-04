//const canvas = document.getElementById('sky');
//const ctx = canvas.getContext('2d');
import { mt_rand, clamp } from "./functions.js";

const width = window.innerWidth;
const height = window.innerHeight;
let centerX = width / 2;
let centerY = height / 2;

// ------------------ Rotation Speed ------------------
const skySpeed = 0.00004; // all stars rotate at this slow rate

// ------------------ Stars ------------------
const totalStars = 400;
const stars = [];

// ------------------ Constellations (polar coordinates) ------------------
const scale = Math.min(width, height) / 300;

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
        size: Math.round(1.4 + Math.random()*0.5) // slightly brighter
    });
});

// Fill remaining stars randomly around center
while(stars.length < totalStars){
    const radius = Math.random()*Math.sqrt(centerX*centerX + centerY*centerY);
    const angle = Math.random()*Math.PI*2;
    stars.push({
        radius: radius,
        angle: angle,
        size: Math.round(Math.random()*3)
    });
}


// ------------------ Drawing ------------------
export default function drawStars(ctx){
    const starColors = [
        "#0EBAE1", // your original
        "#19C3F0",
        "#24AEE0",
        "#1DA1D2",
        "#3CC6E8",
        "#4AB5D9",
        "#2F9FC4",
        "#55D0EE",
        "#38B8E2",
        "#1B8FB8"
    ];
    ctx.fillStyle = starColors[0];//mt_rand(0, starColors.length - 1)]; //"#0EBAE1";
    stars.forEach(star=>{
        const x = centerX + star.radius*Math.cos(star.angle);
        const y = centerY + star.radius*Math.sin(star.angle);
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI*2);
        ctx.fill();
        star.angle += skySpeed; // same speed for all stars
    });
}