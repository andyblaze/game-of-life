import { byId } from "./functions.js";

export default class DeviceChecker {
    constructor(warningId) {
        this.warning = byId(warningId);
        this.checkSize = this.checkSize.bind(this);
    }
    getInfo() {
        this.info = {
            innerW  : window.innerWidth, 
            innerH  : window.innerHeight ,
            clientW : document.documentElement.clientWidth, 
            clientH : document.documentElement.clientHeight,
            screenW : screen.width, 
            screenH : screen.height,
            availW  : screen.availWidth,
            availH  : screen.availHeight,
            dpr     : window.devicePixelRatio || 1
        };
        this.info.aspect = (this.info.innerH > this.info.innerW ? "portrait" : "landscape");
    }
    checkSize() {
        this.getInfo();
        this.warning.style.display = this.info.aspect === "portrait" ? "block" : "none";
        return this.info;
    }
}
