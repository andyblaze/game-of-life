<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Dusty Words - Random Placement</title>
<style>
  body {
    margin: 0;
    overflow: hidden;
    background: #000; /* parchment-like */
  }
  canvas { display: block; }
</style>
</head>
<body>
<canvas id="onscreen"></canvas>
<script type="text/javascript">
const canvas = document.getElementById("onscreen");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
/* === CONFIGURATION === */
const CONFIG = {
    SPAWN_X: canvas.width / 2,   // center of fountain
    SPAWN_WIDTH: 400,             // how wide the base is
    SPAWN_HEIGHT: 100, // how tall the vertical band is at the bottom
    CONE_ANGLE: 90, // spread around vertical
    INIT_SPEED: 1.5,
    NUM_PARTICLES: 1500,
    WORD_PARTICLE_COUNT: 500,
    FORM_STEPS: 480,
    HOLD_STEPS: 240,
    DISPERSAL_STEPS: 300,
    FREE_TIME: 600,
    WORDS: ["MAGIC", "LIVING", "DUST", "FIRE", "ASH", "SMOKE", "EMBERS", "FLAMES", "SPARKS", "HEAT", "BURN", "FUEL"],
    FONT: "bold 120px serif",
    FORMATION_SPEED: 0.008,
    NOISE_SPEED: 0.3,
    DUST_DIRECTION: 270,
    SPEED_FACTOR: {
        MIN: 0.7,
        MAX: 2.7
    },
    NOISE_SCALE: 0.002,
    WORD_AREA: {           // configurable placement zone
        MIN_X: 150,
        MAX_X: window.innerWidth - 150,
        MIN_Y: 150,
        MAX_Y: window.innerHeight - 150
    },
    PARTICLE_COLORS: [
        "hsla(16, 100%, 54%, 1)",   // #ff4500 orange-red (flame core)
        "hsla(9, 100%, 64%, 1)",    // #ff6347 tomato orange
        "hsla(39, 100%, 50%, 1)",   // #ffa500 classic orange
        "hsla(51, 100%, 50%, 1)",   // #ffd700 golden yellow
        "hsla(60, 100%, 80%, 1)",   // #ffff99 pale yellow spark
        "hsla(0, 100%, 50%, 1)",    // #ff0000 deep red ember
        "hsla(0, 100%, 25%, 1)",    // #800000 smoldering dark red
        "hsla(0, 0%, 27%, 1)"       // #444444 occasional ash/ember fade
    ],
    PARTICLE_SHAPES: ["circle", "rect", "triangle", "line"],
    EMBER: {
        POOL_SIZE: 30,
        SPAWN_X: canvas.width / 2,        // center of fire
        SPAWN_Y: canvas.height - 50,      // approximate fire top
        SPAWN_WIDTH: 60,                   // horizontal variation
        SPAWN_HEIGHT: 20,                  // vertical variation
        SPAWN_CHANCE: 0.02,
        MIN_SPEED: 2,                      // initial velocity min
        MAX_SPEED: 5,                      // initial velocity max
        MIN_ANGLE: -30,                    // degrees from vertical
        MAX_ANGLE: 30,                     // degrees from vertical
        LIFETIME: 4000,                    // milliseconds
            COLORS: [
            {h:16, s:"100%", l:"54%", a:1},          // bright yellow
            {h:30, s:"100%", l:"50%", a:1},          // orange
            {h:0, s:"100%", l:"40%", a:1}            // red ember
        ],
        TRAIL_LENGTH: 8,                   // number of previous positions to keep for trail
        GRAVITY: 0.02,                     // optional downward pull
        WIND: 0.02                          // optional horizontal drift
    },
    SHIMMER: {
        x: 970,
        y: 460,
        width: 50,
        height: 120,
        color: "rgba(255,200,0,0.15)",//#FF FD BF
        shadowColor: "rgba(255,80,0,0.2)",
        shadowBlur: 20,
        flameWidth: 15,
        amplitude: 10,
        frequency: 0.25,
        speed: 0.0014
    },
    GROUND_FLICKER = {
        enabled: true,          // turn effect on/off
        marginX: 100,           // left/right margin in pixels
        height: 100,            // height of flicker region from bottom
        numCells: 15,           // number of Voronoi-like cells
        baseLightness: 30,      // base darkness of the cells (0–100)
        flickerAmplitude: 5,    // how much lightness oscillates (+/-)
        flickerSpeed: 0.002,    // speed of flicker
        jitter: 2,              // maximum pixel jitter for cell centers
        blendMode: "overlay"     // ctx.globalCompositeOperation
    }
};
/* ====================== */

