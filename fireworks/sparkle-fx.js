import { mt_rand, randomFrom, degToRad, colorToStr } from "./functions.js";
import colors from "./config.js";

class SparkleParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    // start very close to origin
    this.vx = (Math.random() - 0.5) * 2.5;
    this.vy = (Math.random() - 0.5) * 8.5;

    this.size = 1;//Math.random() * 1.5 + 0.5;
    this.color = { h: 45 + Math.random() * 15, s: "0%", l: "100%", a: 0.2 };

    this.age = 0;
    this.lifetime = 40 + Math.random() * 20; // frames
  }

  update(dt) {
    this.age++;

    // jitter velocity a bit each frame
    //this.vx += (Math.random() - 0.5) * 0.3;
    //this.vy += (Math.random() - 0.5) * 0.3;

    // apply some drag so it doesn’t fly away
    this.vx *= 0.9;
    this.vy *= 0.9;

    this.x += this.vx;
    this.y += this.vy;

    // fade with flicker
    this.color.a = Math.max(
      0,
      (1 - this.age / this.lifetime) * (0.2 + Math.random() * 0.2)
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
  constructor(x, y, count = 80, radius = 30) {
    this.x = x;
    this.y = y;
    this.count = count;
    this.radius = radius;
    this.color = randomFrom(colors[4]);
    this.sparkles = [];
    for (let i = 0; i < this.count; i++) {
        this.sparkles.push(new SparkleParticle(x, y, this.color));
    }
  }

  updateAndDraw(dt, ctx) {
  this.sparkles = this.sparkles.filter(p => p.update(dt));
  this.sparkles.forEach(p => p.draw(ctx));

  // spawn new ones
  if (this.sparkles.length < this.count) {
    this.sparkles.push(new SparkleParticle(this.x, this.y)); // origin point
  }
  }
}