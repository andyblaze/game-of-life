import { byId } from "./functions.js";

export default class Cfg { 
    constructor(tc, canvasId) {
        this.canvas = byId(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.canvasCenter = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
        this.converter = tc;
    }
    updateCtrl(ctrl) { 
        const type = ctrl.dataset.type;
        const property = ctrl.dataset.property;
        this[property] = this.converter.apply(type, ctrl.value);
    }
    update(ctrls) {
        for ( const ctrl of ctrls ) {
            this.updateCtrl(ctrl);
        }
    }
}
