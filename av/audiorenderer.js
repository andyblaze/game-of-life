class Particle {
  constructor(centerX, centerY) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.alive = false;
  }

  reset({
    bandIndex = 0,
    bandEnergy = 0,
    maxLifetime = 200,
  } = {}) {
    // Activate
    this.alive = true;

    // Start near center
    this.x = this.centerX + (Math.random() - 0.5) * 20;
    this.y = this.centerY + (Math.random() - 0.5) * 20;

    // Direction biased outward
    const angle = Math.random() * Math.PI * 2;
    const baseSpeed = 0.5 + bandEnergy * 15;
    const bandFactor = 3 + bandIndex * 0.93;

    this.vx = Math.cos(angle) * baseSpeed * bandFactor;
    this.vy = Math.sin(angle) * baseSpeed * bandFactor;

    // Visuals
    this.size = 2 + Math.random() * (3 - bandIndex * 0.3);
    this.alpha = 1;
    this.bandIndex = bandIndex;

    // Lifetime
    this.lifetime = 150 + Math.random() * maxLifetime;
    this.age = 0;
  }

  update(delta) {
    if (!this.alive) return;

    // Movement
    this.x += this.vx * delta * 60;
    this.y += this.vy * delta * 60;
    this.age += delta * 60;

    // Fade out over lifetime
    const lifeRatio = Math.min(this.age / this.lifetime, 1);
    this.alpha = 1 - lifeRatio;

    // Deactivate when done
    if (lifeRatio >= 1) this.alive = false;
  }

  isDead(width, height) {
    return (
      !this.alive ||
      this.x < -100 || this.x > width + 100 ||
      this.y < -100 || this.y > height + 100
    );
  }
}


class ParticleManager {
  constructor(centerX, centerY, poolSize = 1000) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.particles = Array.from({ length: poolSize }, () => new Particle(centerX, centerY));
    // Give some initial random particles so the screen isn't empty
    for (let i = 0; i < 100; i++) {
      const p = this.particles[i];
      p.reset({
        bandIndex: Math.floor(Math.random() * 5),
        bandEnergy: Math.random(),
        maxLifetime: 200 + Math.random() * 100
      });
    }
  }

  update(delta, bands, volume, ctx) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const baseEmission = Math.floor(volume * 5) + 1;

    for (let p of this.particles) {
      p.update(delta);

      if (p.isDead(width, height)) {
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
        this.particleManager = new ParticleManager(window.innerWidth/2, window.innerHeight/2, 100);
    }
    
    draw(delta, ctx, data) {
      const { frequencies, volume } = data;
      const { width, height } = ctx.canvas;
      
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.fillRect(0,0,width,height); // fade trails

      this.particleManager.update(delta, frequencies, volume, ctx);
      this.particleManager.draw(ctx);
    }



}