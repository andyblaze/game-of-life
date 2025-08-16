
export default class DeltaReport {
    static lastTime = performance.now();
    static frameCount = 0;
    static sum = 0;
    
    static log(timestamp) {
        this.frameCount++;
        const delta = (timestamp - this.lastTime) / 16.67;
        this.sum += delta;
        this.lastTime = timestamp;
        if ( this.frameCount === 120 ) { // every 2 seconds
            console.log("fps", parseInt(60 / (this.sum / this.frameCount)));
            this.frameCount = 0;
            this.sum = 0;
        }
    }
}