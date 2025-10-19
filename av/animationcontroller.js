import DeltaReport from "./deltareport.js";

export default class AnimationController {
    constructor(collector, processor, renderer) {
        this.collector = collector;
        this.processor = processor;
        this.renderer = renderer;

        this.lastTimestamp = 0;
        // bind once
        this._loop = this.loop.bind(this);
    }
    start() {
        this.collector.fetchData();
        requestAnimationFrame(this._loop);
    }
    loop(timestamp) {
        const delta = (timestamp - (this.lastTimestamp || timestamp)) / 1000;
        this.lastTimestamp = timestamp;
        const data = this.collector.fetchData();
        const processedAudio = this.processor.process(data);
        this.renderer.render(delta, processedAudio);
        DeltaReport.log(timestamp);
        requestAnimationFrame(this._loop); // no new function per frame
    }
}