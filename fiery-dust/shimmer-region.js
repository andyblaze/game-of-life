import CONFIG from "./config.js";

class ShimmerRegion {
  constructor(id, x, y, config) {
    this.x = x;
    this.y = y;
    this.width = config.width;
    this.height = config.height;
    this.color = config.colors[id];
    this.shadowColor = config.shadowColor;
    this.shadowBlur = config.shadowBlur;
    this.flameWidth = config.flameWidth;      
    this.amplitude = config.amplitude;        
    this.frequency = config.frequency;       
    this.speed = config.speed;             
    this.time = 0;
  }

  update(dt) {
    this.time += dt;
  }

  draw(ctx) {
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

export default class ShimmerManager {
    constructor(config) {
        this.regions = [];
        for ( const [id, r] of config.regions.entries())
            this.regions.push(new ShimmerRegion(id, r.x, r.y, config));
    }
    update(dt, ctx) {
        for ( const r of this.regions) {
            r.update(dt);
            r.draw(ctx);
        }
    }
}