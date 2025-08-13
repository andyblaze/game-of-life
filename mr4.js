function mt_rand(min = 0, max = 2147483647) {
    if (min > max) [min, max] = [max, min]; // swap if min > max
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const config = {
    framesPerTick : 5
}

class Renderer {
    constructor(id, cfg) {
        this.onscreen = document.getElementById(id);
        this.cfg = cfg;
        this.onCtx = this.onscreen.getContext("2d");
        this.offscreen = document.createElement("canvas");
        this.offCtx = this.offscreen.getContext("2d");
    }
    resize(w, h) {
        this.onscreen.width = w;
        this.onscreen.height = h;
        this.offscreen.width = w;
        this.offscreen.height = h;
    }
    draw(data) {
        const x = mt_rand(24, this.onscreen.width - 24);
        const y = mt_rand(24, this.onscreen.height - 24);
        this.offCtx.fillStyle = "#fff";
        this.offCtx.fillText(data, x, y);
        this.blit();
    }
    blit() {
        this.onCtx.clearRect(0, 0, this.onscreen.width, this.onscreen.height);
        this.onCtx.drawImage(this.offscreen, 0, 0);  
    }
}

class Drop {
    draw() {
        
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
        return "A";
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
        this.frameCount = (this.frameCount + 1) % (this.cfg.framesPerTick * 1000);
        return this.frameCount % this.cfg.framesPerTick === 0;
    }
    loop(timestamp) {
        if ( this.paused === false ) {            
            if ( this.frameReady() ) {
                const data = this.model.tick();
                this.view.draw(data);
            }
        }
        requestAnimationFrame(this.loop.bind(this)); 
        DeltaReport.log(timestamp);
    } 
}

class DeltaReport {
    static lastTime = performance.now();
    static frameCount = 0;
    static sum = 0;
    
    static log(timestamp) {
        DeltaReport.frameCount++;
        const delta = (timestamp - DeltaReport.lastTime) / 16.67;
        DeltaReport.sum += delta;
        DeltaReport.lastTime = timestamp;
        if ( DeltaReport.frameCount === 120 ) {
            console.log(DeltaReport.sum / DeltaReport.frameCount);
            DeltaReport.frameCount = 0;
            DeltaReport.sum = 0;
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
