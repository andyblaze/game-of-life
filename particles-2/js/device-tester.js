import { byId } from "./functions.js";

export default class DeviceTester {
    constructor(modalID, closeButtonID) {
        this.modalID = modalID;
        const screenWidth  = window.screen.width;
        const screenHeight = window.screen.height;
        const viewportWidth  = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // your minimums
        const minWidth  = 1880;
        const minHeight = 910;

        this.tooSmall = viewportWidth < minWidth || viewportHeight < minHeight;
        byId(closeButtonID).onclick = () => { this.hideModal() } 
    }
    test() {
        if ( this.tooSmall ) this.showModal();
    }
    showModal() {
        byId(this.modalID).style.display = "flex";
    }
    hideModal() {
        byId(this.modalID).style.display = "none";
    }
}
