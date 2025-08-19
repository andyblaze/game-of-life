import { mt_rand } from "./functions.js";

export class MainEffects {
    static applyTo(drop) {
        this.swapHead(drop.chars, drop.alphas);
        this.swapChars(drop.chars, drop.alphas);
        this.flipChars(drop.chars);
        this.flashChar(drop);
    }
    static swapHead(chars, alphas) { charSwapper.swapHead(chars, alphas); }
    static swapChars(chars, alphas) { charSwapper.swapChars(chars, alphas); }
    static flipChars(chars) { charFlipper.flip(chars); }
    static flashChar(drop) { charLighter.run(drop, 60); }
}

export class GhostEffects {
    static applyTo(drop) {
        this.upAlpha(drop.alphas);
        this.downAlpha(drop.alphas);
    }
    static upAlpha(alphas) { charAlpha.up(alphas); }
    static downAlpha(alphas) { charAlpha.down(alphas); }
}
class charAlpha {
    static up(alphas) {
        if ( Math.random() < 0.01 ) { // 1% chance per frame
            const idx = mt_rand(0, alphas.length -1);
            alphas[idx] = 1;
        }
    }
    static down(alphas) {
        if ( Math.random() < 0.1 ) { // 10% chance per frame
            const idx = mt_rand(0, alphas.length -1);
            alphas[idx] = 0.4;
        }
    }
}
class charFlipper {
    static flip(chars) {
        if ( Math.random() < 0.001 ) { 
            chars.reverse();
        }
    }
}

class charSwapper {    
    static doSwap(chars, idx1, idx2, alphas=false) {
        let tmp = chars[idx1];
        chars[idx1] = chars[idx2];
        chars[idx2] = tmp;
        
        if ( alphas === false ) return;
        tmp = alphas[idx1];
        alphas[idx1] = alphas[idx2];
        alphas[idx2] = tmp;
    }
    static swapHead(chars, alphas) {
        if ( Math.random() < 0.03 ) {
            this.doSwap(chars, 0, 1, alphas);
        }            
    }
    static swapChars(chars, alphas) {
        if ( Math.random() < 0.05 ) { // 5% chance per frame
            const idx1 = mt_rand(3, chars.length -1);
            const idx2 = mt_rand(3, chars.length -1);
            if ( idx1 === idx2 ) return;
            const param = Math.random() < 0.05 ? alphas : false;
            this.doSwap(chars, idx1, idx2, param);
        }            
    }
}

class EffectState {
    static enter(context, ...args) {}
    static update(context, drop, duration) {}
    static exit(context) {}
}
class IdleState extends EffectState {
    static update(context, drop, duration) {
        if ( Math.random() < 0.5 && drop && !drop.isOffscreen() ) {
            context.transition(ActiveState, drop, duration);
        }
    }
}
class ActiveState extends EffectState {
    static enter(context, drop, duration) {
        context.drop = drop;
        context.flashFramesLeft = duration * duration; // * duration is 60 if we're at 60fps.  tweak if needed
        context.flashIndex = mt_rand(3, drop.chars.length - 1);
        context.originalAlpha = drop.alphas[context.flashIndex];
        drop.alphas[context.flashIndex] = 1;
    }
    static update(context) {
        if ( !context.drop || context.drop.isOffscreen() ) {
            context.transition(IdleState);
            return;
        }
        context.flashFramesLeft--;
        if (context.flashFramesLeft <= 0) { 
            context.transition(IdleState);
        } else {
            context.drop.alphas[context.flashIndex] = 1;
        }
    }
    static exit(context) {
        if ( context.drop ) {
            context.drop.alphas[context.flashIndex] = context.originalAlpha;
        }
        context.drop = null;
        context.flashIndex = 0;
        context.originalAlpha = 0;
        context.flashFramesLeft = 0;
    }
}
class charLighter {
    static state = IdleState;
    // Spotlight effect states
    static flashIndex = 0;     // index of the char being lit
    static flashFramesLeft = 0;   // countdown until it stops  
    static originalAlpha = 0;
    static drop = null;
    static nums = {stt:0, run:0, stp:0, rst:0};
    
    static run(drop, duration) {
        this.state.update(this, drop, duration);
    }
    static transition(newState, ...args) {
        this.state.exit(this);
        this.state = newState;
        this.state.enter(this, ...args);
    } 
    static reset() {
        this.flashIndex = 0;
        this.originalAlpha = 0;
        this.started = false;
        this.flashFramesLeft = 0;
        this.clog("reset");
    }
    static clog(method) {
        if ( this.flashFramesLeft === 0 || this.flashFramesLeft === 60 ) {
            this.nums[method]++;
            const d = new Date();
            const n = d.toLocaleTimeString();
            const alpha = (this.drop === null ? "expired" : this.drop.alphas[this.flashIndex]);
            const id = (this.drop === null ? "expired" : this.drop.id);
            console.log(method, "frame", id, this.flashFramesLeft, "alpha =", alpha, "time=", n, "nums=", this.nums);
        }
    }
    static start(drop, duration) {    
        this.flashFramesLeft = duration;
        this.setDrop(drop);
        this.started = true;
        this.flashIndex = mt_rand(0, this.drop.chars.length -1);
        this.originalAlpha = this.drop.alphas[this.flashIndex];
        this.drop.alphas[this.flashIndex] = 1;  // set to full brightness
        this.clog("start");
    }
    /*static validDrop() { //console.log(typeof this.drop);//, (! this.drop.isOffscreen()));
        return ((this.drop !== null) && (typeof this.drop === "object") && (! this.drop.isOffscreen()));
    }*/
    static stop() {
        if ( this.started === false ) return;
        // Restore original alpha when done
        this.drop.alphas[this.flashIndex] = this.originalAlpha;
        this.setDrop(null);
        this.clog("stop");
    }
}



export class GlowingChar {
    static layers = 11;
    static layerAlphas = this.precomputeAlphas();
    
    static precomputeAlphas() {
        let result = [];
        const half = Math.floor(this.layers / 2);
        const maxAlpha = 1.0;
        const minAlpha = 0.01;

        for (let i = 0; i <= half; i++) {
            const t = 1 - i / half;
            const curve = Math.sin(t * Math.PI);
            result[i] = minAlpha + curve * (maxAlpha - minAlpha);
        }
        return result;
    }
    static draw(ctx, txt, point, fill, alpha) {        
        const {x, y} = point;
        const half = Math.floor(this.layers / 2); // middle index
        for ( let i = 1; i <= half; i++ ) {
            const layerAlpha = this.layerAlphas[i] * alpha;   
            ctx.fillStyle = "rgba(0,255,0," + layerAlpha + ")"; 
            const offset = i * 0.5; 
            ctx.fillText(txt, x + offset, y);
            ctx.fillText(txt, x - offset, y);
            ctx.fillText(txt, x, y + offset);
            ctx.fillText(txt, x, y - offset);
        }
        ctx.fillStyle = "rgba(" + fill.join(",") + ",1)"; // final color
        ctx.fillText(txt, x, y);
        ctx.fillText(txt, x, y);
    }
}