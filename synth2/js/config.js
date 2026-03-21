export default class Config {
    constructor(canvasId, tc) {
        this.converter = tc;
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.canvasW = this.canvas.width;
        this.canvasH = this.canvas.height;
        this.centerX = this.canvasW / 2;
        this.centerY = this.canvasH / 2;
        this.osc = 100;
        this.controlsData = {};
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
}