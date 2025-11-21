
class ExcitationStrategy {
    update(dt, df) {} // called every frame. dt is delta, df is Dreamflow object
}

export default class RandomExcite extends ExcitationStrategy {
    constructor(config) { 
        super(); 
        this.cfg = config;
        this.accumExc = 0;
    }
    update(dt, df) { 
        const pulses = this.cfg.excitationRate * dt * 0.01;
        this.accumExc += pulses;
        while (this.accumExc >= 1) {
            this.accumExc -= 1;
            const x = Math.random() * this.cfg.W;
            const y = Math.random() * this.cfg.H;
            df.exciteAt(x, y, Math.random() * 10 + 4, Math.random() * 1.1 + 0.4);
        }
    }
}