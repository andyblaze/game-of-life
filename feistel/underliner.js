import Animation from "./animation.js";
import LayoutRegistry from "./layout-registry.js";
import EventContext from "./event-context.js";

export default class Underliner extends Animation {
    static type = "underliner";
    constructor(cnvs, data=null, cfg={}) {
        super(cnvs);
        this.layout = LayoutRegistry.layoutFor(cfg.type);
        const evt = EventContext.byId(cfg.direction, cfg.type); 
        this.tokens = evt.data.array;
        // Animation state
        this.currentIndex = 0;          // index of char currently underlining
        this.activeIndex = null;
        this.charPositions = [];   // x positions
        this.startTime = null;          // absolute time when animation started
        this.stepTime = cfg.stepTime;   // base step time between underline per char in ms
        this.holdTime = cfg.holdTime ?? 0; // milliseconds to keep the underline active
        this.manualHoldTime = 0;
        this.manualIndex = null;
        this.manualIndexTracker = 0;
        this.totalChars = this.tokens.length;
        this.timeSinceUnderline = 0;
        this.timeSinceStep = 0;
        this.computeCharPositions();
    }
    computeCharPositions() {
        let x = this.layout.x;
        for ( let i = 0; i < this.tokens.length; i++ ) {
            const w = this.ctx.measureText(this.tokens[i]).width;
            this.charPositions.push({ x, w });
            x += w;
        }
    }
    ease(t) {
        // Accelerates without a super-slow start
        return t * (1 + 2.5 * t);
    }
    getCharRect(i) {
        const p = this.charPositions[i];
        return {
            x: p.x,
            y: this.layout.y + this.layout.h,
            w: p.w,
            h: 2
        };
    }
    tick(dt) {
        if ( this.manualHoldTime > 0 && this.manualIndex !== null) {
            this.manualHoldTime -= dt;
            const rect = this.getCharRect(this.manualIndex);
            this.drawUnderline(rect);
            if ( this.manualHoldTime <= 0 ) {
                this.manualHoldTime = 0;
                this.manualIndex = null;
            }
        }
    }
    underlineAt(token=null, idx=null) {
        this.manualHoldTime = this.holdTime;
        this.manualIndex = (null === idx ? this.tokens.indexOf(token) : idx);
        this.manualIndexTracker += 1;
        this.animationDone = (this.manualIndexTracker >= this.totalChars);
        this.onUnderline(this.tokens[this.manualIndex], this.manualIndex);
    }
    drawUnderline(rect) {
        this.ctx.save();
        this.ctx.fillStyle = "yellow";
        this.ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
        this.ctx.restore();
    } 
    drawLingeringLine(idx) {
        const rect = this.getCharRect(idx);
        this.drawUnderline(rect);        
    }
    handleLinger(elapsedTime) {
        if ( this.holdTime > 0 ) {
            // How long since last underline was drawn?
            const since = elapsedTime - (this.lastUnderlineTime ?? 0);
            if ( since < this.holdTime ) {
                const lastIdx = Math.min(this.currentIndex - 1, this.totalChars - 1);
                // Re-draw the final underline during linger
                if (lastIdx >= 0) this.drawLingeringLine(lastIdx);
            }
        }    
    }
    onUnderline(token, idx) {}
    advanceIndex(rect) {
        this.drawUnderline(rect);
        // fire callback
        this.onUnderline(this.tokens[this.currentIndex], this.currentIndex);
        this.currentIndex++;
    }
    startUnderline(index) {
        this.activeIndex = index;
        this.timeSinceUnderline = 0;
    }
    doStep() {
        const rect = this.getCharRect(this.currentIndex);
        this.advanceIndex(rect);
        this.startUnderline(this.currentIndex - 1);
    }
    run(dt, elapsedTime) {
        // update timers
        this.timeSinceStep += dt;
        this.timeSinceUnderline += dt;
        // trigger timed stepping
        if (this.timeSinceStep >= this.stepTime && this.currentIndex < this.totalChars) {
            this.timeSinceStep -= this.stepTime;
            this.doStep();
        }
        // draw underline (timed or reactive)
        if (this.timeSinceUnderline < this.holdTime && this.activeIndex != null) {
            this.drawLingeringLine(this.activeIndex);
        }
        this.animationDone = (this.currentIndex >= this.totalChars);
        if ( true === this.animationDone )
            this.onComplete();
    }
}
