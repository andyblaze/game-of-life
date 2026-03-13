import { byId } from "./functions.js";

export default class DeviceChecker {
    constructor(warningId) {
        this.warning = byId(warningId);
        this.checkSize = this.checkSize.bind(this);
    }
    isPortrait() {
        return window.innerHeight > window.innerWidth;
    }
    checkSize() {
        this.warning.style.display = this.isPortrait() ? "block" : "none";
    }
}
