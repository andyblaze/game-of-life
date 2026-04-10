import DeltaRreport from "./delta-report.js";

export default class RafLoop {
    constructor(world, renderers, msgSystem, config) {
        this.world = world;
        this.renderers = renderers;
        this.msgSystem = msgSystem;
        this.cfg = config;

        this.t = 0;
        this.lastTime = 0;
        this.accumulator = 0;
        this.running = false;

        // bind once
        this._loop = this.loop.bind(this);
    }

    start() {
        if ( this.running ) return; // prevent double-start
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this._loop);
    }

    stop() {
        this.running = false;
    }

    loop(timestamp) {
        if ( !this.running ) return;

        const delta = timestamp - this.lastTime;
        const dt = delta / 1000;
        this.lastTime = timestamp;
        this.accumulator += delta;

        while ( this.accumulator >= this.cfg.GAME_TICK_RATE ) {
            this.world.tick();
            this.msgSystem.flush();
            this.accumulator -= this.cfg.GAME_TICK_RATE;
        }

        this.renderers.render(this.cfg.ctx, { noise: this.t, delta: dt });
        DeltaRreport.log(timestamp);
        this.t += 0.002;

        requestAnimationFrame(this._loop);
    }
}
