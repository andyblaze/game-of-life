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

        // ----------------------------
        // APPLY EASING
        // ----------------------------
        this.speed = ease(this.speed, this.targetSpeed, 0.02);

        this.x = ease(this.x, this.targetX, 0.0125);
        this.y = ease(this.y, this.targetY, 0.0125);
    }
    render(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.cfg.halfWidth - 2, this.cfg.halfHeight - 2, 4, 4);
    }
}
