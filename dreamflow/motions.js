// --- Motion: defines how angle (and possibly position) changes over time ---
class Rotate {
    constructor(speed = 0.02, initialAngle = 0, direction = 1) {
        this.speed = speed;
        this.angle = initialAngle;
        this.direction = Math.sign(direction) || 1; // ensure ±1
    }
    update(vertices) {
        this.angle += this.speed * this.direction;

        // Compute rotation around shape’s center
        // Find centroid first
        const cx = vertices.reduce((a, [x]) => a + x, 0) / vertices.length;
        const cy = vertices.reduce((a, [_, y]) => a + y, 0) / vertices.length;

        const cosA = Math.cos(this.angle);
        const sinA = Math.sin(this.angle);

        // Rotate each vertex about the centroid
        return vertices.map(([x, y]) => {
            const dx = x - cx;
            const dy = y - cy;
            const rx = cx + dx * cosA - dy * sinA;
            const ry = cy + dx * sinA + dy * cosA;
            return [rx, ry];
        });
    }
}
class Pulse {
    constructor(speed = 1.5, amplitude = 0.15) {
        this.time = Math.random() * Math.PI * 2; // random phase offset
        this.speed = speed;     // how fast it pulses
        this.amplitude = amplitude; // how strong the size change (0.15 = ±15%)
    }

    update(vertices) {
        this.time += this.speed * 0.016; // roughly frame-scaled increment
        const scale = 1 + Math.sin(this.time) * this.amplitude;

        // Find centroid
        const cx = vertices.reduce((a, [x]) => a + x, 0) / vertices.length;
        const cy = vertices.reduce((a, [_, y]) => a + y, 0) / vertices.length;

        // Scale vertices relative to centroid
        return vertices.map(([x, y]) => {
            const dx = x - cx;
            const dy = y - cy;
            return [cx + dx * scale, cy + dy * scale];
        });
    }
}

class Wobble {
    constructor({ amp = 6, freq = 0.002, phaseSpread = Math.PI * 2 } = {}) {
        this.amp = amp;             // how far vertices wobble
        this.freq = freq;           // how fast the wobble oscillates
        this.phaseSpread = phaseSpread; // ensures vertices move differently
        this.startTime = performance.now();
    }
    update(vertices) {
        const t = (performance.now() - this.startTime) * this.freq;

        // return new set of wobbled vertices
        return vertices.map(([x, y], i) => {
            const phase = i * this.phaseSpread / vertices.length;
            const dx = Math.sin(t + phase) * this.amp;
            const dy = Math.cos(t * 1.1 + phase * 0.7) * this.amp * 0.8;
            return [x + dx, y + dy];
        });
    }
}

class Spin {
    constructor(speed = 0.02) {
        this.time = 0;        // internal spin timer
        this.speed = speed;    // how fast it “spins”
    }

    update(vertices) {
        this.time += this.speed;
        // Compute scale factor for X coordinate (0.5 → narrow, 1 → full width)
        const scale = 0.5 + 0.5 * Math.sin(this.time);
        const cx = vertices.reduce((sum, v) => sum + v[0], 0) / vertices.length;
        // Return new vertices with X scaled around center
        return vertices.map(([x, y]) => [
            cx + (x - cx) * scale,
            y
        ]);
    }
}

