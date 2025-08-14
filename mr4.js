function mt_rand(min = 0, max = 2147483647) {
    if (min > max) [min, max] = [max, min]; // swap if min > max
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const config = {
    framesPerTick : 1,
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
        for ( const lane of data ) {
            for ( const drop of lane.drops )
                drop.draw(this.offCtx);
        }
        
        this.blit();
    }
    blit() {
        this.onCtx.clearRect(0, 0, this.onscreen.width, this.onscreen.height);
        this.onCtx.drawImage(this.offscreen, 0, 0);  
    }
}

class Drop {
    constructor(chars, x, y, speed, charHeight) {
        this.chars = chars;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.charHeight = charHeight;
        this.alphas = this.generateAlphas(this.chars.length, 1, 0.01); // 1, 0.01 from cfg
        this.canvasHeight = 0;
    }

    update() {
        this.y += this.speed;
    }
    draw(ctx) {
        if ( this.canvasHeight === 0 ) this.canvasHeight = ctx.canvas.height;
        for ( const [i, c] of this.chars.entries() ) {
            const charY = this.y - i * this.charHeight;
            if (charY > -this.charHeight && charY < ctx.canvas.height) {
                GlowingChar.draw(ctx, c, this.x, charY, this.alphas[i]);
            }
        }
    }
    isOffscreen() {
        return this.y - (this.chars.length * this.charHeight) > this.canvasHeight;
    }
    generateAlphas(length, headAlpha, tailMinAlpha) {
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
                result.push(alpha);                
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
    constructor(x, charHeight) {
        this.x = x;
        this.charHeight = charHeight;
        this.drops = [];
    }
    spawnDrop() {
        const length = mt_rand(5, 13);
        const chars = Array.from({ length }, () =>
            String.fromCharCode(mt_rand(0x30A0, 0x30FF)) // get from cfg charPool
        );
        const speed = mt_rand(2, 5) / 4;
        if ( this.drops.length === 0 )  // FOR TESTING !!!!!!!!!!!!!!!!!!!!!!
            this.drops.push(new Drop(chars, this.x, -length * this.charHeight, speed, this.charHeight));
    }
    update() {
        this.drops.forEach(drop => {
            drop.update();
        });

        // Remove finished drops
        this.drops = this.drops.filter(drop => !drop.isOffscreen());

        // Randomly spawn new drop
        if (Math.random() < 0.01) { // tune spawn chance from cfg
            this.spawnDrop();
        }
    }
}

class Model {
    constructor(cfg) {
        this.cfg = cfg;
        const charWidth = 24; // from cfg setting
        const numLanes = 80; // numLanes = cfg setting
        const maxActiveLanes = 30; // from cfg setting
        this.lanes = Array.from({ length: numLanes }, (_, i) =>
            new Lane(i * charWidth + charWidth / 2, 24) // 24 = cfg setting
        );
    } 
    tick() {
        this.lanes.forEach(lane => lane.update());
        return this.lanes;
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
            console.log((this.sum / this.frameCount).toFixed(2), parseInt(60 / (this.sum / this.frameCount)));
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
