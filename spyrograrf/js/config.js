import { byId } from "./functions.js";

/*function setupCanvas(canvas) {

    const dpr = window.devicePixelRatio || 1;

    const rect = canvas.getBoundingClientRect();

    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");

    ctx.scale(dpr, dpr);

    return ctx;
}

cfg.centerX = canvas.width / (2 * dpr);
cfg.centerY = canvas.height / (2 * dpr);

window.addEventListener("resize", () => {

    ctx = setupCanvas(canvas);

    cfg.centerX = canvas.clientWidth / 2;
    cfg.centerY = canvas.clientHeight / 2;

    reset();   // restart drawing
});

const MAX = 2000;

canvas.width  = Math.min(rect.width  * dpr, MAX);
canvas.height = Math.min(rect.height * dpr, MAX);*/

export default class Config {
    constructor(canvasId, workspaceId, tc) {
        this.workspaceId = workspaceId;
        this.converter = tc;
        this.controlsData = {};
        this.canvas = byId(canvasId);
        this.ctx = this.canvas.getContext("2d");
        /*const rect = byId(workspaceId).getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = window.innerHeight - 98;
        this.canvasW = this.canvas.width;
        this.canvasH = this.canvas.height;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;*/
        /*this.outerRadiusX = 251;
        this.outerRadiusY = 251;
        this.rotation = 0;
        this.innerRadius = 109;
        this.penOffset = 91;
        this.theta = 0;
        this.speed = 0.02;
        this.color_start = {},
        this.color_end = {},
        this.alpha = 1;*/
    }
    setupCanvas(screenData) {
        const dpr = screenData.dpr;
        //const rect = this.canvas.getBoundingClientRect();
        const rect = byId(this.workspaceId).getBoundingClientRect();
        this.canvas.width  = rect.width  * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.centerX = this.canvas.width / (2 * dpr);
        this.centerY = this.canvas.height / (2 * dpr);
    }
    updateCtrl(ctrl) { 
        const type = ctrl.dataset.type;
        const property = ctrl.dataset.property;
        const val = this.converter.apply(type, ctrl, ctrl.value);
        this[property] = val;
        this.controlsData[property] = val;
    }
    update(ctrls) {
        for ( const ctrl of ctrls ) {
            this.updateCtrl(ctrl);
        }
    }
    export() {
        return JSON.stringify(this.controlsData);
    }
    importPreset(data) {        
        const ctrls = JSON.parse(data);
        for (const [key, val] of Object.entries(ctrls)) {
            this[key] = val;
            this.controlsData[key] = val;
        }
    }
}
