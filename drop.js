import { MainEffects, GhostEffects, GlowingChar } from "./effects.js";
import { Point, mt_rand, getRandomChars, generateId } from "./functions.js";

export default class Drop {
    constructor(chars, point, cfg) { //console.log(cfg);
        this.chars = chars; //this.getChars(cfg.dropLengths);
        this.speed = this.getSpeed(cfg.speed);
        this.alphas = this.generateAlphas(cfg.alphaRange);
        this.x = point.x;
        this.y = point.y;
        this.cfg = cfg;
        this.charHeight = cfg.charHeight;
        this.canvasHeight = 0;
        this.id = generateId();
    }
    getSpeed(cfg) {
        return mt_rand(cfg.min, cfg.max) / 10;
    }
    update() {
        this.y += this.speed;
    }
    ensureCanvasHeight(ctx) {
        if ( this.canvasHeight === 0 ) 
            this.canvasHeight = ctx.canvas.height;
    }
    applyEffects() {
        if ( this.cfg.isGhost === true )
            GhostEffects.applyTo(this);
        else 
            MainEffects.applyTo(this);        
    }
    computeCharY(i) {
        return this.y - i * this.charHeight;
    }
    isOnScreen(charY) {
        return (charY > -this.charHeight && charY < this.canvasHeight);
    }
    drawChar(ctx, c, i, charY) {
        const fill = (i === 0 ? [213,255,213] : [0,255,0]);
        if ( this.cfg.isGhost === true ) {
            ctx.fillStyle = "rgba(0,255,0," + this.alphas[i] + ")"; 
            ctx.fillText(c, this.x, charY);
        }
        else 
            GlowingChar.draw(ctx, c, Point(this.x, charY), fill, this.alphas[i]);
    }
    draw(ctx) {
        this.ensureCanvasHeight(ctx);
        this.applyEffects();
        for ( const [i, c] of this.chars.entries() ) {            
            const charY = this.computeCharY(i);
            if ( this.isOnScreen(charY) === false ) continue;
            this.drawChar(ctx, c, i, charY);
        }
    }
    isOffscreen() {
        return this.y - (this.chars.length * this.charHeight) > this.canvasHeight;
    }
    generateAlphas(range) {
        let result = [];
        const brightCount = 1;//mt_rand(1,3); // keep first n bright
        const fadeLength = Math.max(1, this.chars.length - brightCount);
        const decayRate = 5; // higher = faster drop
        const { headAlpha, tailAlpha } = range;

        for (let i = 0; i < this.chars.length; i++) {
            if ( i < brightCount ) {
                result.push(headAlpha);
            } else {
                const t = (i - brightCount) / fadeLength; // 0 → 1
                // Exponential falloff
                const eased = Math.exp(-decayRate * t);
                const alpha = tailAlpha + eased * (headAlpha - tailAlpha);
                result.push(alpha);                
            }
        }
        return result;
    }
}
