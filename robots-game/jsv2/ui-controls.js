import { byQsArray } from "./functions.js";

export default class UI {
    constructor(b) {
        this.buildings = b;
    }
    buttons(selector) {
        byQsArray(selector).forEach(btn => {
            btn.addEventListener("click", (e) => this.buildings.buildFarm(e));
        });
    }
}