import Animation from "./animation.js";
import LayoutRegistry from "./layout-registry.js";
import EventContext from "./event-context.js";

export default class Underliner extends Animation {
    static type = "underliner";
    constructor(cnvs, data=null, cfg={}) {
        super(cnvs);
        // Get plaintext string and array
        this.layout = LayoutRegistry.layoutFor(cfg.type);
        const evt = EventContext.byId(cfg.direction, cfg.type); 
        //console.log(this.layout, data);
        //this.plaintext = event.string;
        this.tokens = evt.data.array;


        // Animation state
        this.currentIndex = 0;          // index of char currently underlining
        this.activeIndex = null;
        this.charPositions = [];   // x positions
        this.startTime = null;          // absolute time when animation started
        this.holdTime = cfg.holdTime ?? 0; // milliseconds to keep the underline active
        this.manualHoldTime = 0;
        this.manualIndex = null;
        this.manualIndexTracker = 0;
        this.totalChars = this.tokens.length;
        this.stepTime = cfg.stepTime;   // base step time between underline per char in ms
        this.timeSinceLastStep = 0;
        this.timeSinceUnderline = 0;
        this.timeSinceStep = 0;
        this.totalElapsed = 0;
        this.triggerStepTime = 0;
        this.triggerHoldTime = 0;
        this.underlining = false;
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
        this.done = (this.manualIndexTracker >= this.totalChars);
        //this.startUnderline(index);
       // const rect = this.getCharRect(index);
        //this.drawUnderline(rect);
        this.onUnderline(this.tokens[this.manualIndex], this.manualIndex);
    }
    drawUnderline(rect) {
        //console.log(rect.w, rect.x, this.currentIndex);
        this.ctx.save();
        //this.ctx.globalAlpha = alpha;
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
        // draw the underline
        this.drawUnderline(rect);
        // fire callback
        this.onUnderline(this.tokens[this.currentIndex], this.currentIndex);
        this.currentIndex++;
    }
    triggerUnderline(dt) {
        this.triggerStepTime += dt;
        //console.log(dt, this.totalElapsed, this.timeSinceLastStep, this.stepTime, this.timeSinceUnderline);
        //this.timeSinceLastStep += this.totalElapsed;
        const trigger = (this.triggerStepTime >= this.stepTime);
        if ( trigger ) {
            //this.timeSinceLastStep -= this.stepTime;
            //this.timeSinceUnderline = 0;
            this.triggerStepTime -= this.stepTime;
        }
        return trigger;
    }
    triggerHold(dt) {
        this.triggerHoldTime += dt;
        const trigger = (this.triggerHoldTime >= this.holdTime); ///console.log(trigger);
        if ( trigger ) {
            //this.timeSinceLastStep -= this.stepTime;
            //this.timeSinceUnderline = 0;
            //this.triggerHoldTime = 0;//-= this.holdTime;
        }
        return trigger;
    }
    startUnderline(index) {
        this.activeIndex = index;
        this.timeSinceUnderline = 0;
    }
    doStep() {
        const rect = this.getCharRect(this.currentIndex);
        this.advanceIndex(rect);
        this.startUnderline(this.currentIndex - 1); // underline the stepped char
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
        this.done = (this.currentIndex >= this.totalChars);
        if ( true === this.done )
            this.onComplete();
    }
    run11(dt, elapsedTime) {
        // First frame: capture absolute start time
        if (this.startTime === null) {
            this.startTime = elapsedTime;
        }
        const finished = this.currentIndex >= this.totalChars;
        if ( finished ) {
            // hold logic
            return;
        }
        const et = elapsedTime - this.startTime;
        const rect = this.getCharRect(this.currentIndex);
        if ( this.triggerUnderline(dt) ) {            
            this.advanceIndex(rect);
            //this.totalElapsed = 0;
        }
        if ( this.triggerHold(dt) ) {
            //const rect = this.getCharRect(this.currentIndex);
            this.drawUnderline(rect);
            //this.totalElapsed = 0;
        }
    }
    run1(dt, elapsedTime) {
        
        // First frame: capture absolute start time
        if (this.startTime === null) {
            this.startTime = elapsedTime;
        }
        const finished = this.currentIndex >= this.totalChars;
        // ---- LINGER HANDLING ----
        if ( finished ) {
            this.handleLinger(elapsedTime);
            return;  // No progress once finished (only lingering)
        }
        // How long since underliner started?
        const totalElapsed = elapsedTime - this.startTime;
        console.log(totalElapsed);
        // One full pass duration (without linger)
        const totalDuration = this.baseStepTime * this.totalChars;
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
        // Linger even while animating (keeps last underline visible)
        if (this.currentIndex > 0 && this.currentIndex <= this.totalChars) {
            this.drawLingeringLine(this.currentIndex - 1);
        }
    }
}
