import Particle from "./particle.js";
import Effector from "./effector.js";
import DeltaReport from "./delta-report.js";
import { mt_rand, mt_rand_excluding_gap } from "./functions.js";

const canvas = document.getElementById("sandbox");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- setup particles & effectors ---
const particles = [];
for ( let i = 0; i < 1200; i++ ) {
    particles.push(new Particle(
        mt_rand(0, canvas.width), 
        mt_rand(0, canvas.height),
        {width:canvas.width, height:canvas.height}
    ));
}

const effectors = [];
for ( let i = 0; i < 18; i++ ) {
    effectors.push(new Effector(
        mt_rand(0, canvas.width), 
        mt_rand(0, canvas.height), 
        {width:canvas.width, height:canvas.height},
        mt_rand_excluding_gap(-10, -3, 3, 10)
    ));
}

const NEIGHBOR_RADIUS = 50;   // pixels
const SEPARATION_FORCE = 0.05;
const ALIGNMENT_FORCE  = 0.3;
const COHESION_FORCE   = 0.2;
function boids(currentParticle, particles) {
    let cx = 0, cy = 0;       // cohesion center
    let vx = 0, vy = 0;       // alignment
    let sepX = 0, sepY = 0;   // separation
    let count = 0;

    for (let p of particles) {
        if (p === currentParticle) continue;
        const dx = p.x - currentParticle.x;
        const dy = p.y - currentParticle.y;
        const dist2 = dx*dx + dy*dy;

        if (dist2 < NEIGHBOR_RADIUS*NEIGHBOR_RADIUS) {
            const dist = Math.sqrt(dist2);

            // Separation
            sepX -= dx / dist;
            sepY -= dy / dist;

            // Alignment
            vx += p.vx;
            vy += p.vy;

            // Cohesion
            cx += p.x;
            cy += p.y;

            count++;
        }
    }

    if (count > 0) {
        const inv = 1 / count;

        // Cohesion
        currentParticle.vX += ((cx * inv - currentParticle.x) * COHESION_FORCE);
        currentParticle.vY += ((cy * inv - currentParticle.y) * COHESION_FORCE);

        // Alignment
        currentParticle.vX += (vx * inv - currentParticle.vX) * ALIGNMENT_FORCE;
        currentParticle.vY += (vy * inv - currentParticle.vY) * ALIGNMENT_FORCE;

        // Separation
        currentParticle.vX += sepX * SEPARATION_FORCE;
        currentParticle.vY += sepY * SEPARATION_FORCE;
    }
}


// --- animation loop ---
function animate(timestamp) {
    // semi-transparent background to leave trails
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    for (let e of effectors) { 
        e.update(); 
        e.draw(ctx); 
    }
    for (let p of particles) {
        //boids(p, particles);
        p.update(effectors);
        p.draw(ctx);
    }
    DeltaReport.log(timestamp);
    requestAnimationFrame(animate);
}

animate();