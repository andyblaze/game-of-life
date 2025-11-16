export default class BaseParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    screenWrap() {
        if (this.x < 0) this.x += canvas.width;
        if (this.x > canvas.width) this.x -= canvas.width;
        if (this.y < 0) this.y += canvas.height;
        if (this.y > canvas.height) this.y -= canvas.height;
    }
}
