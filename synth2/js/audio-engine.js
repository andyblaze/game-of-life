//import { ucFirst } from "./functions.js";

export default class AudioEngine {
    constructor(cfg) {
        this.cfg = cfg.controlsData;    // inelegant but ok
        this.started = false;
        this.audioCtx = null;

        this.osc = null;
        this.lfo = null;

        this.level = null;
        this.filter = null;

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
        this.lfo = this.audioCtx.createOscillator();

        this.osc.type = this.cfg.waveform;
        this.lfo.type = this.cfg.waveform;

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
        //this.lfo.connect(this.filter);  remove lfo from sound
        this.filter.connect(this.level);

        // Finally connect level → destination
        //this.level.connect(this.audioCtx.destination); remove this too - so there aren't 2 sound -> out
        
        // --- analyser ---
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 1024;
        this.level.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);

        this.osc.start();
        this.lfo.start();

        this.started = true;
    }
    getAnalyser() {
        return this.analyser;
    }
    update() { // gets ui ctrls passed in, never uses it.  i can live with this
        if (!this.started) return;

        const now = this.audioCtx.currentTime;

        this.lfo.frequency.setTargetAtTime(this.cfg.lfo, now, 0.01);
        this.osc.frequency.setTargetAtTime(this.cfg.osc, now, 0.01);

        // Filter
        this.filter.frequency.setTargetAtTime(this.cfg.cutoff, now, 0.01);

        // Waveform
        if (this.osc.type !== this.cfg.waveform) {
            this.osc.type = this.cfg.waveform;
            //this.lfo.type = this.cfg.waveform;
        } 

        // Tremolo
        // Depth: 0 → 1, maps to gain swing
        this.tremoloGain.gain.setTargetAtTime(this.cfg.tremoloDepth, now, 0.01);

        // Rate: LFO frequency in Hz
        this.tremoloOsc.frequency.setTargetAtTime(this.cfg.tremoloRate, now, 0.01);
    }
}
