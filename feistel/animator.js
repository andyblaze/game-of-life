class Animation {
    constructor(cnvs) {
        this.canvas = cnvs;
        this.ctx = cnvs.getContext("2d");
    }
    run() {
        console.error("Must override BaseAnimation.run()");
    }
}
export class Slider extends Animation {
    constructor(cnvs, message, speed, y) {
        super(cnvs);
        this.msg = message;
        this.speed = speed;     // sign determines direction
        this.y = y;
        // Measure width
        this.textWidth = Math.floor(this.ctx.measureText(message).width);
        // Target centered position
        this.targetX = Math.floor((this.canvas.width - this.textWidth) / 2);
        // Decide WHERE to start based on direction
        this.x = (speed > 0)
            ? 0 - this.textWidth        // start off-screen left
            : this.canvas.width;        // start off-screen right
    }
    run() {
        // Stop at target
        if ( (this.speed > 0 && this.x >= this.targetX) ||
            (this.speed < 0 && this.x <= this.targetX) ) {
            this.x = this.targetX;
        }
        // Draw
        this.ctx.fillText(this.msg, this.x, this.y);
        // If done, return early
        if (this.x === this.targetX) return;
        // Move toward target
        this.x += this.speed;
    }
}
export class Animator {
    constructor(cnvs, ctx) {
        this.canvas = cnvs;
        this.ctx = ctx;
        this.animations = [];
    }
    notify() {
        for ( let a of this.animations )
            a.run();
    }
    add(animation) {
        this.animations.push(animation);
    }
}