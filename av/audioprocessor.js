export default class AudioProcessor {
    transform({ frequencies }) {
        const bands = [0, 1, 2].map(i => {
            const start = i * 170;
            const end = start + 170;
            const slice = frequencies.slice(start, end);
            const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
            return avg / 255;
        });
        return { bass: bands[0], mid: bands[1], treble: bands[2] };
    }
}