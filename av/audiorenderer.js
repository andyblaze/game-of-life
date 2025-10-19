export default class AudioRenderer {
    constructor() {}
    drawBass(b, ctx, width, height) {
         const bassAmplitude = b;  // 0–1
        const maxRadius = 100;
        const radius = bassAmplitude * maxRadius + 20; // add min radius

        ctx.beginPath();
        ctx.arc(width / 6, height / 2, radius, 0, Math.PI * 2);
        ctx.fillStyle = "teal";
        ctx.fill();       
    }
    drawBar(b, ctx, width, height, i) {
        const numBands = 5;
        const barWidth = width / numBands;
        const baseY = height;
            const barHeight = b * height / 3;
            const x = i * barWidth;
            const y = baseY - barHeight;

            ctx.fillStyle = "limegreen";
            ctx.fillRect(x, y, barWidth, barHeight); 
    }
    draw(delta, ctx, bands) {
        const { width, height } = ctx.canvas;
        ctx.clearRect(0, 0, width, height);


        bands.forEach((magnitude, i) => {
            if ( i === 0 ) 
                this.drawBass(bands[0], ctx, width, height);
            this.drawBar(bands[i], ctx, width, height, i); 
            //else 
            //    this.drawBass(bands[0], ctx, width, height);
        });
    }
}
