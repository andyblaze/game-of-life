export default class BaseParticle {
    constructor(x, y, screenSz) {
        this.x = x;
        this.y = y;
        this.screenSz = screenSz;
    }
    screenWrap() {
        if (this.x <= 0) this.x += this.screenSz.width;
        if (this.x > this.screenSz.width) this.x -= this.screenSz.width;
        if (this.y <= 0) this.y += this.screenSz.height;
        if (this.y > this.screenSz.height) this.y -= this.screenSz.height;
    }
}
