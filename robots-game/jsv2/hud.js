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
            if ( d.type === "msg" ) 
                this.elements[d.type].innerHTML = d.output.join("<br>");
            else
                this.elements[d.type].innerHTML = this.sanitise(d.output);
        }
    }
}
