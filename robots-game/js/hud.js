import { byId } from "./functions.js";

export default class HUD {
    constructor() {

    }
    update(data) {
        for ( const d of data ) {
            if ( d.type === "msg" && d.output === "" ) continue;
            byId(d.type).innerText = d.output;
        }
    }
}