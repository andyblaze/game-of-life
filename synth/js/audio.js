export default class Audio {
    constructor(cfg) {
        this.cfg = cfg;    
        this.started = false;
        this.audioCtx = null;

        this.osc = null;
        this.osc2 = null;

        this.level = null;
        this.filter = null;

        this.detuneHz = cfg.detune;

        // tremolo nodes
        this.tremoloOsc = null;
        this.tremoloGain = null;
    }

    start() {
        if (this.started) return;

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // Filter
        this.filter = this.audioCtx.createBiquadFilter();
        this.filter.type = "lowpass";
        this.filter.Q.value = 10;
        this.filter.frequency.value = 100;

        // Oscillators
        this.osc = this.audioCtx.createOscillator();
        this.osc2 = this.audioCtx.createOscillator();

        this.osc.type = this.cfg.waveform;
        this.osc2.type = this.cfg.waveform;

        // Main level
        this.level = this.audioCtx.createGain();
        this.level.gain.value = 0.04;

        // Tremolo setup
        this.tremoloOsc = this.audioCtx.createOscillator();
        this.tremoloGain = this.audioCtx.createGain();

        this.tremoloOsc.type = "sine";
        this.tremoloGain.gain.value = 0; // start at 0 depth

        // Connect tremolo
        this.tremoloOsc.connect(this.tremoloGain);
        this.tremoloGain.connect(this.level.gain);

        this.tremoloOsc.start();

        // Connect main oscillators through filter → level
        this.osc.connect(this.filter);
        this.osc2.connect(this.filter);
        this.filter.connect(this.level);

        // Finally connect level → destination
        this.level.connect(this.audioCtx.destination);

        this.osc.start();
        this.osc2.start();

        this.started = true;
    }

    setFreq(f) {
        if (!this.started) return;

        const now = this.audioCtx.currentTime;

        this.osc.frequency.setTargetAtTime(f, now, 0.01);
        this.osc2.frequency.setTargetAtTime(f + this.detuneHz, now, 0.01);
    }

    setGain(g) {
        if (!this.started) return;
        this.level.gain.setTargetAtTime(g, this.audioCtx.currentTime, 0.01);
    }

    update(cfg) {
        if (!this.started) return;

        // Detune
        this.detuneHz = cfg.detune;
        this.osc2.frequency.setTargetAtTime(this.osc.frequency.value + this.detuneHz, this.audioCtx.currentTime, 0.01);

        // Filter
        this.filter.frequency.setTargetAtTime(cfg.cutoff, this.audioCtx.currentTime, 0.01);

        // Waveform
        if (this.osc.type !== cfg.waveform) {
            this.osc.type = cfg.waveform;
            this.osc2.type = cfg.waveform;
        }

        // Tremolo
        // Depth: 0 → 1, maps to gain swing
        this.tremoloGain.gain.setTargetAtTime(cfg.tremoloDepth, this.audioCtx.currentTime, 0.01);

        // Rate: LFO frequency in Hz
        this.tremoloOsc.frequency.setTargetAtTime(cfg.tremoloRate, this.audioCtx.currentTime, 0.01);
    }
}