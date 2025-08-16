import Effects from "./effects.js";
import { Point, mt_rand } from "./functions.js";

export default class Drop {
    constructor(chars, point, speed, cfg) {
        this.chars = chars;
        this.x = point.x;
        this.y = point.y;
        this.speed = speed;
        this.cfg = cfg;
        this.charHeight = cfg.charHeight;
        this.alphas = this.generateAlphas();
        this.canvasHeight = 0;
        // Spotlight effect state
        this.flashIndex = null;     // index of the char being lit
        this.flashFramesLeft = 0;   // countdown until it stops  
        this.lightedCharOriginalAlpha = null;
    }

    update() {
        this.y += this.speed;
    }
    /*doSwap(idx1, idx2, alphas=false) {
        let tmp = this.chars[idx1];
        this.chars[idx1] = this.chars[idx2];
        this.chars[idx2] = tmp;
        
        if ( alphas === false ) return;
        tmp = this.alphas[idx1];
        this.alphas[idx1] = this.alphas[idx2];
        this.alphas[idx2] = tmp;
    }*/
    swapHead() { 
        Effects.swapHead(this.chars, this.alphas);          
    }
    lightUpRandomChar(duration) {
        if (this.chars.length === 0) return;

        if ( this.lightedCharIsRunning() ) return;
        
        if ( Math.random() < 0.05 ) {
            this.flashIndex = Math.floor(Math.random() * this.chars.length);
            this.lightedCharOriginalAlpha = this.alphas[this.flashIndex];
            this.alphas[this.flashIndex] = 1;  // set to full brightness
            this.flashFramesLeft = duration;
        }
    }
    lightedCharIsRunning() {
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
    swapChars() {
        Effects.swapChars(this.chars, this.alphas);            
    }
    flipChars() {
        if ( Math.random() < 0.01 ) { // 1% chance per frame
            this.chars.reverse();
        }
    }
    draw(ctx) {
        if ( this.canvasHeight === 0 ) 
            this.canvasHeight = ctx.canvas.height;
        
        this.swapHead();
        //this.lightUpRandomChar(60);
        this.swapChars();
        for ( const [i, c] of this.chars.entries() ) {
            const charY = this.y - i * this.charHeight;
            if (charY > -this.charHeight && charY < this.canvasHeight) {
                const fill = (i === 0 ? [213,255,213] : [0,255,0]);
                Effects.glowingChar(ctx, c, Point(this.x, charY), fill, this.alphas[i]);
            }
        }
    }
    isOffscreen() {
        return this.y - (this.chars.length * this.charHeight) > this.canvasHeight;
    }
    generateAlphas() {
        let result = [];
        const brightCount = mt_rand(1,3); // keep first n bright
        const fadeLength = Math.max(1, this.chars.length - brightCount);
        const decayRate = 5; // higher = faster drop
        const { headAlpha, tailMinAlpha } = this.cfg.mainAlphas;

        for (let i = 0; i < this.chars.length; i++) {
            if (i < brightCount) {
                result.push(headAlpha);
            } else {
                const t = (i - brightCount) / fadeLength; // 0 → 1
                // Exponential falloff
                const eased = Math.exp(-decayRate * t);
                const alpha = tailMinAlpha + eased * (headAlpha - tailMinAlpha);
                result.push(alpha);                
            }
        }
        return result;
    }
}
