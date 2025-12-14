//import Animation from "./animation.js";
//import EventContext from "./event-context.js";
import LayoutRegistry from "./layout-registry.js";
import TextRenderer from "./text-renderer.js";

export default class TokenRenderer extends TextRenderer {
    static type = "tokenRenderer";
    constructor(cnvs, event, cfg) {
        cfg.justify = "center";
        super(cnvs, event, cfg);
        this.currentIndex = 0;
        this.msg = ""; // accumulated text
    }
    nextCharacter() {
        this.msg += this.tokens[this.currentIndex];
        this.currentIndex++;
        if ( this.currentIndex >= this.tokens.length ) { 
            this.registerLayout();
            this.animationDone = true;
            this.clear();
        }            
    }
    draw() {
        if ( this.msg.length === 0 ) return;
        this.getBoundingRect(true); // force re-measure because msg length may have changed
        this.drawX = this.justifyText();
        this.ctx.fillText(this.msg, this.drawX, this.y);
    }
}
