import { mt_rand } from "./functions.js";

export class MainEffects {
    static applyTo(drop) {
        this.swapHead(drop.chars, drop.alphas);
        this.swapChars(drop.chars, drop.alphas);
        this.flipChars(drop.chars);
        //this.flashChar(drop);
    }
    static swapHead(chars, alphas) { charSwapper.swapHead(chars, alphas); }
    static swapChars(chars, alphas) { charSwapper.swapChars(chars, alphas); }
    static flipChars(chars) { charFlipper.flip(chars); }
    //static flashChar(drop) { charLighter.flashRandomChar(drop, 60); }
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
        if ( Math.random() < 0.01 ) { // 5% chance per frame
            const idx = mt_rand(0, alphas.length -1);
            alphas[idx] = 1;
        }
    }
    static down(alphas) {
        if ( Math.random() < 0.1 ) { // 5% chance per frame
            const idx = mt_rand(0, alphas.length -1);
            alphas[idx] = 0.4;
        }
    }
}
class charFlipper {
    static flip(chars) {
        if ( Math.random() < 0.01 ) { // 1% chance per frame
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
        if ( Math.random() < 0.05 ) { // 5% chance per frame
            this.doSwap(chars, 0, 1, alphas);
        }            
    }
    static swapChars(chars, alphas) {
        if ( Math.random() < 0.05 ) { // 5% chance per frame
            const idx1 = mt_rand(1, chars.length -1);
            const idx2 = mt_rand(1, chars.length -1);
            const param = Math.random() < 0.05 ? alphas : false;
            this.doSwap(chars, idx1, idx2, param);
        }            
    }
}
class charLighter {
    // Spotlight effect states
    static flashIndex = null;     // index of the char being lit
    static flashFramesLeft = 0;   // countdown until it stops  
    static lightedCharOriginalAlpha = null;
    static alphas = [];
    static drop = null;
    
    static flashRandomChar(drop, duration) {
        if (drop.chars.length === 0) return;
        if ( this.drop === null ) this.drop = drop; else return;
        if ( this.isRunning() ) return;

        
        if ( Math.random() < 0.05 ) { console.log(9);
            this.flashIndex = Math.floor(Math.random() * this.drop.chars.length);
            this.lightedCharOriginalAlpha = this.drop.alphas[this.flashIndex];
            this.drop.alphas[this.flashIndex] = 1;  // set to full brightness
            this.alphas = drop.alphas;
            this.flashFramesLeft = duration;
        }
    }
    static isRunning() {
        if ( this.flashFramesLeft > 0 ) {
            this.flashFramesLeft--;
            if ( this.flashFramesLeft === 0 && this.flashIndex !== null ) {
                // Restore original alpha when done
                this.drop.alphas[this.flashIndex] = this.lightedCharOriginalAlpha;
                this.flashIndex = null;
                this.lightedCharOriginalAlpha = null;
                this.drop = null;
            }
        }
        return (this.flashIndex !== null && this.lightedCharOriginalAlpha !== null);
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