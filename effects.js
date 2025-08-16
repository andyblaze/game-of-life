import { mt_rand } from "./functions.js";

export default class Effects {
    static swapHead(chars, alphas) { charSwapper.swapHead(chars, alphas); }
    static swapChars(chars, alphas) { charSwapper.swapChars(chars, alphas); }
    static glowingChar(ctx, txt, point, fill, alpha) { GlowingChar.draw(ctx, txt, point, fill, alpha); }
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
class charFlasher {
    // Spotlight effect states
    static flashIndex = null;     // index of the char being lit
    static flashFramesLeft = 0;   // countdown until it stops  
    static lightedCharOriginalAlpha = null;
    static flashAlpha = null;
    
    static flashRandomChar(chars, alphas, duration) {
        if (chars.length === 0) return;

        if ( this.lightedCharIsRunning() ) return;
        
        if ( Math.random() < 0.05 ) {
            this.flashIndex = Math.floor(Math.random() * chars.length);
            this.lightedCharOriginalAlpha = alphas[this.flashIndex];
            alphas[this.flashIndex] = 1;  // set to full brightness
            this.flashAlpha = alphas[this.flashIndex];
            this.flashFramesLeft = duration;
        }
    }
    static flashCharIsRunning() {
        if ( this.flashFramesLeft > 0 ) {
            this.flashFramesLeft--;
            if ( this.flashFramesLeft === 0 && this.flashIndex !== null ) {
                // Restore original alpha when done
                this.alphas[this.flashIndex] = this.lightedCharOriginalAlpha;
                this.flashIndex = null;
                this.lightedCharOriginalAlpha = null;
            }
        }
        return (this.flashIndex !== null && this.lightedCharOriginalAlpha !== null);
    }
}

class GlowingChar {
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