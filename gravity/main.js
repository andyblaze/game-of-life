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
function addBreathers() {
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
    scheduler.breathersAdded = true;
}
function addEffectors() {
    for ( let i = 0; i < 8; i++ ) {
        effectors.push(new Effector(
            mt_rand(0, canvas.width), 
            mt_rand(0, canvas.height), 
            {width:canvas.width, height:canvas.height},
            mt_rand_excluding_gap(-10, -3, 3, 10)
        ));
    }
    scheduler.effectorsAdded = true;
}
function addSnappers() {
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
    scheduler.snappersAdded = true;
}
function addZoomers() {
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
    scheduler.zoomersAdded = true;
}

class Scheduler {
    constructor() {
        this.idx = 0;
        this.waves = [
            {delay: 4000, func:addBreathers, done:false},
            {delay:16000, func:addEffectors, done:false}, 
            {delay:24000, func:addZoomers, done:false},
            {delay:36000, func:addSnappers, done:false}
        ];
    } 
    launch(elapsedTime) {
        if ( this.idx > this.waves.length -1 ) return;
        if ( this.waves[this.idx].done === false && elapsedTime > this.waves[this.idx].delay ) {
            this.waves[this.idx].func();
            this.waves[this.idx].done = true;
            this.idx++;
        }        
    }
}
const scheduler = new Scheduler();

class FinaleStar {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        // Configurable timings
        this.idleDuration  = 36000;  // ms before starting next grow
        this.growDuration  = 12000; // ms pulling (unchanged)
        this.repelDuration = 3800;  // ms burst (unchanged)

        // Strengths
        this.pullStrength  = 65;     // gentle pull
        this.repelStrength = -70;   // strong burst

        // State
        this.phase = "idle";         // idle → grow → repel → idle
        this.phaseStart = 0;

        this.strength = 0;           // applied by particles
    }
    update(now) {
        const t = now - this.phaseStart;

        // --- IDLE ---
        if (this.phase === "idle") {
            this.strength = 0;

            // Wait until idleDuration is over
            if (t >= this.idleDuration) {
                this.phase = "grow";
                this.phaseStart = now;
            }
            return;
        }

        // --- GROW ---
        if (this.phase === "grow") {
            const k = t / this.growDuration;

            if (k < 1) {
                this.strength = this.pullStrength * k; // linear ease-in
            } else {
                // transition to repulsion
                this.phase = "repel";
                this.phaseStart = now;
                this.strength = this.repelStrength;
            }
            return;
        }

        // --- REPEL ---
        if (this.phase === "repel") {
            if (t >= this.repelDuration) {
                // back to idle
                this.phase = "idle";
                this.phaseStart = now;
                this.strength = 0;
            }
            return;
        }
    }
    draw(ctx) {}
}

const star = new FinaleStar(canvas.width / 2, canvas.height / 2);
effectors.push(star);

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
    
    /*finale[0].update(timestamp);
    for (let p of particles) {
        p.update(finale);
        p.draw(ctx);
    }*/
    DeltaReport.log(timestamp);
    requestAnimationFrame(animate);
}

animate(performance.now());