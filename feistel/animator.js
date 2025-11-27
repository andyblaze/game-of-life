export default class Animator {
    constructor(cnvs, ctx) {
        this.canvas = cnvs;
        this.ctx = ctx;
    }
    slideIn(message, speed, x, y) {
        this.ctx.fillText(message, x, y);
        // Move text left each frame
        x -= speed;
        // Loop it when it runs off the left side
        const textWidth = this.ctx.measureText(message).width;
        if ( x < -textWidth ) 
            x = this.canvas.width;
    }
}