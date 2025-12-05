import Animation from "./animation.js";
import EventContext from "./event-context.js";

export default class TextRenderer extends Animation {
    static type = "textRenderer";
    constructor(cnvs, event, cfg) {
        super(cnvs);
        const evt = EventContext.byId(cfg.direction, cfg.type); 
        this.tokens = evt.data.array;
        this.currentIndex = 0;
        this.msg = ""; // accumulated text
        this.x = cfg.x; // default x
        this.y = cfg.y; // default y
    }
    // append a token to the current message
    nextCharacter() {
        this.msg += this.tokens[this.currentIndex];
        this.currentIndex++;
    }
    // draw current message at (x, y)
    draw() {
        this.ctx.fillText(this.msg, this.x, this.y);
        //console.log(this.msg);
    }
    // optional: clear the message
    clear() {
        this.msg = "";
    }
}
