import Animation from "./animation.js";
import EventContext from "./event-context.js";
import LayoutRegistry from "./layout-registry.js";

export default class TokenRenderer extends Animation {
    static type = "tokenRenderer";
    constructor(cnvs, event, cfg) {
        super(cnvs);
        const evt = EventContext.byId(cfg.direction, cfg.type); 
        this.event = evt;
        this.tokens = evt.data.array;
        this.currentIndex = 0;
        this.msg = ""; // accumulated text
        this.x = cfg.x; // default x
        this.y = cfg.y; // default y
    }
    getBoundingRect() {
        const textSz = this.measureText(this.msg);
        return {
            x: this.x,
            y:  this.y,
            w: textSz.width,
            h: textSz.height + 2
        };
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
        const rect = this.getBoundingRect();
        this.x = (this.canvas.width - rect.w) / 2;
        this.ctx.fillText(this.msg, this.x, this.y);
    }
    clear() {
        const rect = this.getBoundingRect();
        this.ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
        this.msg = "";
    }
}
