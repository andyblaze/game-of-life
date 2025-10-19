export default class AudioProcessor {
    getRMS(frequencies) {
        const sumSquares = frequencies.reduce((sum, v) => sum + v*v, 0);
        return Math.sqrt(sumSquares / frequencies.length) / 255; // normalized 0–1
    }
    transform({ frequencies }) {
        if ( ! frequencies || ! frequencies.length ) {
            return { "frequencies": new Array(6).fill(0), "volume":0 };
        }

        const numBands = 5;
        const partSize = Math.floor(frequencies.length / numBands);
        const bands = [];

        for (let i = 0; i < numBands; i++) {
            const start = i * partSize;
            const end = (i === numBands - 1) ? frequencies.length : start + partSize;
            const slice = frequencies.slice(start, end);
            const avg = slice.length ? slice.reduce((a, b) => a + b, 0) / slice.length : 0;
            bands.push(avg / 255); // normalize 0–1
        }
        const vol = this.getRMS(bands);
        return { "frequencies": bands, "volume":vol };
    }
}

