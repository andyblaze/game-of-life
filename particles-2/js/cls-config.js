import { byId } from "./functions.js";

export default class Cfg { 
    constructor(tc, canvasId) {
        this.canvas = byId(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.canvasCenter = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
        this.converter = tc;
        this.controlsData = {};
    }
    updateCtrl(ctrl) { 
        //if ( ctrl.type === "checkbox" && ctrl.checked === false ) return;
        const type = ctrl.dataset.type;
        const property = ctrl.dataset.property;
        this[property] = this.converter.apply(type, ctrl, ctrl.value);
        this.controlsData[property] = this.converter.apply(type, ctrl, ctrl.value);
    }
    update(ctrls) {
        for ( const ctrl of ctrls ) {
            this.updateCtrl(ctrl);
        }
        //console.log(this.controlsData);
    }
    export() {
        return JSON.stringify(this.controlsData);
    }
    importPreset(data) {        
        const ctrls = JSON.parse(data);
        for (const [key, val] of Object.entries(ctrls)) {
            this[key] = val;
            this.controlsData[key] = val;
            if ( key === "vortex" ) console.log(val, typeof val);
        }
        //console.log(this.controlsData);
    }
}
