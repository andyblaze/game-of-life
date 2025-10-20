class Particle {
  constructor(centerX, centerY, options = {}) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.reset(options);
  }

  reset({
    bandIndex = 0,
    bandEnergy = 0,
    maxLifetime = 200,
    spread = 0.5
  } = {}) {
    // Start near the center
    this.x = this.centerX + (Math.random() - 0.5) * 20;
    this.y = this.centerY + (Math.random() - 0.5) * 20;

    // Direction — random but biased outward
    const angle = Math.random() * Math.PI * 2;
    const speedBase = 0.5 + bandEnergy * 15;
    const bandFactor = 1 + bandIndex * 0.53; // higher bands faster

    this.vx = Math.cos(angle) * speedBase * bandFactor;
    this.vy = Math.sin(angle) * speedBase * bandFactor;

    this.size = 2 + Math.random() * (3 - bandIndex * 0.3);
    this.alpha = 0.5 + Math.random() * 0.5;
    this.lifetime = Math.random() * maxLifetime + 50;
    this.age = 0;
    this.bandIndex = bandIndex;
  }

  update(delta) {
    this.x += this.vx * delta * 60; // 60fps normalized
    this.y += this.vy * delta * 60;
    this.age += delta * 60;
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
  constructor(centerX, centerY, count = 1000) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.particles = Array.from({ length: count }, () => new Particle(centerX, centerY));
  }

  update(delta, bands, volume, ctx) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // Global emission intensity from volume
    const baseEmission = Math.floor(volume * 5) + 1;

    for (let p of this.particles) {
      p.update(delta);

      if (p.isDead(width, height)) {
        // pick a random band to respawn with
        const bandIndex = Math.floor(Math.random() * bands.length);
        p.reset({
          bandIndex,
          bandEnergy: bands[bandIndex],
          maxLifetime: 300,
        });
      }
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
        this.particles = new ParticleManager(window.innerWidth/2, window.innerHeight/2, 300);
    }
    
    draw(delta, ctx, data) {
      const { frequencies, volume } = data;
      const { width, height } = ctx.canvas;
      
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.fillRect(0,0,width,height); // fade trails

      this.particles.update(delta, frequencies, volume, ctx);
      this.particles.draw(ctx);
    }



}