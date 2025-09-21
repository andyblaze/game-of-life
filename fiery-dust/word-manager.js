import CONFIG from "./config.js";
import { randomFrom } from "./functions.js";

export default class WordManager {
    constructor(c, pm, config) {
        this.canvas = c;
        this.particleManager = pm;
        this.config = config;
        this.wordPhase = "FREE";
        this.wordTimer = 0;
        this.wordTargets = [];
        this.currentWord = 0;
        this.states = {
            "FREE": {
                duration: config.FREE_TIME,
                onEnter: () => this.assignWordTargets(config.WORDS[this.currentWord], this.particleManager),
                next: "FORMING"
            },
            "FORMING": {
                duration: config.FORM_STEPS,
                onEnter: () => {},
                next: "HOLDING"
            },
            "HOLDING": {
                duration: config.HOLD_STEPS,
                onEnter: () => this.particleManager.releaseParticles(),
                next: "DISPERSING"
            },
            "DISPERSING": {
                duration: config.DISPERSAL_STEPS,
                onEnter: () => {
                    this.currentWord = (this.currentWord + 1) % config.WORDS.length;
                },
                next: "FREE"
            }
        };
    }
    update() {
        this.wordTimer++;

        const state = this.states[this.wordPhase];
        if ( this.wordTimer > state.duration ) {
            this.wordPhase = state.next;
            this.wordTimer = 0;
            this.states[this.wordPhase].onEnter();
        }
    }
    createWordTargets(text) {
        const off = document.createElement("canvas");
        const octx = off.getContext("2d");
        off.width = this.canvas.width;
        off.height = this.canvas.height;
        octx.fillStyle = "black";
        octx.textAlign = "center";
        octx.textBaseline = "middle";
        octx.font = this.config.FONT;
        octx.fillText(text, off.width/2, off.height/2);

        const data = octx.getImageData(0, 0, off.width, off.height);
        const pts = [];
        for (let y = 0; y < off.height; y += 4) {
            for (let x = 0; x < off.width; x += 4) {
                const idx = (y * off.width + x) * 4;
                if (data.data[idx+3] > 128) pts.push({x,y});
            }
        }
        return pts;
    }
    assignWordTargets(text, particleManager) {
        const targets = this.createWordTargets(text);
        const sampleSize = Math.min(this.config.PARTICLE_COUNT, targets.length);
        const wordArea = randomFrom(this.config.AREAS);

        // Random center position within WORD_AREA
        const centerX = wordArea.MIN_X + Math.random() * (wordArea.MAX_X - wordArea.MIN_X);
        const centerY = wordArea.MIN_Y + Math.random() * (wordArea.MAX_Y - wordArea.MIN_Y);

        const wordTargets = [];
        for (let i = 0; i < sampleSize; i++) {
            const t = randomFrom(targets);
            wordTargets.push({
                x: t.x - this.canvas.width/2 + centerX,
                y: t.y - this.canvas.height/2 + centerY
            });
        }

        // assign particles
        const chosen = [];
        while (chosen.length < sampleSize) {
            const p = randomFrom(particleManager.particles);
            if ( ! p.inWord ) {
                p.inWord = true;
                p.tx = wordTargets[chosen.length].x;
                p.ty = wordTargets[chosen.length].y;
                chosen.push(p);
            }
        }    
    }
}