class Ember {
    constructor(config) {
        this.config = config;

        // Spawn position (rectangle)
        this.x = config.SPAWN_X + (Math.random() - 0.5) * config.SPAWN_WIDTH;
        this.y = config.SPAWN_Y - Math.random() * config.SPAWN_HEIGHT;

        // Random velocity in a cone
        const angleDeg = config.MIN_ANGLE + Math.random() * (config.MAX_ANGLE - config.MIN_ANGLE);
        const rad = angleDeg * Math.PI / 180;
        const speed = config.MIN_SPEED + Math.random() * (config.MAX_SPEED - config.MIN_SPEED);
        this.vx = Math.sin(rad) * speed;
        this.vy = -Math.cos(rad) * speed; // negative because canvas y=0 is top

        // Color pick
        const colorIndex = Math.floor(Math.random() * config.COLORS.length);
        this.color = {...config.COLORS[colorIndex]};

        // Trail
        this.trail = [];
        this.trailLength = config.TRAIL_LENGTH;

        // Lifetime
        this.life = 0;
        this.alive = true;
        this.maxLife = config.LIFETIME; // ms
    }
    update(dt) {
        // dt = time delta in ms
        this.life += dt;
        this.color.a = Math.max(0, 1 - this.life / this.maxLife);
        if (this.life >= this.maxLife && this.color.a <= 0) {
            // instead of immediate respawn, only respawn based on chance
            //if (Math.random() < this.config.SPAWN_CHANCE) {
            this.alive = false;
            this.respawn();
            //}
            //return; // don't move if not respawned yet
        }

        // Add previous position to trail
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > this.trailLength) this.trail.shift();

        // Apply motion
        this.vy += this.config.GRAVITY;
        this.vx += (Math.random() - 0.5) * (this.config.WIND);
        this.x += this.vx;
        this.y += this.vy;
    }
    respawn() {
        // reset position, velocity, life, trail
        this.x = this.config.SPAWN_X + (Math.random() - 0.5) * this.config.SPAWN_WIDTH;
        this.y = this.config.SPAWN_Y - Math.random() * this.config.SPAWN_HEIGHT;

        const angleDeg = this.config.MIN_ANGLE + Math.random() * (this.config.MAX_ANGLE - this.config.MIN_ANGLE);
        const rad = angleDeg * Math.PI / 180;
        const speed = this.config.MIN_SPEED + Math.random() * (this.config.MAX_SPEED - this.config.MIN_SPEED);
        this.vx = Math.sin(rad) * speed;
        this.vy = -Math.cos(rad) * speed;

        this.trail = [];
        this.life = 0;
        this.alive = true;
    }
    draw(ctx) {
        // Draw trail
        for (let i = 0; i < this.trail.length; i++) {
            const p = this.trail[i];
            //const alpha = (i + 1) / this.trail.length * this.color.a;
            
            ctx.fillStyle = `hsla(${this.color.h}, ${this.color.s}, ${this.color.l}, ${this.color.a})`;
            ctx.fillRect(p.x, p.y, 2, 2);
        }
        // Draw current position
        //ctx.fillStyle = `hsla(${this.color.h}, ${this.color.s}, ${this.color.l}, ${this.color.a})`;
        //ctx.fillRect(this.x, this.y, 2, 2);
    }
}
class EmberManager {
    constructor(config) {
        this.embers = [];
        this.active = [];
        this.animating = false;
        for ( let i = 0; i < config.POOL_SIZE; i++ ) {
            this.embers.push(new Ember(config));
        }
    }
    spawn() {
        //
        if ( Math.random() < 0.1 ) {
            this.active.push(this.embers[Math.floor(Math.random() * this.embers.length)]);
            //return e;
            //e.update(dt);
            //e.draw(ctx);
        }
    }
    update(dt) {
        if ( this.active.length === 0 ) {
            this.spawn();
        }
        else {
            for ( const e of this.active ) {
                if ( e.alive === false ) {
                    this.active = [];
                    return;
                }
                e.update(dt);
                e.draw(ctx);
            }
        }
    }
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.tx = null;
        this.ty = null;
        this.inWord = false;
        this.color = CONFIG.PARTICLE_COLORS[Math.floor(Math.random() * CONFIG.PARTICLE_COLORS.length)];
        this.shape = CONFIG.PARTICLE_SHAPES[Math.floor(Math.random() * CONFIG.PARTICLE_SHAPES.length)];
        this.size = 1 + Math.random() * 2;
    }
    update() {
        if (this.inWord && this.tx !== null && this.ty !== null) {
            this.x += (this.tx - this.x) * CONFIG.FORMATION_SPEED;
            this.y += (this.ty - this.y) * CONFIG.FORMATION_SPEED;
        } else {
            // Brownian motion + perlin drift
            let rad = CONFIG.DUST_DIRECTION * Math.PI / 180;
            let dx = Math.cos(rad) * CONFIG.NOISE_SPEED;
            let dy = Math.sin(rad) * CONFIG.NOISE_SPEED;
            let n = perlin(this.x * CONFIG.NOISE_SCALE, this.y * CONFIG.NOISE_SCALE);
            dx += (n - 0.5) * CONFIG.NOISE_SPEED;
            dy += (n - 0.5) * CONFIG.NOISE_SPEED;

            // existing Brownian
            let bx = this.vx;
            let by = this.vy;

            // CORRECT mapping: normalizedBottom = 0 at top, 1 at bottom
            let normalizedBottom = Math.max(0, Math.min(1, this.y / canvas.height));

            // linear interpolate: bottom -> SPEED_FACTOR_MAX, top -> SPEED_FACTOR_MIN
            const sf = CONFIG.SPEED_FACTOR.MIN + (CONFIG.SPEED_FACTOR.MAX - CONFIG.SPEED_FACTOR.MIN) * normalizedBottom;

            // apply combined motion scaled by sf
            this.x += (bx + dx);// * sf;
            this.y += (by + dy) * sf;

            // Horizontal wrap stays the same
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;

            // Vertical wrap is customized for fire motes
            if (this.y < 0) {
                // respawn at the fire base area
                this.x = CONFIG.SPAWN_X + (Math.random() - 0.5) * CONFIG.SPAWN_WIDTH;
                this.y = 800 - Math.random() * CONFIG.SPAWN_HEIGHT;
            }
        }
    }
    drawCircle(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, 2*Math.PI);
        ctx.fill();
    }
    drawTriangle(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size/2);
        ctx.lineTo(this.x - this.size/2, this.y + this.size/2);
        ctx.lineTo(this.x + this.size/2, this.y + this.size/2);
        ctx.closePath();
        ctx.fill();
    }
    draw() {
        ctx.fillStyle = this.color;
        switch(this.shape) {
          case 'circle':
            this.drawCircle(ctx);
            break;

          case 'rect':
            ctx.fillRect(this.x, this.y, this.size, this.size);
            break;

          case 'triangle':
            this.drawTriangle(ctx);
            break;

          case 'line':
            ctx.fillRect(this.x, this.y, 1, this.size); // very short vertical line
            break;
        }
    }
}

