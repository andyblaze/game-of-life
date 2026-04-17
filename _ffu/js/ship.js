import { mt_randf, randomOutside } from "./functions.js";

export default class Ship {
    constructor(cfg) {
        this.cfg = cfg;
        this.z = 0;
        this.speed = 2; // forward speed
        this.targetSpeed = 2;
        this.isChangingSpeed = false;
        this.x = 0;
        this.y = 0;
        this.targetX = this.x;
        this.targetY = this.y;
        this.isSteering = false;
    }
    update() {
        this.z += this.speed;
        if (Math.random() < 0.1 && this.isChangingSpeed === false) {
            const newSpeed = mt_randf(0, 3); // 0 → 3 allows stop and faster movement
            this.setSpeed(newSpeed);
        }
        if (this.isChangingSpeed === true) {
            const easing = 0.02;

            const ds = this.targetSpeed - this.speed;
            this.speed += ds * easing;

            if (Math.abs(ds) < 0.01) {
                this.isChangingSpeed = false;
            }
        }
        if ( Math.random() < 0.016 && this.isSteering === false ) {
            const sx = randomOutside(200, 400);
            const sy = randomOutside(50, 150);
            this.steer(sx, sy);
        }
        if ( this.isSteering === true ) {
            const easing = 0.05;
            this.x += (this.targetX - this.x) * easing;
            this.y += (this.targetY - this.y) * easing;
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;

            if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
                this.isSteering = false;
            }
        }
    }
    setSpeed(s) {
        this.targetSpeed = s;
        this.isChangingSpeed = true;
    }
    steer(h, v) {
        if ( this.isSteering === true ) return;
        this.targetX = this.x + h;
        this.targetY = this.y + v;
        this.isSteering = true;
    }
    render(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.cfg.halfWidth - 2, this.cfg.halfHeight - 2, 4, 4);
    }
}
