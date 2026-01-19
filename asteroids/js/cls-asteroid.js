class Entity {
    constructor() {}
  update(delta, world) {}
  draw(ctx) {}
}

export default class Asteroid extends Entity {
  constructor(x, y, radius) {
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;

    this.vx = (Math.random() - 0.5) * 120;
    this.vy = (Math.random() - 0.5) * 120;

    // NEW rotation
    this.angle = Math.random() * Math.PI * 2;
    this.angularVelocity = (Math.random() - 0.5) * 1.5; // radians/sec

    this.vertices = [];
    const vertexCount = 8 + Math.floor(Math.random() * 5);
    for (let i = 0; i < vertexCount; i++) {
      const angle = (i / vertexCount) * Math.PI * 2;
      const dist = radius * (0.7 + Math.random() * 0.3);
      this.vertices.push({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist
      });
    }
  }

update(delta, screenWidth, screenHeight) {
  this.x += this.vx * delta;
  this.y += this.vy * delta;

  // rotation continues regardless of bounce
  this.angle += this.angularVelocity * delta;

  // Bounce off left/right
  if (this.x - this.radius < 0) {
    this.x = this.radius;
    this.vx = -this.vx;
  }
  if (this.x + this.radius > screenWidth) {
    this.x = screenWidth - this.radius;
    this.vx = -this.vx;
  }

  // Bounce off top/bottom
  if (this.y - this.radius < 0) {
    this.y = this.radius;
    this.vy = -this.vy;
  }
  if (this.y + this.radius > screenHeight) {
    this.y = screenHeight - this.radius;
    this.vy = -this.vy;
  }
}



draw(ctx) {
  ctx.strokeStyle = "white";

  ctx.beginPath();

  const v0 = this.vertices[0];
  let rx = v0.x * Math.cos(this.angle) - v0.y * Math.sin(this.angle);
  let ry = v0.x * Math.sin(this.angle) + v0.y * Math.cos(this.angle);
  ctx.moveTo(this.x + rx, this.y + ry);

  for (let i = 1; i < this.vertices.length; i++) {
    const v = this.vertices[i];
    rx = v.x * Math.cos(this.angle) - v.y * Math.sin(this.angle);
    ry = v.x * Math.sin(this.angle) + v.y * Math.cos(this.angle);
    ctx.lineTo(this.x + rx, this.y + ry);
  }

  ctx.closePath();
  ctx.stroke();
}
collidesWith(other) {
  const dx = this.x - other.x;
  const dy = this.y - other.y;
  const radii = this.radius + other.radius;
  return dx * dx + dy * dy < radii * radii;
}
onCollision(other) {
  if (!(other instanceof Asteroid)) return;

  const dx = other.x - this.x;
  const dy = other.y - this.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  const nx = dx / dist;
  const ny = dy / dist;

  const rvx = this.vx - other.vx;
  const rvy = this.vy - other.vy;

  const velAlongNormal = rvx * nx + rvy * ny;
  if (velAlongNormal > 0) return;

  const impulse = 2 * velAlongNormal / 2;
  this.vx -= impulse * nx;
  this.vy -= impulse * ny;

  // separation fix
  const overlap = (this.radius + other.radius) - dist;
  if (overlap > 0) {
    const correction = overlap / 2;
    this.x -= nx * correction;
    this.y -= ny * correction;
  }
}


}

