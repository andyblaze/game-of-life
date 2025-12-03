import Animation from "./animation.js";

export default class TextRenderer extends Animation {
    static type = "textRenderer";
    constructor(cnvs, event, cfg) {
        super(cnvs);
        this.msg = ""; // accumulated text
        this.x = cfg.x; // default x
        this.y = cfg.y; // default y
    }
    // append a token to the current message
    append(token) {
        this.msg += token;
    }
    // draw current message at (x, y)
    draw(x = this.x, y = this.y) {
        this.ctx.fillText(this.msg, x, y);
    }
    // optional: clear the message
    clear() {
        this.msg = "";
    }
}
