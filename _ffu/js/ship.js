import { ease, isNear } from "./functions.js";

export default class Ship {
    constructor(cfg, nav) {
        this.cfg = cfg;
        this.navigator = nav;
        this.z = 0;
        this.speed = 2; // forward speed
        this.targetSpeed = 2;
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.vz = 0;
        this.accel = 0.002;
        this.damping = 0.92;
        this.targetX = this.x;
        this.targetY = this.y;
    }
    isAtSpeed() {
        return isNear(this.speed, this.targetSpeed, 0.01);
    }
    isAtPosition() {
        return (
            isNear(this.x, this.targetX, 0.5) &&
            isNear(this.y, this.targetY, 0.5)
        );
    }
    setThrottle(s) {
        this.targetSpeed = s;
    }
    setThrusters(sx, sy) {
        this.targetX = this.x + sx;
        this.targetY = this.y + sy;
    }
    update() {
        // forward motion
        this.z += this.speed;
        this.navigator.steer(this);

        this.vx += (this.targetX - this.x) * this.accel;
        this.vx *= this.damping;
        this.x += this.vx;

        this.vy += (this.targetY - this.y) * this.accel;
        this.vy *= this.damping;
        this.y += this.vy;

        this.vz += ( this.targetSpeed - this.speed) * this.accel;
        this.vz *= this.damping;
        this.speed += this.vz;
    }
    render(ctx) {
        const cx = this.cfg.halfWidth;
        const cy = this.cfg.halfHeight;

        const size = 10;     // half-length of lines
        const gap = 4;       // gap in the centre
        const thickness = 1;

        ctx.strokeStyle = "red";
        ctx.lineWidth = thickness;

        ctx.beginPath();

        // horizontal left
        ctx.moveTo(cx - size, cy);
        ctx.lineTo(cx - gap, cy);

        // horizontal right
        ctx.moveTo(cx + gap, cy);
        ctx.lineTo(cx + size, cy);

        // vertical top
        ctx.moveTo(cx, cy - size);
        ctx.lineTo(cx, cy - gap);

        // vertical bottom
        ctx.moveTo(cx, cy + gap);
        ctx.lineTo(cx, cy + size);

        ctx.stroke();
    }
}
