import EventContext from "./event-context.js";
import LayoutRegistry from "./layout-registry.js";
import TextRenderer from "./text-renderer.js";

export default class TextHiliter extends TextRenderer {
    static type = "textHiliter";
    constructor(cnvs, event, cfg) {
        super(cnvs, event, cfg);
        this.separator = cfg.separator ?? "";
        this.msg = this.tokens.join(this.separator);
        this.getBoundingRect(true);
        this.sepWidth = this.ctx.measureText(this.separator).width;
        this.hiliteIndex = cfg.hiliteIndex;
    }
    hilite(x, y, w) {
        if ( ! this.hiliteBg ) return;

        this.ctx.fillStyle = this.hiliteBg;
        this.ctx.fillRect(
            x,
            y - this.fontSize,
            w,
            this.fontSize * 1.2
        );
    }
    draw() {
        for ( let i = 0; i < this.tokens.length; i++ ) {
            const tok = String(this.tokens[i]);
            const w = ctx.measureText(tok).width;

            if ( i === this.hiliteIndex ) {
                this.hilite(this.drawX, this.y, w);
            } 

            this.ctx.fillText(tok, this.drawX, this.y);
            this.drawX += w;

            if ( this.separator && i < this.tokens.length - 1 ) {
                this.ctx.fillText(this.separator, this.drawX, this.y);
                this.drawX += this.sepWidth;
            }
        }
        this.getBoundingRect(true);
        this.registerLayout();
        this.animationDone = true;
    }
}
