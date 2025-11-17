export default class BaseParticle {
    constructor(x, y, screenSz) {
        this.x = x;
        this.y = y;
        this.screenSz = screenSz;
    }
    screenWrap() {
        if (this.x === 1) this.x = this.screenSz.width -1;
        if (this.x > this.screenSz.width -1) this.x = 1;
        if (this.y === 1) this.y = this.screenSz.height -1;
        if (this.y > this.screenSz.height -1) this.y = 1;
    }
}
