import config from "./config.js";

class BaseBrush {
    constructor(lifetime) {
        this.t = 0;
        this.age = 0;
        this.lifetime = lifetime;
    }
    expired() {
        return this.age > this.lifetime;
    }
    updateAge() {
        this.age += 1 / 60;
    }
    reset() {
        this.age = 0;
        this.t = 0;
    }
}

export class NullBrush extends BaseBrush {
    constructor() {
        super(Math.floor(Math.random() * 2) + 3);
    }
    update() {
        this.updateAge();
    }
    reset() {
        this.age = Math.floor(Math.random() * 2) + 3;
    }
}

export class Brush extends BaseBrush {
    constructor(lifetime, p) {
        super(lifetime);
        this.path = p;
        this.t = 0;
    }
    update(dt, df) {
        this.updateAge();
        const verts = this.path.getVertices();  //console.log(verts);
        if ( this.t >= verts.length )
            this.t = 0;
        this.draw([verts[this.t]], df);
        this.t++;
    }
    draw(path, df) {
        for ( let i = 0; i < path.length; i++ ) {
            const [x,y] = path[i];
            const radius = Math.random() * 6 + 4;
            const strength = Math.random() * 1.2 + 0.3;
            df.exciteAt(x, y, radius, strength);
        }
    }
}

export class BinaryBrush extends BaseBrush {
  constructor(lifetime, cx, cy, distance = 200, m1 = 1, m2 = 1.2, G = 1) {
    super(lifetime);
    this.a = { x: cx - distance/2, y: cy, vx: 0, vy: 0, m: m1 };
    this.b = { x: cx + distance/2, y: cy, vx: 0, vy: 0, m: m2 };
    this.G = G;
    this.initialDistance = distance;
    this.eps = 1;           // gravity softening
    this.damping = 0.9995;    // slight velocity damping
    this.spring = 0.015;      // distance correction strength
    this.orbitTilt = (Math.random() - 0.5) * 0.3; // random plane wobble
  }

  // precompute roughly circular starting velocities
  initOrbit() {
    const dx = this.b.x - this.a.x;
    const dy = this.b.y - this.a.y;
    const r = Math.sqrt(dx*dx + dy*dy);
    const v = Math.sqrt(this.G * (this.a.m + this.b.m) / r);

    // perpendicular direction (unit)
    const nx = -dy / r;
    const ny = dx / r;

    // split velocity according to masses (center of mass stationary)
    this.a.vx =  nx * v * (this.b.m / (this.a.m + this.b.m));
    this.a.vy =  ny * v * (this.b.m / (this.a.m + this.b.m));
    this.b.vx = -nx * v * (this.a.m / (this.a.m + this.b.m));
    this.b.vy = -ny * v * (this.a.m / (this.a.m + this.b.m));
  }

  update(dt, df) {
    this.updateAge();
    const { a, b } = this;

    // vector from a -> b
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const r2 = dx*dx + dy*dy + this.eps;
    const r = Math.sqrt(r2);

    // gravitational force magnitude
    const F = this.G * a.m * b.m / r2;

    // normalized direction
    const fx = (dx / r) * F;
    const fy = (dy / r) * F;

    // accelerate both
    a.vx += fx / a.m;
    a.vy += fy / a.m;
    b.vx -= fx / b.m;
    b.vy -= fy / b.m;

    // soft spring to maintain approximate separation
    const dr = r - this.initialDistance;
    if (Math.abs(dr) > 0.5) {
      const corr = this.spring * dr;
      a.vx +=  dx / r * corr / 2;
      a.vy +=  dy / r * corr / 2;
      b.vx -=  dx / r * corr / 2;
      b.vy -=  dy / r * corr / 2;
    }

    // update positions
    a.x += a.vx;
    a.y += a.vy + this.orbitTilt;
    b.x += b.vx;
    b.y += b.vy - this.orbitTilt;

    // velocity damping for stability
    a.vx *= this.damping;
    a.vy *= this.damping;
    b.vx *= this.damping;
    b.vy *= this.damping;

    // draw both stars
    this.draw(df, a);
    this.draw(df, b);
  }

