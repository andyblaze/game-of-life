class Particle {
  constructor(centerX, centerY) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.reset();
  }

  reset({
    bandIndex = 0,
    bandEnergy = 0,
    maxLifetime = 200,
    spread = 20
  } = {}) {
    // Start near the center
    this.x = this.centerX + (Math.random() - 0.5) * spread;
    this.y = this.centerY + (Math.random() - 0.5) * spread;

    // Direction — random but biased outward
    const angle = Math.random() * Math.PI * 2;
    const energy = Math.pow(bandEnergy, 0.7); // smooth velocity curve
    const speedBase = 1 + energy * 10;         // capped speed

    const bandFactor = 1 + bandIndex * 0.5;   // higher bands faster
    this.vx = Math.cos(angle) * speedBase * bandFactor;
    this.vy = Math.sin(angle) * speedBase * bandFactor;

    this.size = 2 + Math.random() * (3 - bandIndex * 0.3);
    this.alpha = 0.5 + Math.random() * 0.5;
    this.lifetime = Math.random() * maxLifetime + 50;
    this.age = 0;
    this.bandIndex = bandIndex;
  }

  update(delta) {
    // Move particle
    this.x += this.vx * delta * 60; 
    this.y += this.vy * delta * 60;

    // Apply damping to velocity for smoother motion
    this.vx *= 0.99;
    this.vy *= 0.99;

    // Age & fade
    this.age += delta * 60;
    const lifeRatio = Math.min(this.age / this.lifetime, 1);
    this.alpha = 1 - lifeRatio;
  }

  isDead(width, height) {
    return (
      this.age > this.lifetime ||
      this.x < -100 || this.x > width + 100 ||
      this.y < -100 || this.y > height + 100
    );
  }
}

class ParticleManager {
  constructor(centerX, centerY, maxCount = 800) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.maxCount = maxCount;
    this.particles = [];
    this.spawnCooldown = 0;
  }

  update(delta, bands, volume, ctx) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // Determine "pulse" from volume for emission
    const pulse = Math.min(volume, 1);

    this.spawnCooldown -= delta; 
    if (this.spawnCooldown <= 0 && pulse > 0.001) {
      this.spawnParticles(bands, volume);
      this.spawnCooldown = 0.05; // ~20 spawns/sec max
    }

    // Update existing particles
    for (let p of this.particles) {
      p.update(delta);

      // Recycle dead particles
      if (p.isDead(width, height)) {
        const bandIndex = Math.floor(Math.random() * bands.length);
        p.reset({
          bandIndex,
          bandEnergy: bands[bandIndex],
          maxLifetime: 300
        });
      }
    }
  }

  spawnParticles(bands, volume) {
    const totalToSpawn = Math.floor(volume * 5) + 1;

    for (let i = 0; i < totalToSpawn; i++) {
      if (this.particles.length >= this.maxCount) break;

      // Pick a band based on weighted probability: lower bands fewer, higher bands more
      const bandIndex = Math.floor(Math.random() * bands.length);
      const bandEnergy = bands[bandIndex];

      const p = new Particle(this.centerX, this.centerY);
      p.reset({ bandIndex, bandEnergy, maxLifetime: 300 });
      this.particles.push(p);
    }
  }

  draw(ctx) {
    for (let p of this.particles) {
      const hue = 200 + p.bandIndex * 30;
      ctx.fillStyle = `hsla(${hue}, 90%, 60%, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}




export default class AudioRenderer {
    constructor() {
        this.particleManager = new ParticleManager(window.innerWidth/2, window.innerHeight/2, 100);
    }
    
    draw(delta, ctx, data) {
      const { frequencies, volume } = data;
      const { width, height } = ctx.canvas;
      
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0,0,width,height); // fade trails

      this.particleManager.update(delta, frequencies, volume, ctx);
      this.particleManager.draw(ctx);
    }



}