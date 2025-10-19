export default class AudioProcessor {
    transform({ frequencies }) {
        if (!frequencies || !frequencies.length) {
            return new Array(6).fill(0);
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

        return bands;
    }
}

