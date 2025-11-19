import Particle from "./particle.js";
import Effector from "./effector.js?h";
import DeltaReport from "./delta-report.js";
import { mt_rand, mt_rand_excluding_gap } from "./functions.js";
import SnapAbility from "./snap-ability.js";
import ZoomAbility from "./zoom-ability.js";
import BreatherAbility from "./breather-ability.js";

const canvas = document.getElementById("sandbox");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- setup particles & effectors ---
const particles = [];
for ( let i = 0; i < 1500; i++ ) {
    particles.push(new Particle(
        mt_rand(0, canvas.width), 
        mt_rand(0, canvas.height),
        {width:canvas.width, height:canvas.height}
    ));
}

const effectors = [];
class Scheduler {
    constructor() {
        this.delays = [
            0, 12000, 24000, 36000
        ];
    }    
}
for ( let i = 0; i < 3; i++ ) {
    let e = new Effector(
            mt_rand(0, canvas.width), 
            mt_rand(0, canvas.height), 
            {width:canvas.width, height:canvas.height},
            mt_rand_excluding_gap(-0.9, 0, 0, 0.9)
        );
    e.addAbility(new BreatherAbility(e));
    effectors.push(e);
}
for ( let i = 0; i < 8; i++ ) {
    effectors.push(new Effector(
        mt_rand(0, canvas.width), 
        mt_rand(0, canvas.height), 
        {width:canvas.width, height:canvas.height},
        mt_rand_excluding_gap(-10, -3, 3, 10)
    ));
}
for ( let i = 0; i < 8; i++ ) {
    let e = new Effector(
        mt_rand(0, canvas.width), 
        mt_rand(0, canvas.height), 
        {width:canvas.width, height:canvas.height},
        mt_rand_excluding_gap(-10, -3, 3, 10)
    );
    e.addAbility(new SnapAbility(e));
    effectors.push(e);
}
for ( let i = 0; i < 8; i++ ) {
    let e = new Effector(
        mt_rand(0, canvas.width), 
        mt_rand(0, canvas.height), 
        {width:canvas.width, height:canvas.height},
        mt_rand_excluding_gap(-10, -3, 3, 10)
    );
    e.addAbility(new ZoomAbility(e));
    effectors.push(e);
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