  draw(df, body) {
    const radius = 6 + Math.random() * 6;
    const strength = 0.6 + Math.random() * 0.7;
    df.exciteAt(body.x, body.y, radius, strength);
  }
}

export class RotatingLineBrush extends BaseBrush {
  constructor(lifetime, config, length = 200, speed = 0.03) {
    super(lifetime);
    this.cx = config.W / 2;
    this.cy = config.H / 2;
    this.length = length;
    this.angle = 0;
    this.speed = speed;
    this.phase = Math.random() * Math.PI * 2;
    this.segmentPhase = Math.random() * Math.PI * 2;
  }

  update(dt, df) {
    this.updateAge();

    this.angle += this.speed;

    // slowly oscillate segment count between 2 and n
    const segDrift = 0.5 + 0.5 * Math.sin(this.segmentPhase + this.age * 0.3);
    const segments = Math.floor(2 + segDrift * 48); 
    const half = this.length / 2;
    const cosA = Math.cos(this.angle);
    const sinA = Math.sin(this.angle);

    // line endpoints rotating around center
    const x1 = this.cx + cosA * half;
    const y1 = this.cy + sinA * half;
    const x2 = this.cx - cosA * half;
    const y2 = this.cy - sinA * half;

    // draw along the line
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;

      const radius = 3 + Math.random() * 3;
      const strength = 0.5 + 0.5 * Math.sin(this.phase + this.angle + t * Math.PI * 2);
      df.exciteAt(x, y, radius, strength);
    }
  }
}



export class LissajousBrush extends BaseBrush {
    constructor(lifetime, config, radius = 180, freqX = 2, freqY = 3, speed = 0.02) {
    super(lifetime);
        this.cx = config.W / 2;
        this.cy = config.H / 2;
        this.radius = radius;
        this.freqX = freqX;
        this.freqY = freqY;
        this.speed = speed;
        this.t = Math.random() * Math.PI * 2; // random phase offset
        this.phaseShift = Math.random() * Math.PI * 2; // for richer variation
    }

    update(dt, df) {
        this.updateAge();
        this.t += this.speed;

        const x = this.cx + this.radius * Math.sin(this.freqX * this.t + this.phaseShift);
        const y = this.cy + this.radius * Math.cos(this.freqY * this.t);

        const radius = 4 + Math.sin(this.t * 0.7) * 2;
        const strength = 0.6 + 0.4 * Math.sin(this.t * 2 + this.phaseShift);

        df.exciteAt(x, y, radius, strength);
        df.exciteAt(x+20, y-20, radius, strength);
        df.exciteAt(x-20, y+20, radius, strength);
    }
}

export class ChaoticDuoBrush extends BaseBrush { // lorenz 
    constructor(lifetime, points=2000, dt=0.01, sigma=10, rho=28, beta=8/3, scale=5) {
        super(lifetime);
        this.points = points;
        this.dt = dt;
        this.sigma = sigma;
        this.rho = rho;
        this.beta = beta;
        this.scale = scale;

        // Initialize Lorenz points
        this.x = 0.1; this.y = 0; this.z = 0.1;
        this.t = 0;
        this.path = [];
        this.offsetX = config.W/2;
        this.offsetY = config.H/2;
    }

    update(dt, df) {
        this.age += 1 / 60;
        if (this.age > this.lifetime) return false; // signal expired
        // Advance the path one step
        const dx = this.sigma*(this.y - this.x) * this.dt;
        const dy = (this.x*(this.rho - this.z) - this.y) * this.dt;
        const dz = (this.x*this.y - this.beta*this.z) * this.dt;

        this.x += dx;
        this.y += dy;
        this.z += dz;

        const canvasX = this.offsetX + this.x * this.scale;
        const canvasY = this.offsetY + this.y * this.scale;

        this.path.push([canvasX, canvasY]);
        if (this.path.length > this.points) this.path.shift();

        // Draw current step
        this.draw([[canvasX, canvasY]], df);
        return true;
    }

