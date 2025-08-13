
export default class Drop {
    constructor({ lane, y, speed, chars, alphas, isGhost = false }) {
        this.lane = lane;        // Which vertical lane it's in
        this.y = y;              // Current vertical position
        this.speed = speed;      // Speed in px/frame
        this.chars = chars;      // Array of characters for this drop
        this.alphas = alphas;    // Matching alpha for each char
        this.isGhost = isGhost;  // Ghost flag
    }

    update(delta) {
        this.y += this.speed * delta;
    }

    isOffScreen(canvasHeight, charHeight) {
        return this.y - (this.chars.length * charHeight) > canvasHeight;
    }
}