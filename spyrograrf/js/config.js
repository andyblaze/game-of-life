import { byId } from "./functions.js";

function setupCanvas(canvas) {

    const dpr = window.devicePixelRatio || 1;

    const rect = canvas.getBoundingClientRect();

    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");

    ctx.scale(dpr, dpr);

    return ctx;
}

export default class Config {
    constructor(canvasId, workspaceId, tc) {
        this.converter = tc;
        this.controlsData = {};
        this.canvas = byId(canvasId);
        this.ctx = this.canvas.getContext("2d");
        const rect = byId(workspaceId).getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = window.innerHeight;
        this.canvasW = this.canvas.width;
        this.canvasH = this.canvas.height;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.outerRadiusX = 251;
        this.outerRadiusY = 251;
        this.rotation = 0;
        this.innerRadius = 109;
        this.penOffset = 91;
        this.theta = 0;
        this.speed = 0.02;
        this.color_start = {},
        this.color_end = {},
        this.alpha = 1;
    }
    updateCtrl(ctrl) { 
        const type = ctrl.dataset.type;
        const property = ctrl.dataset.property;
        this[property] = this.converter.apply(type, ctrl, ctrl.value);
        this.controlsData[property] = this.converter.apply(type, ctrl, ctrl.value); 
    }
    update(ctrls) {
        for ( const ctrl of ctrls ) {
            this.updateCtrl(ctrl);
        }
    }
}