class ParticleManager {
    constructor() {
        this.particles = [];
        for (let i = 0; i < CONFIG.NUM_PARTICLES; i++) {
            // spawn position
            const x = CONFIG.SPAWN_X + (Math.random() - 0.5) * CONFIG.SPAWN_WIDTH;
            const y = (800) - Math.random() * CONFIG.SPAWN_HEIGHT;

            // initial velocity
            const angleDeg = (Math.random() - 0.5) * CONFIG.CONE_ANGLE; // spread around vertical
            const speed = CONFIG.INIT_SPEED || 1.5; // adjust as needed
            const rad = angleDeg * Math.PI / 180;

            const vx = Math.sin(rad) * speed; // horizontal
            const vy = -Math.cos(rad) * speed; // vertical upward

            this.particles.push(new Particle(x, y, vx, vy));
        }
    }
    update() {
        for (const p of this.particles) {
            p.update();
            p.draw();
        }        
    }
    releaseParticles() {
        for (const p of this.particles) {
            p.inWord = false;
            p.tx = null;
            p.ty = null;
        }
    }
}

// Simple pseudo-perlin
function perlin(x, y){
    return (Math.sin(x*12.9898 + y*78.233) * 43758.5453 % 1 + 1) % 1;
}

class WordManager {
    constructor() {
        this.wordPhase = 0;
        this.wordTimer = 0;
        this.wordTargets = [];
        this.currentWord = 0;
    }
    update(particleManager) {
        // Word lifecycle
        this.wordTimer++;
        if (this.wordPhase === 0 && this.wordTimer > CONFIG.FREE_TIME) {
            this.assignWordTargets(CONFIG.WORDS[this.currentWord], particleManager);
            this.wordPhase = 1; this.wordTimer = 0;
        } else if (this.wordPhase === 1 && this.wordTimer > CONFIG.FORM_STEPS) {
            this.wordPhase = 2; this.wordTimer = 0;
        } else if (this.wordPhase === 2 && this.wordTimer > CONFIG.HOLD_STEPS) {
            particleManager.releaseParticles();
            this.wordPhase = 3; this.wordTimer = 0;
        } else if (this.wordPhase === 3 && this.wordTimer > CONFIG.DISPERSAL_STEPS) {
            this.currentWord = (this.currentWord + 1) % CONFIG.WORDS.length;
            this.wordPhase = 0; this.wordTimer = 0;
        }    
    }
    createWordTargets(text) {
        const off = document.createElement("canvas");
        const octx = off.getContext("2d");
        off.width = canvas.width;
        off.height = canvas.height;
        octx.fillStyle = "black";
        octx.textAlign = "center";
        octx.textBaseline = "middle";
        octx.font = CONFIG.FONT;
        octx.fillText(text, off.width/2, off.height/2);

        const data = octx.getImageData(0, 0, off.width, off.height);
        const pts = [];
        for (let y = 0; y < off.height; y += 4) {
            for (let x = 0; x < off.width; x += 4) {
                const idx = (y * off.width + x) * 4;
                if (data.data[idx+3] > 128) pts.push({x,y});
            }
        }
        return pts;
    }
    assignWordTargets(text, particleManager) {
        const targets = this.createWordTargets(text);
        const sampleSize = Math.min(CONFIG.WORD_PARTICLE_COUNT, targets.length);

        // Random center position within WORD_AREA
        const centerX = CONFIG.WORD_AREA.MIN_X + Math.random() * (CONFIG.WORD_AREA.MAX_X - CONFIG.WORD_AREA.MIN_X);
        const centerY = CONFIG.WORD_AREA.MIN_Y + Math.random() * (CONFIG.WORD_AREA.MAX_Y - CONFIG.WORD_AREA.MIN_Y);

        const wordTargets = [];
        for (let i = 0; i < sampleSize; i++) {
            const t = targets[Math.floor(Math.random() * targets.length)];
            wordTargets.push({
                x: t.x - canvas.width/2 + centerX,
                y: t.y - canvas.height/2 + centerY
            });
        }

        // assign particles
        const chosen = [];
        while (chosen.length < sampleSize) {
            const p = particleManager.particles[Math.floor(Math.random() * particleManager.particles.length)];
            if ( ! p.inWord ) {
                p.inWord = true;
                p.tx = wordTargets[chosen.length].x;
                p.ty = wordTargets[chosen.length].y;
                chosen.push(p);
            }
        }    
    }
}

