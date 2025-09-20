import CONFIG from "./config.js";

export default class WordManager {
    constructor(c) {
        this.canvas = c;
        this.wordPhase = 0;
        this.wordTimer = 0;
        this.wordTargets = [];
        this.currentWord = 0;
    }
    update(particleManager) {
        // Word lifecycle
        this.wordTimer++;
        if (this.wordPhase === 0 && this.wordTimer > CONFIG.FREE_TIME) {
            this.assignWordTargets(CONFIG.WORDS[this.currentWord], particleManager);
            this.wordPhase = 1; this.wordTimer = 0;
        } else if (this.wordPhase === 1 && this.wordTimer > CONFIG.FORM_STEPS) {
            this.wordPhase = 2; this.wordTimer = 0;
        } else if (this.wordPhase === 2 && this.wordTimer > CONFIG.HOLD_STEPS) {
            particleManager.releaseParticles();
            this.wordPhase = 3; this.wordTimer = 0;
        } else if (this.wordPhase === 3 && this.wordTimer > CONFIG.DISPERSAL_STEPS) {
            this.currentWord = (this.currentWord + 1) % CONFIG.WORDS.length;
            this.wordPhase = 0; this.wordTimer = 0;
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
        octx.font = CONFIG.FONT;
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
        const sampleSize = Math.min(CONFIG.WORD_PARTICLE_COUNT, targets.length);

        // Random center position within WORD_AREA
        const centerX = CONFIG.WORD_AREA.MIN_X + Math.random() * (CONFIG.WORD_AREA.MAX_X - CONFIG.WORD_AREA.MIN_X);
        const centerY = CONFIG.WORD_AREA.MIN_Y + Math.random() * (CONFIG.WORD_AREA.MAX_Y - CONFIG.WORD_AREA.MIN_Y);

        const wordTargets = [];
        for (let i = 0; i < sampleSize; i++) {
            const t = targets[Math.floor(Math.random() * targets.length)];
            wordTargets.push({
                x: t.x - this.canvas.width/2 + centerX,
                y: t.y - this.canvas.height/2 + centerY
            });
        }

        // assign particles
        const chosen = [];
        while (chosen.length < sampleSize) {
            const p = particleManager.particles[Math.floor(Math.random() * particleManager.particles.length)];
            if ( ! p.inWord ) {
                p.inWord = true;
                p.tx = wordTargets[chosen.length].x;
                p.ty = wordTargets[chosen.length].y;
                chosen.push(p);
            }
        }    
    }
}
