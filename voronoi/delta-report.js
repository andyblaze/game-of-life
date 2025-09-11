
export default class DeltaReport {
    static lastTime = performance.now();
    static startTime = performance.now();
    static frameCount = 0;
    static sum = 0;
    static min = 60;
    static max = 0;
    //static report = document.getElementById("fps-report");
    
    static log(timestamp, nCritters) {
        this.frameCount++;
        const delta = (timestamp - this.lastTime) / 16.67;
        this.sum += delta;
        this.lastTime = timestamp;
        if ( this.frameCount === 120 ) { // every 2 seconds
            const fps = parseInt(60 / (this.sum / this.frameCount));
            if ( fps < this.min ) this.min = fps; 
            if ( fps > this.max ) this.max = fps; 
            const totalSeconds = Math.floor((timestamp - this.startTime) / 1000);
            const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
            const seconds = (totalSeconds % 60).toString().padStart(2, '0');
            const elapsed = minutes + ":" + seconds;
            console.log("fps", fps, "min=", this.min, "max=", this.max, "elapsed=", elapsed);
            //this.report.innerText = fps + " " + this.min + " " + this.max;
            this.frameCount = 0;
            this.sum = 0;
        }
    }
}