class ShimmerRegion {
  constructor(config) {
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
    this.color = config.color || "rgba(255,200,100,0.3)";
    this.shadowColor = config.shadowColor || "rgba(255,180,50,0.6)";
    this.shadowBlur = config.shadowBlur || 20;
    this.flameWidth = config.flameWidth || 30;      // thickness of flame band
    this.amplitude = config.amplitude || 20;        // horizontal wiggle
    this.frequency = config.frequency || 0.3;       // vertical wiggle freq
    this.speed = config.speed || 0.005;             // animation speed
    this.time = 0;
  }

  update(dt) {
    this.time += dt;
  }

  draw() {
    const flameSteps = 40;
    const phase = this.time * this.speed;

    ctx.save();
    ctx.beginPath();
    for (let i = 0; i <= flameSteps; i++) {
      const y = this.y + (i / flameSteps) * this.height;
      const x =
        this.x +
        this.width / 2 +
        Math.sin(i * this.frequency + phase) * this.amplitude;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineWidth = this.flameWidth;
    ctx.strokeStyle = this.color;
    ctx.shadowColor = this.shadowColor;
    ctx.shadowBlur = this.shadowBlur;
    ctx.stroke();
    ctx.restore();
  }
}


const wordManager = new WordManager();
const particleManager = new ParticleManager();
const emberManager = new EmberManager(CONFIG.EMBER);
const shimmer = new ShimmerRegion(CONFIG.SHIMMER);

let lastTime = performance.now();
let frames = 0;
const bg = new Image();
bg.src = "bg.jpg";
function animate(timestamp) { 
    if ( isNaN(timestamp) ) 
        timestamp = 0;
    const dt = timestamp - lastTime; // milliseconds since last frame
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    shimmer.update(dt);
    shimmer.draw();
    particleManager.update();

    
    lastTime = timestamp;
    emberManager.update(dt);
    wordManager.update(particleManager);
    // FPS
    frames++;
    if (timestamp - lastTime >= 1000) {
        console.log("FPS:", frames);
        frames = 0;
        lastTime = timestamp;
    }
    requestAnimationFrame(animate);
}
animate();
</script>
</body>
</html>