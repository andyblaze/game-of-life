export default class DeltaReport {
    static lastTime = performance.now();
    static startTime = performance.now();
    static frameCount = 0;
    static sum = 0;
    static min = Infinity;
    static max = 0;
    static timeSum = 0; // total ms of frame times (not normalised)

    static log(timestamp) {
        this.frameCount++;
        const deltaTime = timestamp - this.lastTime; // ms since last frame
        const delta = deltaTime / 16.67; // normalised to 60fps

        this.sum += delta;
        this.timeSum += deltaTime;
        this.lastTime = timestamp;

        if (this.frameCount === 120) { // ~2 seconds at 60fps
            const fps = parseInt(60 / (this.sum / this.frameCount));
            if (fps < this.min) this.min = fps; 
            if (fps > this.max) this.max = fps; 

            const avgFrameTime = this.timeSum / this.frameCount; // ms
            const totalSeconds = Math.floor((timestamp - this.startTime) / 1000);
            const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
            const seconds = (totalSeconds % 60).toString().padStart(2, "0");
            const elapsed = minutes + ":" + seconds;

            console.log(
                "fps", fps,
                "min=", this.min,
                "max=", this.max,
                "avgFrame=", avgFrameTime.toFixed(2) + "ms",
                "elapsed=", elapsed
            );

            // reset accumulators
            this.frameCount = 0;
            this.sum = 0;
            this.timeSum = 0;
        }
    }
}