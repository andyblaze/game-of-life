export default class HUD {
    constructor() {
        this.elements = {};
    }
    update(data) { 
        for (const d of data) {
            if ( !this.elements[d.type] ) {
                this.elements[d.type] = document.getElementById(d.type);
            }
            this.elements[d.type].innerText = d.output;
        }
    }
}
