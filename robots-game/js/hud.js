import { byId } from "./functions.js";

export default class HUD {
    constructor() {

    }
    sanitise(val) {
        if ( typeof val === "string" ) return val;
        return Math.round(val);
    }
    update(data) {
        for ( const d of data ) {
            if ( d.type === "msg" && d.output === "" ) continue;
            byId(d.type).innerText = this.sanitise(d.output);
        }
    }
}