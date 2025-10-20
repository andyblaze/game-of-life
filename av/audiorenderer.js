const perlin = {
  noise: (x, y, z = 0) => {
    return Math.sin(x * 2 + y * 2 + z) * 0.5 + 0.5; // simple demo
  }
};

export default class AudioRenderer {
    constructor() {
        this.time = 0;
        this.prevBands = [];
        this.damping = 0.15; // smaller = smoother        
    }
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
        const { frequencies, volume } = data;
        const { width, height } = ctx.canvas;
        ctx.clearRect(0, 0, width, height);

        this.time += delta * 0.8;

        // --- SMOOTH FREQUENCIES ---
        if (!this.prevBands.length) this.prevBands = [...frequencies];
        const smoothedBands = frequencies.map((val, i) => {
            const prev = this.prevBands[i] || 0;
            const smooth = prev + (val - prev) * this.damping;
            this.prevBands[i] = smooth;
            return smooth;
        });

        // --- OPTIONAL: SMOOTH VOLUME TOO ---
        this.prevVolume = this.prevVolume ?? volume;
        const smoothedVolume =
            this.prevVolume + (volume - this.prevVolume) * this.damping;
        this.prevVolume = smoothedVolume;

        // now use smoothedBands + smoothedVolume instead of raw data
        const baseY = height * 0.85;
        const scale = height * 1.4;
        const numPoints = 200;
        const step = width / (numPoints - 1);
        const bass = smoothedBands[0] || 0;
        const ripple = 0.5 + bass * 1.5;

        ctx.beginPath();
        for (let i = 0; i < numPoints; i++) {
            const x = i * step;
            const fade = Math.max(0, 1 - Math.abs((x - width / 2) / (width * 0.25)));

            const bandIndex = (i / numPoints) * (smoothedBands.length - 1);
            const low = Math.floor(bandIndex);
            const high = Math.min(smoothedBands.length - 1, low + 1);
            const blend = bandIndex - low;
            const freq =
                (smoothedBands[low] * (1 - blend) + smoothedBands[high] * blend) * fade;

            const n1 = perlin.noise(x * 0.02, this.time * 0.8);
            const n2 = perlin.noise(x * 0.05, this.time * 1.2);
            const n3 = perlin.noise(x * 0.1, this.time * 1.8);
            const noise = (n1 + n2 * 0.5 + n3 * 0.25) * 30 * fade * ripple;

            const heightBoost = freq * scale + noise * (0.5 + smoothedVolume * 0.5);
            const y = baseY - heightBoost;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }

        ctx.lineWidth = 1;
        ctx.strokeStyle = `hsl(${Math.floor(smoothedVolume * 300)}, 80%, 60%)`;
        //ctx.shadowBlur = 10 + smoothedVolume * 30;
        //ctx.shadowColor = ctx.strokeStyle;
        ctx.stroke();
    }    
    draw2(delta, ctx, data) {
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
