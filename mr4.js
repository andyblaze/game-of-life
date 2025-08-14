function mt_rand(min = 0, max = 2147483647) {
    if (min > max) [min, max] = [max, min]; // swap if min > max
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const config = {
    framesPerTick : 120,
    font: "24px monospace",
    fillColor: "#0f0"
}

class Renderer {
    constructor(id, cfg) {
        this.cfg = cfg;
        this.canvasInit(id);
    }
    canvasInit(id) {
        this.onscreen = document.getElementById(id);
        this.onCtx = this.onscreen.getContext("2d");
        this.offscreen = document.createElement("canvas");
        this.offCtx = this.offscreen.getContext("2d");
        this.resetCtx();
    }
    resetCtx() {
        this.offCtx.textAlign = "center";
        this.offCtx.textBaseline = "top";
        this.offCtx.font = this.cfg.font;
        this.offCtx.fillStyle = this.cfg.fillColor;
    }
    resize(w, h) {
        this.onscreen.width = w;
        this.onscreen.height = h;
        this.offscreen.width = w;
        this.offscreen.height = h;
        this.resetCtx();
    }
    draw(data) {
        this.offCtx.clearRect(0, 0, this.offscreen.width, this.offscreen.height);
        const x = mt_rand(24, this.onscreen.width - 24);
        const y = 24;//mt_rand(24, this.onscreen.height - 240);
        //this.offCtx.fillText(data, x, y);
        Drop.draw(this.offCtx, x, y);
        this.blit();
    }
    blit() {
        this.onCtx.clearRect(0, 0, this.onscreen.width, this.onscreen.height);
        this.onCtx.drawImage(this.offscreen, 0, 0);  
    }
}

class Drop {
    static chars = Array.from("アイウエオカキ");
    static alphas = [];
    static draw(ctx, x, y) {
        this.alphas = this.generateAlphas(this.chars.length, 1, 0.01);
        for ( const [i, c] of this.chars.entries() ) {
            GlowingChar.draw(ctx, c, x, y*i, this.alphas[i]);
        }
    }
    static generateAlphas(length, headAlpha, tailMinAlpha) {
        let result = [];
        const brightCount = mt_rand(1,3); // keep first n bright
        const fadeLength = Math.max(1, length - brightCount);
        const decayRate = 5; // higher = faster drop

        for (let i = 0; i < length; i++) {
            if (i < brightCount) {
                result.push(headAlpha);
            } else {
                const t = (i - brightCount) / fadeLength; // 0 → 1
                // Exponential falloff
                const eased = Math.exp(-decayRate * t);
                const alpha = tailMinAlpha + eased * (headAlpha - tailMinAlpha);
                result.unshift(alpha);                
            }
        }
        return result;
    }
}

class GlowingChar {
    static layers = 11;

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
    static draw(ctx, txt, x, y, alpha) {
        this.layerAlphas = this.precomputeAlphas();
        const half = Math.floor(this.layers / 2); //this.glowLayers / 2); // middle index
        for ( let i = 1; i <= half; i++ ) {
            const layerAlpha = this.layerAlphas[i] * alpha;   
            ctx.fillStyle = "rgba(0,255,0," + layerAlpha + ")"; 
            
            const offset = i * 0.5; 
            ctx.fillText(txt, x + offset, y);
            ctx.fillText(txt, x - offset, y);
            ctx.fillText(txt, x, y + offset);
            ctx.fillText(txt, x, y - offset);
        }
        ctx.fillStyle = "rgba(213,255,213,1)"; // final color
        ctx.fillText(txt, x, y);
        ctx.fillText(txt, x, y);
    }
}

class Lane {
    constructor() {
        this.drops = [];
    }
}

class Model {
    constructor(cfg) {
        this.cfg = cfg;
        this.lanes = [];
    } 
    tick() {
        return "ア";
    }
}

class Controller {
    constructor(m, v, c) {
        this.model = m;
        this.view = v;
        this.cfg = c;
        this.paused = false;
        this.frameCount = 0;
    }
    resize() {
        this.view.resize(window.innerWidth, window.innerHeight);
    }
    // fps throttling
    frameReady() {
        this.frameCount = (this.frameCount + 1) % this.cfg.framesPerTick;
        return this.frameCount % this.cfg.framesPerTick === 0;
    }
    loop(timestamp) {
        if ( this.paused === false ) {            
            if ( this.frameReady() ) {
                const data = this.model.tick();
                this.view.draw(data);
                DeltaReport.log(timestamp);
            }
        }
        requestAnimationFrame(this.loop.bind(this)); 
    } 
}

class DeltaReport {
    static lastTime = performance.now();
    static frameCount = 0;
    static sum = 0;
    
    static log(timestamp) {
        this.frameCount++;
        const delta = (timestamp - this.lastTime) / 16.67;
        this.sum += delta;
        this.lastTime = timestamp;
        if ( this.frameCount === 120 ) {
            console.log(this.sum / this.frameCount);
            this.frameCount = 0;
            this.sum = 0;
        }
    }
}


window.addEventListener("DOMContentLoaded", () => {
    const controller = new Controller(
        new Model(config), 
        new Renderer("onscreen", config), 
        config
    );
    window.addEventListener("resize", controller.resize.bind(controller));
    window.addEventListener("click", function() {controller.paused = ! controller.paused;});
    controller.resize();
    controller.loop();
});
