import { getCanvas } from "./config.js";

export default class View {
    constructor(config) {
        this.canvas = getCanvas();
        this.ctx = this.canvas.getContext("2d");
    }
    draw(data) {
        for ( const d of data ) {
            d.draw(this.ctx);
        }
    }
}