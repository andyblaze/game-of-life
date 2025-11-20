import Particle from "./particle.js";
import DeltaReport from "./delta-report.js";
import { mt_rand, canvasSize, randomPosIn } from "./functions.js";
import Scheduler from "./scheduler.js";
import FinaleStar from "./finale-star.js";

const canvas = document.getElementById("sandbox");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.width  = window.innerWidth  + "px";
canvas.style.height = window.innerHeight + "px";

// --- setup particles & effectors ---
const particles = [];
const effectors = [];

for ( let i = 0; i < 1500; i++ ) {
    const {x, y} = {...randomPosIn(canvas)};
    particles.push(new Particle(
        x, y,
        canvasSize(canvas)
    ));
}

const scheduler = new Scheduler(canvas, effectors);
effectors.push(new FinaleStar(canvas.width / 2, canvas.height / 2));

let startTime = null;
// --- animation loop ---
function animate(timestamp) {
    if ( startTime === null ) {
        startTime = timestamp;
    }
    const elapsed = timestamp - startTime; // ← milliseconds since animation began
    scheduler.launch(elapsed);

    // semi-transparent background to leave trails
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    for (let e of effectors) { 
        e.update(timestamp); 
        e.draw(ctx); 
    }
    for (let p of particles) {
        p.update(effectors);
        p.draw(ctx);
    }

    DeltaReport.log(timestamp);
    requestAnimationFrame(animate);
}

animate(performance.now());