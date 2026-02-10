import { byId, byQsArray } from "./functions.js";
import Emitter from "./cls-emitter.js";

class Controls {
    constructor(selector) {
        this.observers = [];
        this.ctrls = byQsArray(selector);
        for ( const ctrl of this.ctrls ) {
            ctrl.oninput = () => this.synch(ctrl);
        }
        this.notify();
    }
    synch(ctrl) {
        const label = ctrl.dataset.label ?? null;
        if ( label !== null )
            byId(label).textContent = ctrl.value;
        this.notify();
    }
    addObserver(o) {
        this.observers.push(o);
    }
    notify() {
        for ( const o of this.observers ) {
            o.update(this.ctrls);
        }
    }
}

class Cfg { 
    updateCtrl(ctrl) { 
        const property = ctrl.dataset.property;
        this[property] = parseFloat(ctrl.value);
    }
    update(ctrls) {
        for ( const ctrl of ctrls ) {
            this.updateCtrl(ctrl);
        }
    }
}
const config = new Cfg();
const uiControls = new Controls("#ui-panel input");
uiControls.addObserver(config);
//uiControls.notify();

const canvas = byId("effect");
const ctx = canvas.getContext("2d");
const emitter = new Emitter(canvas.width / 2, canvas.height / 2);

function loop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    emitter.update(config, 1); // dt = 1 frame (super simple)
    emitter.draw(ctx);
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
