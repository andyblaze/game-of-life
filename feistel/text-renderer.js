import Animation from "./animation.js";
import EventContext from "./event-context.js";
import LayoutRegistry from "./layout-registry.js";

export default class TextRenderer extends Animation {
    static type = "textRenderer";
    constructor(cnvs, event, cfg) {
        super(cnvs);
        //const evt = EventContext.byId(cfg.direction, cfg.type); 
        this.event = event;
        this.tokens = this.event.data.array;
        this.msg = this.event.data.string;
        this.x = cfg.x; // default x
        this.y = cfg.y; // default y
        this.textSz = this.measureText(this.msg);
        this.justify = cfg.justify ?? "left";
        this.drawX = this.justifyText();
    }
    justifyText() {
        if ( this.justify === "left" )      return this.x;
        const rect = this.getBoundingRect();
        if ( this.justify === "right" )     return this.x - rect.w;
        if ( this.justify === "center" )    return (this.canvas.width - rect.w) / 2;
        return this.x;
    }
    getBoundingRect(reMeasure=false) {
        if ( true === reMeasure )
            this.textSz = this.measureText(this.msg);
        return {
            x: this.x,
            y: this.y,
            w: this.textSz.width,
            h: this.textSz.height + 2
        };
    }
    draw() {
        if ( this.msg.length === 0 ) return;
        this.ctx.fillText(this.msg, this.drawX, this.y);
        this.registerLayout();
        this.animationDone = true;
    }
    clear() {
        const rect = this.getBoundingRect();
        this.ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
        this.msg = "";
    }
    run(dt, elapsedSeconds) {
        if ( false === this.started || true === this.animationDone) {
            this.draw();
            return;
        }
        this.draw();
    }
}
