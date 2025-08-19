import { mt_rand } from "./functions.js";
import charLighter from "./char-lighter.js";
import waveLighter from "./wave-lighter.js";

export class MainEffects {
    static applyTo(drop) {
        this.swapHead(drop.chars, drop.alphas);
        this.swapChars(drop.chars, drop.alphas);
        this.flipChars(drop.chars);
        this.flashChar(drop);
    }
    static swapHead(chars, alphas) { charSwapper.swapHead(chars, alphas); }
    static swapChars(chars, alphas) { charSwapper.swapChars(chars, alphas); }
    static flipChars(chars) { charFlipper.run(chars); }
    static flashChar(drop) { charLighter.run(drop, 60); }
}

export class GhostEffects {
    static applyTo(drop) {
        this.upAlpha(drop.alphas);
        this.downAlpha(drop.alphas);
        this.waveLight(drop);
    }
    static upAlpha(alphas) { charAlpha.up(alphas); }
    static downAlpha(alphas) { charAlpha.down(alphas); }
    static waveLight(drop) { waveLighter.run(drop, 60); }
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
    static run(chars) {
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
            if ( chars[idx1] === " " || chars[idx2] === " " ) return;
            const param = Math.random() < 0.05 ? alphas : false;
            this.doSwap(chars, idx1, idx2, param);
        }            
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