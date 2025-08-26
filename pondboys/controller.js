import DeltaReport from "./delta-report.js";

export default class Controller {
    constructor(m, v, cfg) {
        this.model = m;
        this.view = v;
        this.framesPerTick = cfg.global("framesPerTick");
        this.paused = false;
        this.frameCount = 0;
    }
    resize() {
        this.paused = true;
        this.view.resize(window.innerWidth, window.innerHeight);
        this.paused = false;
    }
    // fps throttling
    frameReady() {
        this.frameCount = (this.frameCount + 1) % this.framesPerTick;
        return this.frameCount % this.framesPerTick === 0;
    }
    loop(timestamp) {
        if ( this.paused === false ) {            
            if ( this.frameReady() ) {
                const data = this.model.tick();
                this.view.draw(data);
                DeltaReport.log(timestamp, data.critters.length);
            }
        }
        requestAnimationFrame(this.loop.bind(this)); 
    } 
}