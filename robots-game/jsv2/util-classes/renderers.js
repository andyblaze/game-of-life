export default class Renderers {
    constructor(cfg) {
        this.cfg = cfg;
        this.ctx = cfg.ctx;
        this.renderers = [];
    }
    add(r) {
        this.renderers.push(r);
    }
    render(ctx, timers) {
        this.ctx.clearRect(0, 0, this.cfg.width, this.cfg.height);
        for ( const r of this.renderers ) {
            r.render(ctx, timers);
        }
    }
}
