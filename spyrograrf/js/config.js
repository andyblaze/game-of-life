import { byId } from "./functions.js";

export default class Config {
    constructor(canvasId, workspaceId) {
        this.canvas = byId(canvasId);
        this.ctx = this.canvas.getContext("2d");
        const workspace = byId(workspaceId);
        const rect = workspace.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = window.innerHeight
        this.canvasW = this.canvas.width;
        this.canvasH = this.canvas.height;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.outerRadius = 150;
        this.innerRadius = 35;
        this.penOffset = 40;
        this.theta = 0;
        this.speed = 0.1;
    }
}
