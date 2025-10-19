export default class AudioCollector {
    constructor(audio) {
        this.audio = audio;
        this.ctx = new AudioContext();
        this.analyser = this.ctx.createAnalyser();
        this.dataArray = null;
        this.source = null;
    }
    async init() {
        // ensure context is resumed only after user gesture
        await this.ctx.resume();

        this.source = this.ctx.createMediaElementSource(this.audio);
        this.analyser.fftSize = 256;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        this.source.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
    }
    fetchData() {
        this.analyser.getByteFrequencyData(this.dataArray);
        return { frequencies: [...this.dataArray] };
    }
}
