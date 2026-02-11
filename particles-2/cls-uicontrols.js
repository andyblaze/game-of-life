import { byId, byQsArray } from "./functions.js";

export default class UiControls {
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
        if ( typeof label === "string" )
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
