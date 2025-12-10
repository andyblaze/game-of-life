import { isNumeric } from "./functions.js";
import Animation from "./animation.js";

export default class TextMover extends Animation {
    static type = "textMover";
    constructor(cnvs, event, cfg) {
        super(cnvs);
        this.event = event;
        this.msg = event.data.string;
        this.speed = cfg.speed;
        this.x = cfg.start.x;
        this.y = cfg.start.y;
        this.targetX = cfg.target.x;
        this.targetY = cfg.target.y;
        this.textSz = this.measureText(this.msg);
    }
    
    draw(x, y) {
        this.ctx.fillText(this.msg, x, y);
    }
    getBoundingRect() {
        return {
            x: this.x,
            y: this.y,
            w: this.textSz.width,
            h: this.textSz.height + 2
        };
    }
    run(dt, elapsedSeconds) {
        if ( false === this.started || true === this.animationDone) {
            this.draw(this.x, this.y);
            return;
        }
        // Move toward target - simple linear interpolation
        this.x += (this.targetX - this.x) * this.speed;
        this.y += (this.targetY - this.y) * this.speed;
        // Stop at target
        const reached = (Math.abs(this.x - this.targetX) < 0.5 &&
            Math.abs(this.y - this.targetY) < 0.5);
        // If done, return early
        if ( reached ) {
            this.x = this.targetX;
            this.y = this.targetY;
            this.draw(this.x, this.y);
            this.registerLayout();
            this.animationDone = true;
            this.onComplete();
            return;
        }
        this.draw(this.x, this.y);
    }
}
