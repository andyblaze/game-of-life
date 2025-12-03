import Animation from "./animation.js";
import LayoutRegistry from "./layout-registry.js";
import EventContext from "./event-context.js";

export default class Underliner extends Animation {
    static type = "underliner";
    constructor(cnvs, data=null, cfg={}) {
        super(cnvs);
        // Get plaintext string and array
        this.layout = LayoutRegistry.layoutFor("plaintext");
        const evt = EventContext.byId("encrypt", "plaintext"); 
        //console.log(this.layout, data);
        //this.plaintext = event.string;
        this.tokens = evt.data.array;


        // Animation state
        this.activeUnderlines = [];     // array of {x, y, w, startTime, duration}
        this.currentIndex = 0;          // index of char currently underlining
        this.charPositions = [];   // x positions
        this.startTime = null;          // absolute time when animation started
        this.linger = cfg.linger; // milliseconds to keep the underline active
        this.totalChars = this.tokens.length;
        this.charWidth = Math.floor(this.ctx.measureText("M").width);
        this.baseDuration = cfg.duration;   // base duration per char in ms
        this.computeCharPositions();
        //this.wait = cfg.wait;
    }
    computeCharPositions() {
        //this.charPositions = [];   // x positions
        let x = this.layout.x;
        for ( let i = 0; i < this.tokens.length; i++ ) {
            const w = this.ctx.measureText(this.tokens[i]).width;
            this.charPositions.push({ x, w });
            x += w;
        }
    }
    // Simple ease-in-out function (0 → 1)
    ease(t) {
        // Accelerates without a super-slow start
        return t * (1 + 2.5 * t);
        //return t * t * t;
        // cubic ease-in-out
        //return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;
    }
    // Compute char rectangle
    getCharRect(i) {
        const p = this.charPositions[i];
        return {
            x: p.x,
            y: this.layout.y + this.layout.h,
            w: p.w,
            h: 2
        };
    }
    drawUnderline(rect) {
        //console.log(rect.w, rect.x, this.currentIndex);
        this.ctx.save();
        //this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = "yellow";
        this.ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
        this.ctx.restore();
    } 
    onUnderline(idx) {
        
    }
    advanceIndex(rect) {
        // draw the underline
        this.drawUnderline(rect);
        // fire callback
        this.onUnderline(this.currentIndex);
        this.currentIndex++;
    }
    run(dt, elapsedTime) {
        // First frame: capture absolute start time
        if (this.startTime === null) {
            this.startTime = elapsedTime;
        }
        // No more work if finished
        if (this.currentIndex >= this.totalChars) {
            return;
        }
        // How long since this specific underliner started?
        const totalElapsed = elapsedTime - this.startTime;
        // One full pass duration (without linger)
        const totalDuration = this.baseDuration * this.totalChars;
        // Clamp progress
        const rawT = Math.min(totalElapsed / totalDuration, 1);
        // Apply easing curve
        const easedT = this.ease(rawT);
        // How many chars *should* be underlined at this eased progress?
        const targetIndex = Math.floor(easedT * this.totalChars);
        // Advance underline until we've caught up
        while (this.currentIndex < targetIndex) {
            const rect = this.getCharRect(this.currentIndex);
            this.advanceIndex(rect);
            this.lastUnderlineTime = elapsedTime; // for linger
        }
        // Linger: keep last underline visible
        if (this.currentIndex > 0 && this.currentIndex <= this.totalChars) {
            const lastRect = this.getCharRect(this.currentIndex - 1);
            this.drawUnderline(lastRect);
        }
    }
}
