import TextRenderer from "./text-renderer.js";

export default class TextHiliter extends TextRenderer {
    static type = "textHiliter";
    constructor(cnvs, event, cfg) {
        super(cnvs, event, cfg);
        this.separator = cfg.separator ?? "";
        this.msg = this.tokens.join(this.separator);
        this.bounds = this.getBoundingRect(true);
        this.sepWidth = this.ctx.measureText(this.separator).width;
        this.tokenOffsets = [];      // x offset per token
        this.tokenWidths = [];       // width per token
        this.hiliteIndex = cfg.hiliteIndex;
        this.layoutDirty = true;
        this.rebuildLayout();
    }
    rebuildLayout() {
        let x = 0;
        this.tokenOffsets = [];
        this.tokenWidths = [];

        for (let i = 0; i < this.tokens.length; i++) {
            const tok = String(this.tokens[i]);
            const w = this.ctx.measureText(tok).width;

            this.tokenOffsets.push(x);
            this.tokenWidths.push(w);
            x += w;

            if (this.separator && i < this.tokens.length - 1) {
                x += this.sepWidth;
            }
        }
        this.getBoundingRect(true);
        this.registerLayout();
        this.layoutDirty = false;
    }
    hilite(x, y, w) { //console.log(x, y, w);
        this.ctx.save();
        this.ctx.fillStyle = "yellow";
        this.ctx.fillRect(x, y + this.bounds.h+2, w, 2);
        this.ctx.restore();
    }
    draw() {
        if ( this.layoutDirty ) this.rebuildLayout();
        // draw full text once
        this.ctx.fillText(this.msg, this.drawX, this.y);
        const x = this.drawX + this.tokenOffsets[this.hiliteIndex];
        const w = this.tokenWidths[this.hiliteIndex];
        this.hilite(x, this.y, w);
    }
}
