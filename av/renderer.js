export default class Renderer {
    constructor(canvas, strategy) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.strategy = strategy;
    }
    render(delta, data) {
        this.strategy.draw(delta, this.ctx, data);
    }
}