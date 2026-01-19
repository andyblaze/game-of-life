import Asteroid from "./cls-asteroid.js";
import { mt_rand } from "./functions.js";
import DeltaReport from "./delta-report.js";

export default class Game {
  constructor(s) {
    this.screen = s;
    this.screenW = this.screen.canvasW;
    this.screenH = this.screen.canvasH;

    this.asteroids = [];
    this.spawnAsteroids(12);

    this.last = performance.now();
    this.loop(performance.now());
  }

  spawnAsteroids(n) {
    for (let i = 0; i < n; i++) {
      const x = mt_rand(60, this.screenW - 60);
      const y = mt_rand(60, this.screenH - 60);
      const radius = mt_rand(40, 60);
      this.asteroids.push(new Asteroid(x, y, radius));
    }
  }

  // 🔹 NEW: collision orchestration lives here
  handleAsteroidCollisions() {
    const list = this.asteroids;

    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];

        if (a.collidesWith(b)) {
          a.onCollision(b);
        }
      }
    }
  }

  loop(timestamp) {
    const now = performance.now();
    const delta = (now - this.last) / 1000;
    this.last = now;

    this.screen.clear();

const steps = 4;
const stepDelta = delta / steps;

for (let s = 0; s < steps; s++) {
  for (const a of this.asteroids) {
    a.update(stepDelta, this.screenW, this.screenH);
  }
  this.handleAsteroidCollisions();
}

    // draw
    for (const a of this.asteroids) {
      a.draw(this.screen.ctx);
    }

    DeltaReport.log(timestamp);

    requestAnimationFrame(() => this.loop(performance.now()));
  }
}
