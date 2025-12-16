import Animation from "./animation.js";

export default class TextMover extends Animation {
    static type = "textMover";

    constructor(cnvs, event, cfg) {
        super(cnvs);
        this.event = event;
        this.msg = this.event.data.string;
        this.speed = cfg.speed;

        this.x = cfg.start.x;
        this.y = cfg.start.y;

        // waypoints: [{x, y}, ...]
        this.waypoints = cfg.waypoints ?? [
            { x: cfg.target.x, y: cfg.target.y }
        ];

        this.wpIndex = 0;
        this.targetX = this.waypoints[0].x;
        this.targetY = this.waypoints[0].y;

        this.textSz = this.measureText(this.msg);
    }
    setMsg(m) {
        this.msg = m;
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
    advanceWaypoint() {
        this.wpIndex++;

        if (this.wpIndex >= this.waypoints.length) {
            // Finished all waypoints
            this.registerLayout();
            this.animationDone = true;
            this.onComplete();
            return;
        }

        const wp = this.waypoints[this.wpIndex];
        this.targetX = wp.x;
        this.targetY = wp.y;
    }
    run(dt, elapsedSeconds) {
        if (!this.started || this.animationDone) {
            this.draw(this.x, this.y);
            return;
        }

        // Move toward current waypoint
        this.x += (this.targetX - this.x) * this.speed;
        this.y += (this.targetY - this.y) * this.speed;

        const reached = (
            Math.abs(this.x - this.targetX) < 1 &&
            Math.abs(this.y - this.targetY) < 1
        );

        if (reached) {
            this.x = this.targetX;
            this.y = this.targetY;
            this.advanceWaypoint();
        }

        this.draw(this.x, this.y);
    }
}