    draw(path, df) {
        for (let i = 0; i < path.length; i++) {
            const [x, y] = path[i];
            const radius = Math.random() * 6 + 4;
            const strength = Math.random() * 1.2 + 0.3;
            df.exciteAt(x, y, radius, strength);
        }
    }
}
export class TriangleBrush extends BaseBrush {
    constructor(lifetime, config, points = 120, speed = 0.02) {
        super(lifetime); 
        this.cx = config.W / 2;
        this.cy = config.H / 2;
        this.radius = Math.min(config.W, config.H) / 4;
        this.points = points;
        this.speed = speed;
        this.angle = 0;
    }

    update(dt, df) {
        this.updateAge();
        
        this.angle += this.speed;
        // Calculate 3 triangle vertices rotated by current angle
        const a1 = this.angle;
        const a2 = this.angle + (2 * Math.PI / 3);
        const a3 = this.angle + (4 * Math.PI / 3);

        const x1 = this.cx + Math.cos(a1) * this.radius;
        const y1 = this.cy + Math.sin(a1) * this.radius;
        const x2 = this.cx + Math.cos(a2) * this.radius;
        const y2 = this.cy + Math.sin(a2) * this.radius;
        const x3 = this.cx + Math.cos(a3) * this.radius;
        const y3 = this.cy + Math.sin(a3) * this.radius;

        // Option 1: excite the three points
        df.exciteAt(x1, y1, 6, 1.0);
        df.exciteAt(x2, y2, 6, 1.0);
        df.exciteAt(x3, y3, 6, 1.0);

        // Option 2 (optional): excite along triangle edges for solid shape
        this.drawEdge(df, x1, y1, x2, y2);
        this.drawEdge(df, x2, y2, x3, y3);
        this.drawEdge(df, x3, y3, x1, y1);
    }

    drawEdge(df, x1, y1, x2, y2) {
        const steps = 20;
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = x1 + (x2 - x1) * t;
            const y = y1 + (y2 - y1) * t;
            df.exciteAt(x, y, 3, 0.6);
        }
    }
}

export class ShapeBrush extends BaseBrush {
    constructor(lifetime, shape, motion=null) {
        super(lifetime);
        this.shape = shape;
        this.motion = motion;
    }
    update(dt, df) {
        this.updateAge();
        const verts = this.motion.update(this.shape.getVertices());
        this.paint(df, verts);
    }
    paint(df, verts) {
        // Excite vertices
        for ( const [x, y] of verts ) {
            df.exciteAt(x, y, 6, 1.0);
        }

        // Excite edges — automatically loop back to the first vertex
        for ( let i = 0; i < verts.length; i++ ) {
            const [x1, y1] = verts[i];
            const [x2, y2] = verts[(i + 1) % verts.length]; // wraps around
            const steps = 20;
            for ( let s = 0; s <= steps; s++ ) {
                const t = s / steps;
                const x = x1 + (x2 - x1) * t;
                const y = y1 + (y2 - y1) * t;
                df.exciteAt(x, y, 3, 0.6);
            }
        }
    }
}
export class MultiShapeBrush extends BaseBrush {
  constructor(lifetime, ...brushes) {
    super(lifetime);
    // assign lifetime to all child brushes
    this.brushes = brushes.map(b => {
      b.lifetime = lifetime;
      return b;
    });
  }

  update(dt, df) {
    this.updateAge();

    for (const brush of this.brushes) {
      if (!brush.expired()) {
        brush.update(dt, df);
      }
    }
  }

  reset() {
    super.reset();
    for (const brush of this.brushes) {
      brush.reset();
    }
  }
}
