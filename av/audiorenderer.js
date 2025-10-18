export default class AudioRenderer {
    constructor(perlin) {
        this.perlin = perlin;
        this.width = 100;      // bar width
        this.height = 600;     // bar height
        this.x = 200;          // bar x position
        this.y = 800;          // bottom of bar y position
        this.noiseScale = 0.02; // how much noise affects the bar
        this.sideResolution = 20; // number of points along vertical edges
        this.topResolution = 10;  // number of points along top edge
    }

    draw(delta, ctx, data) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const time = delta * 20.1;

        // create gradient
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y - this.height);
        gradient.addColorStop(0, "#00ff00");
        gradient.addColorStop(0.3, "#ffff00");
        gradient.addColorStop(0.6, "#ff9900");
        gradient.addColorStop(1, "#ff0000");
        ctx.fillStyle = gradient;

        ctx.beginPath();

        // bottom left (anchored)
        ctx.moveTo(this.x, this.y);

        // left vertical edge points
        for (let i = this.sideResolution; i >= 0; i--) {
            const t = i / this.sideResolution;
            const noiseVal = this.perlin.noise(t * 5, time);
            const px = this.x + noiseVal * this.noiseScale * this.width; // jitter horizontally
            const py = this.y - t * this.height + noiseVal * this.noiseScale * this.height; // jitter vertically
            ctx.lineTo(px, py);
        }

        // top edge points
        for (let i = 0; i <= this.topResolution; i++) {
            const t = i / this.topResolution;
            const noiseVal = this.perlin.noise(t * 5 + 100, time); // offset to decorrelate
            const px = this.x + t * this.width + noiseVal * this.noiseScale * this.width;
            const py = this.y - this.height + noiseVal * this.noiseScale * this.height;
            ctx.lineTo(px, py);
        }

        // right vertical edge points
        for (let i = this.sideResolution; i >= 0; i--) {
            const t = i / this.sideResolution;
            const noiseVal = this.perlin.noise(t * 5 + 200, time);
            const px = this.x + this.width + noiseVal * this.noiseScale * this.width;
            const py = this.y - t * this.height + noiseVal * this.noiseScale * this.height;
            ctx.lineTo(px, py);
        }

        ctx.closePath();
        ctx.fill();
    }
}