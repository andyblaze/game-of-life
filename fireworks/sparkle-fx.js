import { mt_rand, randomFrom, degToRad, colorToStr } from "./functions.js";
import colors from "./config.js";

class SparkleParticle {
  constructor(x, y) {
    this.x = x + (Math.random() - 0.5) * 20; // small cluster offset
    this.y = y + (Math.random() - 0.5) * 10;

    this.vx = (Math.random() - 0.5) * 0.5;  // tiny horizontal drift
    this.vy = -Math.random() * 0.5;         // slight upward motion

    this.size = Math.random() * 1.5 + 0.5;  // 0.5 → 2 px
    this.color = { h: 40 + Math.random() * 20, s: "100%", l: "70%", a: 1 };

    this.age = 0;
    this.lifetime = 20 + Math.random() * 20; // frames
    this.alpha = 1;
  }

  update(dt) {
    this.age += 1; // treat update as frame step (simpler than ms for now)
    this.x += this.vx;
    this.y += this.vy;

    // Fade alpha with a little flicker
    this.alpha = Math.max(
      0,
      (1 - this.age / this.lifetime) * (0.7 + Math.random() * 0.3)
    );

    return this.age < this.lifetime;
  }

  draw(ctx) {
    ctx.fillStyle = colorToStr(this.color);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default class SparkleFX {
  constructor(x, y, count = 12, radius = 30) {
    this.x = x;
    this.y = y;
    this.count = count;
    this.radius = radius;
    this.color = randomFrom(colors[4]);//{h:0, s:"0%", l:"100%", a:1};
    this.sparkles = [];
    for (let i = 0; i < this.count; i++) {
        this.sparkles.push(new SparkleParticle(x, y));
    }
  }

  updateAndDraw(dt, ctx) {
  this.sparkles = this.sparkles.filter(p => p.update(dt));
  this.sparkles.forEach(p => p.draw(ctx));

  // spawn new ones
  if (this.sparkles.length < 30) {
    this.sparkles.push(new SparkleParticle(this.x, this.y)); // origin point
  }
  }
}