class Animation {
    constructor(cnvs) {
        this.canvas = cnvs;
        this.ctx = cnvs.getContext("2d");
    }
    run() {
        console.error("Must override BaseAnimation.run()");
    }
}
export class HorizontalTextSlider extends Animation {
    constructor(cnvs, event, cfg) {
        super(cnvs);
        //console.log(event.data, cfg);
        this.msg = event.data;
        this.speed = cfg.speed;     // sign determines direction
        this.y = cfg.y;
        // Measure width
        this.textWidth = Math.floor(this.ctx.measureText(this.msg).width);
        // Target centered position
        this.targetX = Math.floor((this.canvas.width - this.textWidth) / 2);
        // Decide WHERE to start based on direction
        this.x = (this.speed > 0)
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