export default class HUD {
    constructor() {
        this.elements = {};
    }
    sanitise(val) {
        if ( typeof val === "string" ) return val;
        return Math.round(val);
    }
    update(data) { 
        for (const d of data) {
            if ( !this.elements[d.type] ) {
                this.elements[d.type] = document.getElementById(d.type);
            }
            this.elements[d.type].innerText = this.sanitise(d.output);
        }
    }
}
