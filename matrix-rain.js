function mt_rand(min = 0, max = 2147483647) {
    if (min > max) [min, max] = [max, min]; // swap if min > max
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Renderer {
    constructor(cfg) {
        this.canvas = document.getElementById("onscreen");
        this.canvas.width = cfg.COLS * cfg.CELL_SIZE;
        this.canvas.height = cfg.ROWS * cfg.CELL_SIZE;
        this.CELL_SIZE = cfg.CELL_SIZE;
        this.cols = cfg.COLS;
        this.ctx = this.canvas.getContext("2d");

        this.offscreen = document.createElement("canvas");
        this.offscreen.width = this.canvas.width;
        this.offscreen.height = this.canvas.height;
        this.offCtx = this.offscreen.getContext("2d");
        //this.colorPalette = Array.from({ length: 360 }, (_, h) => `hsl(${h}, 100%, 50%)`);
    }
    draw(data) {
        // Fade previous frame for trailing effect
        // whole screen fill
        //const alpha = 0.05 + Math.random() * 0.1; // Range: 0.05–0.15
        //this.offCtx.fillStyle = "rgba(0,0,0," + alpha.toFixed(3) + ")";
        //this.offCtx.fillRect(0, 0, this.offscreen.width, this.offscreen.height);
        // per column fill
        for (let col = 0; col < this.cols; col++) {
            const alpha = 0.05 + Math.random() * 0.1; // Per-column variation
            const x = col * this.CELL_SIZE;

            this.offCtx.fillStyle = `rgba(0, 0, 0, ${alpha.toFixed(3)})`;
            this.offCtx.fillRect(x, 0, this.CELL_SIZE, this.offscreen.height);
        }

        this.offCtx.font = "24px monospace";
        this.offCtx.textAlign = 'center';
        this.offCtx.fillStyle = '#0f0'; // Classic matrix green
        this.offCtx.textBaseline = 'top';

        for (const { col, row, char, ghost } of data.drops) { 
            this.offCtx.fillStyle = ghost ? 'rgba(0,255,0,0.5)' : '#0f0';
            const x = col * this.CELL_SIZE;
            const y = row * this.CELL_SIZE;
            this.offCtx.fillText(char, x, y);
        }
        // Blit offscreen to onscreen canvas
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
        this.speed = {min: cfg.MIN_SPEED, max: cfg.MAX_SPEED};
        this.view = new Renderer(cfg);
        this.liveCells = new Map();
        this.paused = false;
    }
    getRandomChar() {
        const i = mt_rand(0, this.charPool.length - 1);
        return this.charPool[i];
    }
    getLiveCells() {
        for ( let col = 0; col < this.COLS; col++ ) {
            // Possibly spawn a new drop
            if ( ! this.liveCells.has(col) ) {
                if ( Math.random() < this.spawnChance ) { // tune spawn chance
                    this.liveCells.set(col, {
                        row: mt_rand(0, 4),
                        speed: mt_rand(this.speed.min, this.speed.max), // tweak
                        char: this.getRandomChar(),
                        trailLength:this.ROWS,
                        ghost: false
                    });
                }
            }
            // only add sparsely - tweak it
            if ( ! this.liveCells.has(col) && Math.random() < this.ghostChance ) {
                const ghostDrop = {
                    row: mt_rand(0, this.ROWS) * 0.5,
                    speed: mt_rand(this.speed.min, this.speed.max), // tweak
                    char: this.getRandomChar(),
                    trailLength: mt_rand(5, this.ROWS / 2),
                    ghost: true
                };
                this.liveCells.set(col, ghostDrop);
            }
        }
    }
    updateDrops() {
        // Update all live drops
        const drops = [];
        for ( let [col, drop] of this.liveCells.entries() ) {
            drop.frameCount = (drop.frameCount || 0) + 1;
            if ( drop.frameCount % drop.speed === 0 )
                drop.row += 1; // or drop.row += 0.1 * drop.speed; for ultra smooth motion
            
            if ( drop.ghost ) {
                drop.trailLength--;
                if ( drop.trailLength < 1 ) {
                    this.liveCells.delete(col);
                    continue;
                }
            }
            drop.char = this.getRandomChar();

            if ( drop.row >= this.ROWS ) {
                this.liveCells.delete(col);
            } else {
                drops.push({ col, row: drop.row, char: drop.char, ghost:drop.ghost });
            }
        }
        return { drops };
    }
    tick() {
        this.getLiveCells();
        return this.updateDrops();
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
  MIN_SPEED: 1,           // fastest a drop can move (frames per step)
  MAX_SPEED: 5,           // slowest a drop can move
  MIN_LENGTH: 5,          // min characters in a drop
  MAX_LENGTH: 20,         // max characters in a drop
  CHAR_POOL: Array.from("アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*+=-;:/?~"),
  GLOW_FADE: true,        // whether to fade out trailing characters
  FADE_SPEED: 0.05,       // how fast trails fade
  MAX_ACTIVE_DROPS: 80,   // upper limit on how many active drops at once
  COLUMN_SPAWN_CHANCE: 0.05, // chance per frame to start a drop in an idle column
  GHOST_SPAWN_CHANCE: 0.1, // chance of a ghost drop spawning
  HEAD_BRIGHTNESS: 1.0,   // brightness of head char
  TRAIL_BRIGHTNESS: 0.5,  // brightness of trailing chars
  FRAMES_PER_TICK: 5      // more FRAMES_PER_TICK is slower fps
};

window.addEventListener("DOMContentLoaded", () => {
    const model = new MatrixRain(config);
    const controller = new GraphicsController(model, config);
    window.addEventListener("resize", controller.resize.bind(controller));
    controller.resize();
    controller.loop();
});
