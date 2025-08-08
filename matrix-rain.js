function mt_rand(min = 0, max = 2147483647) {
    if (min > max) [min, max] = [max, min]; // swap if min > max
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Column {
    constructor(c) {
        this.chars = c;
    }
    draw(context) {
        
    }
}

class Renderer {
    constructor(cfg) {
        this.font = cfg.FONT;
        this.overlayFade = cfg.FADE_ALPHA;
        this.canvas = document.getElementById("onscreen");
        this.canvas.width = cfg.COLS * cfg.CELL_SIZE;
        this.canvas.height = cfg.ROWS * cfg.CELL_SIZE;
        this.cellSize = cfg.CELL_SIZE;
        this.cols = cfg.COLS;
        this.ctx = this.canvas.getContext("2d");

        this.offscreen = document.createElement("canvas");
        this.offscreen.width = this.canvas.width;
        this.offscreen.height = this.canvas.height;
        this.offCtx = this.offscreen.getContext("2d");
        //this.colorPalette = Array.from({ length: 360 }, (_, h) => `hsl(${h}, 100%, 50%)`);
    }
    draw(data) {
        // draw to offscreen
        this.offCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.offCtx.fillStyle = "#0f0";
        this.offCtx.font = this.font;
        this.offCtx.textAlign = "center";
        this.offCtx.textBaseline = "top";

        for (const { col, speed, row, chars, alphas } of data.drops) {
            const x = col * this.cellSize + this.cellSize / 2;
            const charsToDraw = chars.length; // you'll control this externally based on frame
            // Draw only chars that fit into the current "falling window"
            for (let i = 0; i < chars.length; i++) {
                this.offCtx.fillStyle = `rgba(0,255,0,${alphas[i]})`;
                const y = ((row - i) * this.cellSize); // stack upward from row
                this.offCtx.fillText(chars[i], x, y);
            }
        }  

        // blit offscreen to onscreen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.offscreen, 0, 0);    
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;    
    }
}

class MatrixRain {
    constructor(cfg) {
        this.CELL_SIZE = cfg.CELL_SIZE;
        this.COLS = cfg.COLS;
        this.ROWS = cfg.ROWS; 
        this.charPool = cfg.CHAR_POOL;
        this.spawnChance = cfg.COLUMN_SPAWN_CHANCE;
        this.ghostChance = cfg.GHOST_SPAWN_CHANCE;
        this.speed = cfg.SPEED;
        this.dropLength = cfg.DROP_LENGTHS;
        this.view = new Renderer(cfg);
        this.liveCols = new Map();
        this.paused = false;
    }
    getRandomChar() {
        const i = mt_rand(0, this.charPool.length - 1);
        return this.charPool[i];
    }
    getRandomChars(num) {
        return Array.from({ length: num }, () =>
            this.charPool[mt_rand(0, this.charPool.length - 1)]
        );
    }
    generateAlphas(length) {
        const alphas = [];
        const headAlpha = 1.0;   // brightest at head
        const tailMinAlpha = 0.1; // dimmest at tail

        for (let i = 0; i < length; i++) {
            const t = i / (length - 1); // 0 at head, 1 at tail
            const alpha = tailMinAlpha + (1 - t) * (headAlpha - tailMinAlpha);
            alphas.push(alpha);
        }

        return alphas;
    }
    getLiveCols() {
        for (let col = 0; col < this.COLS; col++) {
            if (!this.liveCols.has(col)) {
                if (Math.random() < this.spawnChance) { // 5% chance per frame
                    const characters = this.getRandomChars(mt_rand(this.dropLength.min, this.dropLength.max));
                    this.liveCols.set(col, {
                        row: 0,
                        speed: mt_rand(this.speed.min, this.speed.max) / 10,  // gives speeds like 1, 1.2, etc.
                        frameCount: 0,
                        chars: characters,
                        alphas: this.generateAlphas(characters.length)
                    });
                }
            }
        }    
    }
    updateCols() {
        const drops = [];

        for (let [col, drop] of this.liveCols.entries()) {
            drop.frameCount++;
            if (drop.frameCount % parseInt(drop.speed) === 0) {                
                drop.row += this.speed.baseRate * drop.speed;
            }
            // remove when past bottom
            if (drop.row - (drop.chars.length - 1) > this.ROWS) {
                this.liveCols.delete(col);
                continue;
            }
            drops.push({
                col,
                row: drop.row,
                speed:drop.speed,
                chars: drop.chars,
                alphas: drop.alphas
            });
        }
        return { drops };    
    }
    tick() {
        this.getLiveCols();
        return this.updateCols();
    }        
}

class GraphicsController {
    constructor(model, config) {
        this.model = model;
        this.view = new Renderer(config);
        this.paused = false;
        this.frameCount = 0;
        this.framesPerTick = config.FRAMES_PER_TICK;
    }
    resize() {
        this.paused = true;
        const data = this.model.tick();
        this.view.draw(data);
        this.view.resize();
        this.paused = false;
    }
    // fps throttling
    frameReady() {
        this.frameCount = (this.frameCount + 1) % (this.framesPerTick * 1000);
        return this.frameCount % this.framesPerTick === 0;
    }
    loop() {
        if ( this.paused === false ) {            
            if ( this.frameReady() ) {
                const data = this.model.tick();
                this.view.draw(data);
            }
        }
        requestAnimationFrame(this.loop.bind(this));        
    }    
}

const config = {
  CELL_SIZE: 24,          // px per cell (sets char size & spacing)
  COLS: 80,              // number of columns
  ROWS: 45,               // number of rows
  SPEED: {baseRate:0.15, min:10, max:13},
  DROP_LENGTHS: {min: 12, max:30}, // min / max characters in a drop
  CHAR_POOL: Array.from("アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*+=-;:/?~                 "),
  FONT: "24px monospace",
  FADE_ALPHA: 0.01,
  GLOW_FADE: true,        // whether to fade out trailing characters
  FADE_SPEED: 0.05,       // how fast trails fade
  MAX_ACTIVE_DROPS: 80,   // upper limit on how many active drops at once
  COLUMN_SPAWN_CHANCE: 0.01, // chance per frame to start a drop in an idle column
  GHOST_SPAWN_CHANCE: 0.1, // chance of a ghost drop spawning
  HEAD_BRIGHTNESS: 1.0,   // brightness of head char
  TRAIL_BRIGHTNESS: 0.5,  // brightness of trailing chars
  FRAMES_PER_TICK: 2      // more FRAMES_PER_TICK is slower fps
};

window.addEventListener("DOMContentLoaded", () => {
    const model = new MatrixRain(config);
    const controller = new GraphicsController(model, config);
    window.addEventListener("resize", controller.resize.bind(controller));
    controller.resize();
    controller.loop();
});
