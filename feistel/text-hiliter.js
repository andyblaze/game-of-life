
highlight(x, y, w) {
    const ctx = this.ctx;

    if (!this.highlightBg) return;

    ctx.fillStyle = this.highlightBg;
    ctx.fillRect(
        x,
        y - this.fontSize,
        w,
        this.fontSize * 1.2
    );
}
draw() {
    if (!this.tokens || this.tokens.length === 0) return;

    const ctx = this.ctx;
    ctx.font = this.font;

    this.getBoundingRect(true);

    const sep = this.separator ?? "";
    const sepWidth = sep ? ctx.measureText(sep).width : 0;

    let x = this.justifyText();
    const y = this.y;

    for (let i = 0; i < this.tokens.length; i++) {
        const tok = String(this.tokens[i]);
        const w = ctx.measureText(tok).width;

        if (i === this.highlightIndex) {
            this.highlight(x, y, w);
            ctx.fillStyle = this.highlightColor;
        } else {
            ctx.fillStyle = this.color;
        }

        ctx.fillText(tok, x, y);
        x += w;

        if (sep && i < this.tokens.length - 1) {
            ctx.fillStyle = this.color;
            ctx.fillText(sep, x, y);
            x += sepWidth;
        }
    }
}
