import Animation from "./animation.js";
import LayoutRegistry from "./layout-registry.js";
import EventContext from "./event-context.js";

export default class Underliner extends Animation {
    static type = "underliner";
    constructor(cnvs, data=null, cfg={}) {
        super(cnvs);
        // Get plaintext string and array
        this.layout = LayoutRegistry.layoutFor("plaintext");
        data = EventContext.getEvent("encrypt", 2).data; 
        console.log(this.layout, data);
        //this.plaintext = event.string;
        this.tokens = data.array;


        // Animation state
        this.currentIndex = 0;          // index of char currently underlining
        this.activeUnderlines = [];     // array of {x, y, w, startTime, duration}
        this.startTime = null;          // absolute time when animation started
        this.totalChars = this.tokens.length;
        this.charWidth = Math.floor(this.layout.w / this.totalChars);

        this.baseDuration = cfg.duration;   // base duration per char in seconds
        this.wait = cfg.wait;
    }

    // Simple ease-in-out function (0 → 1)
    ease(t) {
        // cubic ease-in-out
        return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;
    }

    // Compute delay for char i
    delayForIndex(i) {
        const t = i / this.totalChars;          // normalized 0..1
        const eased = this.ease(t);
        return this.baseDuration * (1 - eased/2); // start slower, speed up
    }

    // Compute char rectangle
    getCharRect(i) {
        return {
            x: this.layout.x + i * this.charWidth,
            y: this.layout.y + this.layout.h,   // just below text
            w: this.charWidth,
            h: 2  // underline thickness
        };
    }

    run(dt) { console.log(9);
        //this.wait += 60;
        if (this.startTime === null) this.startTime = dt;

        // Check if we should start a new underline
        if (this.currentIndex < this.totalChars) {
            const elapsed = dt - this.startTime;
            const nextCharTime = this.activeUnderlines
                .reduce((sum, u) => sum + u.duration, 0);

            if (elapsed >= nextCharTime) {
                // Start underline for current char
                const rect = this.getCharRect(this.currentIndex);
                const duration = this.delayForIndex(this.currentIndex);
                this.activeUnderlines.push({
                    ...rect,
                    startTime: dt,
                    duration
                });
                this.currentIndex++;
            }
        }

        // Draw all active underlines
        for (let i = 0; i < this.activeUnderlines.length; i++) {
            const u = this.activeUnderlines[i];
            //const alpha = Math.min(1, (dt - u.startTime) / u.duration);
            this.ctx.save();
            //this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = "yellow";
            this.ctx.fillRect(u.x, u.y, u.w, u.h);
            this.ctx.restore();
        }

        // Remove finished underlines
        this.activeUnderlines = this.activeUnderlines.filter(u => dt - u.startTime < u.duration);

        // Returns true if animation is done
        //return this.currentIndex >= this.totalChars && this.activeUnderlines.length === 0;
    }
}
