export default class Audio {
    constructor(cfg) {
        this.cfg = cfg;    
        this.started = false;
        this.audioCtx = null;
        this.osc = null;
        this.level = null;
    }
    start() {
        if ( this.started ) return;

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        this.osc = this.audioCtx.createOscillator();
        this.level = this.audioCtx.createGain();

        this.osc.type = this.cfg.waveform;
        this.level.gain.value = 0.05;

        this.osc.connect(this.level).connect(this.audioCtx.destination);
        this.osc.start();

        this.started = true;
    }
    setFreq(f) {
        this.osc.frequency.setTargetAtTime(f, this.audioCtx.currentTime, 0.01);
    }
    setGain(g) {
        this.level.gain.setTargetAtTime(g, this.audioCtx.currentTime, 0.01);
    }
    update(wf) {
        if ( false === this.started ) return; //console.log(this.osc.type , wf);
        if ( this.osc.type !== wf )
            this.osc.type = wf;
    }
}