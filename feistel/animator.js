export class Slider {
    constructor(cnvs, message, speed, x, y) {
        this.canvas = cnvs;
        this.ctx = cnvs.getContext("2d");
        this.cfg = { "msg": message, "speed":speed, "x": x, "y":y };
        this.textWidth = Math.floor(this.ctx.measureText(message).width);
    }
    run() {
        if ( this.cfg.x < (this.canvas.width - this.textWidth) / 2 ) 
            this.cfg.speed = 0;
        this.ctx.fillText(this.cfg.msg, this.cfg.x, this.cfg.y);
        // Move text left each frame
        this.cfg.x += this.cfg.speed;
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