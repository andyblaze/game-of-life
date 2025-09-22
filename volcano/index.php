<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Volcano Smoke with Drift</title>
<style>
  body { margin: 0; background: #111; overflow: hidden; }
  canvas { display: block; }
</style>
</head>
<body>
<canvas id="canvas"></canvas>
<script>
// --- Canvas setup ---
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

// --- Simple Perlin noise ---
class Perlin {
    constructor() {
        this.gradients = {};
        this.memory = {};
    }

    rand_vect() {
        let theta = Math.random() * 2 * Math.PI;
        return {x: Math.cos(theta), y: Math.sin(theta)};
    }

    dot_prod_grid(x, y, vx, vy) {
        let g_vect;
        let d_vect = {x: vx - x, y: vy - y};
        let key = x + "," + y;
        if (this.gradients[key]) g_vect = this.gradients[key];
        else {
            g_vect = this.rand_vect();
            this.gradients[key] = g_vect;
        }
        return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
    }

    smootherstep(x) {
        return 6*x**5 - 15*x**4 + 10*x**3;
    }

    interp(x, a, b) {
        return a + this.smootherstep(x) * (b - a);
    }

    get(x, y) {
        if (this.memory[[x,y]]) return this.memory[[x,y]];
        let x0 = Math.floor(x);
        let x1 = x0 + 1;
        let y0 = Math.floor(y);
        let y1 = y0 + 1;

        let sx = x - x0;
        let sy = y - y0;

        let n0, n1, ix0, ix1, value;

        n0 = this.dot_prod_grid(x0, y0, x, y);
        n1 = this.dot_prod_grid(x1, y0, x, y);
        ix0 = this.interp(sx, n0, n1);

        n0 = this.dot_prod_grid(x0, y1, x, y);
        n1 = this.dot_prod_grid(x1, y1, x, y);
        ix1 = this.interp(sx, n0, n1);

        value = this.interp(sy, ix0, ix1);
        this.memory[[x,y]] = value;
        return value;
    }
}

const perlin = new Perlin();

// --- Smoke particle ---
class Smoke {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.alpha = Math.random() * 0.1 + 0.1;
        this.size = Math.random() * 20 + 10;
        this.vx = 0; // base horizontal velocity
        this.vy = Math.random() * -1 - 0.5;
        this.life = Math.random() * 100 + 100;
        this.age = 0;
        this.noiseOffset = Math.random() * 1000;
    }

    update() {
        // drift with Perlin noise
        this.vx = perlin.get(this.noiseOffset, this.age * 0.01) * -0.2; // negative = drift left
        this.x += this.vx;
        this.y += this.vy;
        this.alpha *= 0.995;
        this.age++;
    }

    draw(ctx) {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgba(200,200,200,${this.alpha})`);
        gradient.addColorStop(1, 'rgba(200,200,200,0)');
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fill();
    }

    isDead() {
        return this.alpha < 0.01 || this.age > this.life;
    }
}

let particles = [];

function spawnSmoke() {
    const baseX = width / 2;
    const baseY = height * 0.75;
    const count = Math.floor(Math.random() * 2) + 1;
    for (let i=0; i<count; i++) {
        particles.push(new Smoke(baseX + (Math.random()-0.5)*50, baseY));
    }
}

function animate() {
    ctx.fillStyle = 'rgba(17,17,17,0.2)';
    ctx.fillRect(0,0,width,height);

    spawnSmoke();

    for (let i=particles.length-1; i>=0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.isDead()) particles.splice(i,1);
    }

    requestAnimationFrame(animate);
}

animate();
</script>
</body>
</html>
