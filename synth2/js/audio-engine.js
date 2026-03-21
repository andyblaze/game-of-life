import { ucFirst } from "./functions.js";

export default class AudioEngine {
    constructor(tc) {
        this.converter = tc;
        this.ctx = null;

        this.osc = null;
        this.gain = null;

        // LFO (for tremolo)
        this.lfo = null;
        this.lfoGain = null;

        this.analyser = null;

        this.started = false;
    }

    start() {
        if (this.started) return;

        this.ctx = new (window.AudioContext || window.webkitAudioContext)();

        // --- main oscillator ---
        this.osc = this.ctx.createOscillator();
        this.osc.type = "sine";
        this.osc.frequency.value = 440;

        // --- gain ---
        this.gain = this.ctx.createGain();
        this.gain.gain.value = 0.1;

        // --- LFO (tremolo) ---
        this.lfo = this.ctx.createOscillator();
        this.lfo.type = "sine";
        this.lfo.frequency.value = 4; // Hz

        this.lfoGain = this.ctx.createGain();
        this.lfoGain.gain.value = 0.1; // depth (start off)

        // connect LFO → gain.gain
        this.lfo.connect(this.lfoGain);
        this.lfoGain.connect(this.gain.gain);

        // --- analyser ---
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 1024;

        // --- wiring ---
        this.osc.connect(this.gain);
        this.gain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);

        this.osc.start();
        this.lfo.start();

        this.started = true;
    }
    update(ctrls) { 
        for ( const ctrl of ctrls ) {
            const prop = ctrl.dataset.property ?? "";
            if (!prop) continue;
            const func = "set" + ucFirst(prop);

            if (typeof this[func] !== "function") {
                console.warn(`No method ${func} for control`, ctrl);
                continue;
            }

            const type = ctrl.dataset.type;
            const val = this.converter.apply(type, ctrl, ctrl.value);

            this[func](val);
        }
    }

    setOsc(f) {
        if (!this.started) return;
        this.osc.frequency.setTargetAtTime(f, this.ctx.currentTime, 0.01);
    }

    setVolume(v) {
        if (!this.started) return;
        this.gain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.01);
    }

    setLfoRate(r) {
        if (!this.started) return;
        this.lfo.frequency.setTargetAtTime(r, this.ctx.currentTime, 0.01);
    }

    setLfoDepth(d) {
        if (!this.started) return;
        this.lfoGain.gain.setTargetAtTime(d, this.ctx.currentTime, 0.01);
    }

    getAnalyser() {
        return this.analyser;
    }
}
