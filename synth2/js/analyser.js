export default class Analyser {
    constructor(audioAnalyserNode) {
        this.node = audioAnalyserNode;
        this.bufferLength = this.node.fftSize;
        this.data = new Uint8Array(this.bufferLength);
    }

    getTimeDomainData() {
        this.node.getByteTimeDomainData(this.data);
        return this.data;
    }
}
