
export default class RafLoop {
    constructor() {
        this.lastTime = 0;
        this.running = false;
        this.tick = this.tick.bind(this);
    }
    start() {
        if ( this.running ) return;
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this.tick);
    }
    stop() {
        this.running = false;
    }
    tick(time) {
        if ( ! this.running ) return;

        const dt = time - this.lastTime; // ms
        this.lastTime = time;

        // notify observers
        if ( this.onTick ) {
            this.onTick(dt, time);
        }

        requestAnimationFrame(this.tick);
    }
    setHandler(fn) {
        this.onTick = fn;
    }
}
