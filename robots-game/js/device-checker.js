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

        const minW = 1300;
        const minH = 882;

        const isPortrait = this.info.aspect === "portrait";
        const tooSmall = this.info.innerW < minW || this.info.innerH < minH;

        if (isPortrait) {
            byId("warn").innerHTML = `
                <strong>Rotate your device</strong><br>
                This works best in landscape.<br>
                (${this.info.innerW} × ${this.info.innerH})
            `;
            this.warning.style.display = "block";
        } 
        else if (tooSmall) {
            byId("warn").innerHTML = `
                <strong>Screen is too small</strong><br>
                Recommended: ${minW} × ${minH}<br>
                Current: ${this.info.innerW} × ${this.info.innerH}<br>
                It'll run… but look really bad.`;
            this.warning.style.display = "block";
        } 
        else {
            this.warning.style.display = "none";
        }

        return this.info;
    }
}
