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

    // Compute delay for char i
    delayForIndex(i) {
        const t = i / this.totalChars;          // normalized 0..1
        const eased = this.ease(t);
        return this.baseDuration * (1 - eased/2); // start slower, speed up
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
    run2(dt, elapsedTime) {
        // Initialize start time on first frame
        if ( this.startTime === null ) {
            this.startTime = elapsedTime;
        }
        // Stop when done
        if ( this.currentIndex >= this.totalChars ) {
            return;
        }
        // Time passed since start of this char
        const elapsedForChar = elapsedTime - this.startTime;
        // Has enough time passed to show the next underline?
        if ( elapsedForChar >= this.baseDuration ) {
            // Draw underline for current index
            const rect = this.getCharRect(this.currentIndex);
            this.drawUnderline(rect);
            // Advance to next character
            this.currentIndex++;
            // Reset the timer for the next underline
            this.startTime = elapsedTime;
        }
    }
    run3(dt, elapsedTime) {
        // Initialize start time on first frame
        if (this.startTime === null) {
            this.startTime = elapsedTime;
        }

        // Stop when done
        if (this.currentIndex >= this.totalChars) {
            return;
        }

        // Total time allowed for this character including linger
        const totalTimeForChar = this.baseDuration + this.linger;

        // How long since this character became active
        const elapsedForChar = elapsedTime - this.startTime;

        // Always draw underline during the entire active window
        if (elapsedForChar <= totalTimeForChar) {
            const rect = this.getCharRect(this.currentIndex);
            this.drawUnderline(rect);
        }

        // Move to next character only after baseDuration + linger
        if (elapsedForChar >= totalTimeForChar) {
            this.currentIndex++;
            this.startTime = elapsedTime; // reset timer for next one
        }
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
        this.drawUnderline(rect);

        this.currentIndex++;
        this.lastUnderlineTime = elapsedTime; // for linger
    }

    // Linger: keep last underline visible
    if (this.currentIndex > 0 && this.currentIndex <= this.totalChars) {
        const lastRect = this.getCharRect(this.currentIndex - 1);
        this.drawUnderline(lastRect);
    }
}
    
    run1(dt, elapsedTime) {
        //this.wait += 60;
        if (this.startTime === null) this.startTime = elapsedTime;

        // Check if we should start a new underline
        if (this.currentIndex < this.totalChars) {
            const elapsed = elapsedTime - this.startTime;
            console.log(elapsed, elapsedTime, this.startTime, this.baseDuration, Math.random());
            const nextCharTime = this.activeUnderlines.reduce((sum, u) => sum + u.duration, 0);

            if (elapsed >= nextCharTime) {
                // Start underline for current char
                const rect = this.getCharRect(this.currentIndex);
                const duration = this.delayForIndex(this.currentIndex);
                this.activeUnderlines.push({
                    ...rect,
                    startTime: elapsedTime,
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
        this.activeUnderlines = this.activeUnderlines.filter(u => elapsedTime - u.startTime < u.duration);

        // Returns true if animation is done
        //return this.currentIndex >= this.totalChars && this.activeUnderlines.length === 0;
    }
}
