export default class AudioRenderer {
    constructor() {}
    drawBass(ctx, b, delta) {
        const { width, height } = ctx.canvas;
        const bassAmplitude = b;  // 0–1
        const maxRadius = 100;
        const deltaMs = delta * 100; // 16 at 60fps
        const radius = deltaMs * bassAmplitude * maxRadius + 20; // add min radius

        ctx.beginPath();
        ctx.arc(width / 6, height / 2, radius, 0, Math.PI * 2);
        ctx.fillStyle = "teal";
        ctx.fill();       
    }
    drawVolume(ctx, vol, delta) {
        const volume = vol;  // 0–1
        const maxRadius = 100;
        const deltaMs = delta * 100; // 16 at 60fps
        const radius = deltaMs * volume * 700 * maxRadius + 20; // add min radius

        ctx.beginPath();
        ctx.arc(1000, 440, radius, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();       
    }
    drawBar(ctx, b, delta, i) {
        const { width, height } = ctx.canvas;
        const numBands = 5;
        const barWidth = width / numBands;
        const baseY = height;
            const barHeight = b * height / 3;
            const x = i * barWidth;
            const y = baseY - barHeight;

            ctx.fillStyle = "limegreen";
            ctx.fillRect(x, y, barWidth, barHeight); 
    }
    draw(delta, ctx, data) {
        const { width, height } = ctx.canvas;
        ctx.clearRect(0, 0, width, height);

        const { frequencies, volume } = data; 
        this.drawVolume(ctx, volume, delta);
        frequencies.forEach((magnitude, i) => {
            if ( i === 0 ) 
                this.drawBass(ctx, frequencies[0], delta);
            this.drawBar(ctx, frequencies[i], delta, i); 
            //else 
            //    this.drawBass(bands[0], ctx, width, height);
        });
    }
}
