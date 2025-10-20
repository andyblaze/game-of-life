const perlin = {
  noise: (x, y, z = 0) => {
    return Math.sin(x * 2 + y * 2 + z) * 0.5 + 0.5; // simple demo
  }
};

export default class AudioRenderer {
    constructor() {
        this.time = 0;
        this.prevBands = [];
        this.prevVolume = 0;
        this.damping = 0.15; // smaller = smoother 
        this.rotation = 0; // shared rotation angle       
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
    //ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(0, 0, 0, 0.01)"; // lower alpha = longer trails
    ctx.fillRect(0, 0, width, height);

    this.time += delta;
    this.rotation += delta * 0.3; // rotation speed

    // Smooth bands + volume
    if (!this.prevBands.length) this.prevBands = [...frequencies];
    const smoothedBands = frequencies.map((v, i) => {
      const prev = this.prevBands[i] || 0;
      const smooth = prev + (v - prev) * this.damping;
      this.prevBands[i] = smooth;
      return smooth;
    });
    this.prevVolume = this.prevVolume + (volume - this.prevVolume) * this.damping;

    // Center + size
    const cx = width / 2;
    const cy = height / 2;
    const squareSize = Math.min(width, height) * 0.6;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.rotation);

    const hue = (performance.now() * 0.05) % 360; 
    // --- Draw rotating square frame ---
    ctx.strokeStyle = `hsla(${hue}, 90%, 60%, 0.6)`;
    ctx.lineWidth = 1;
    ctx.strokeRect(-squareSize / 2, -squareSize / 2, squareSize, squareSize);

    // --- Draw waveform inside square ---
    this.drawWaveform(ctx, smoothedBands, this.prevVolume, squareSize);

    ctx.restore();
  }

  drawWaveform(ctx, bands, volume, squareSize) {
    const scale = squareSize * 0.99;
    const numPoints = 200;
    const step = squareSize / (numPoints - 1);
    const bass = bands[0] || 0;

    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
      const x = -squareSize / 2 + i * step;
      const fade = Math.max(0, 1 - Math.abs(x / (squareSize * 0.5))); // taper edges

      // interpolate between bands
      const bandIndex = (i / numPoints) * (bands.length - 1);
      const low = Math.floor(bandIndex);
      const high = Math.min(bands.length - 1, low + 1);
      const blend = bandIndex - low;
      const freq = (bands[low] * (1 - blend) + bands[high] * blend) * fade;

      // add layered perlin noise for texture
      const n1 = perlin.noise(x * 0.03, this.time * 1.0);
      const n2 = perlin.noise(x * 0.08, this.time * 0.6) * 0.5;
      const noise = (n1 + n2) * 25 * fade * (0.5 + bass * 0.5);

      const heightBoost = freq * scale + noise * (0.5 + volume * 0.5);
      const y = -heightBoost;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    const hue = (performance.now() * 0.05) % 360; 
    ctx.lineWidth = 1;
    ctx.strokeStyle = `hsl(${Math.floor(volume * 300)}, 90%, 60%)`;
    //ctx.shadowBlur = 10 + volume * 40;
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
