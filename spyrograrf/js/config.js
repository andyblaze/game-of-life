import { byId } from "./functions.js";

export default class Config {
    constructor(canvasId) {
        this.canvas = byId(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvasW = this.canvas.width;
        this.canvasH = this.canvas.height;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.outerRadius = 151;
        this.innerRadius = 19;
        this.penOffset = 197;
        this.theta = 0;
        this.speed = 0.1;
    }
}
