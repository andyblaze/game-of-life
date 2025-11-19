export default class BaseParticle {
    constructor(x, y, screenSz) {
        this.x = x;
        this.y = y;
        this.screenSz = screenSz;
    }
    screenWrap() {
        const w = this.screenSz.width;
        const h = this.screenSz.height;
        const pad = 1; // small margin prevents jitter

        if (this.x < -pad) this.x = w + pad;
        else if (this.x > w + pad) this.x = -pad;

        if (this.y < -pad) this.y = h + pad;
        else if (this.y > h + pad) this.y = -pad;
    }
}
