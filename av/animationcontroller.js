export default class AnimationController {
    constructor(collector, processor, fetchIntervalSeconds = 5) {
        this.collector = collector;
        this.processor = processor;

        this.fetchInterval = fetchIntervalSeconds;
        this.lastFetchTime = 0;

        this.lastTimestamp = 0;
        this.accumulator = 0;
        // bind once
        this._loop = this.loop.bind(this);
    }
    async start() {
        await this.collector.fetchData();
        requestAnimationFrame(this._loop);
    }
    async loop(timestamp) {
        const delta = (timestamp - (this.lastTimestamp || timestamp)) / 1000;
        this.lastTimestamp = timestamp;
        this.accumulator += delta;
        this.processor.process(delta, {});
        if ( this.accumulator - this.lastFetchTime >= this.fetchInterval ) {
            this.lastFetchTime = this.accumulator;
            const data = await this.collector.fetchData();
            if ( data ) 
                this.processor.process(delta, data);
        }
        //if ( this.processor.update ) 
        //    this.processor.update(delta, this.accumulator);
        DeltaReport.log(timestamp);
        requestAnimationFrame(this._loop); // no new function per frame
    }
}