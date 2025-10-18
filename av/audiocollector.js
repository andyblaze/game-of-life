export default class AudioCollector {
    constructor() {
        this.audioCtx = new AudioContext();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 1024;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    }
    async init() {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = this.audioCtx.createMediaStreamSource(stream);
        source.connect(this.analyser);
    }
    fetchData() {
        this.analyser.getByteFrequencyData(this.dataArray);
        return { frequencies: [...this.dataArray] }; // fits your data flow
    }
}