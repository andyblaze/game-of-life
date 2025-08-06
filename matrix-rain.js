
class Renderer {
    constructor(cfg) {
        this.canvas = document.getElementById("onscreen");
        this.canvas.width = cfg.COLS * cfg.CELL_SIZE;
        this.canvas.height = cfg.ROWS * cfg.CELL_SIZE;
        this.CELL_SIZE = cfg.CELL_SIZE;
        this.ctx = this.canvas.getContext("2d");

        this.offscreen = document.createElement("canvas");
        this.offscreen.width = this.canvas.width;
        this.offscreen.height = this.canvas.height;
        this.offCtx = this.offscreen.getContext("2d");
        //this.colorPalette = Array.from({ length: 360 }, (_, h) => `hsl(${h}, 100%, 50%)`);
    }
    draw(data) {
        //console.log("draw", data.drops);
        this.offCtx.fillStyle = '#0f0';
        // Fade previous frame for trailing effect
        const alpha = 0.05 + Math.random() * 0.1; // Range: 0.05–0.15
        this.offCtx.fillStyle = `rgba(0, 0, 0, ${alpha.toFixed(3)})`;
        //this.offCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.offCtx.fillRect(0, 0, this.offscreen.width, this.offscreen.height);

        this.offCtx.font = "24px monospace";
        this.offCtx.textAlign = 'center';
        this.offCtx.fillStyle = '#0f0'; // Classic matrix green
        this.offCtx.textBaseline = 'top';

        for (const { col, row, char } of data.drops) {
            const x = col * this.CELL_SIZE;
            const y = row * this.CELL_SIZE;
            //console.log(col, row, char,x,y);

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
        this.view = new Renderer(cfg);
        this.charPool = Array.from("アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*+=-;:/?~");
        this.liveCells = new Map();
        this.paused = false;
    }
    getRandomChar() {
        const i = Math.floor(Math.random() * this.charPool.length);
        return this.charPool[i];
    }
    tick() {
        for ( let col = 0; col < this.COLS; col++ ) {
            // Possibly spawn a new drop
            if ( ! this.liveCells.has(col) ) {
                if ( Math.random() < 0.02 ) { // tune spawn chance
                    this.liveCells.set(col, {
                        row: 0,
                        speed: Math.floor(Math.random() * 3) + 1,
                        char: this.getRandomChar()
                    });
                }
            }
        }
        // Update all live drops
        const drops = [];
        for ( let [col, drop] of this.liveCells.entries() ) {
            drop.row += drop.speed;
            drop.char = this.getRandomChar(); // or not every time

            if ( drop.row >= this.ROWS ) {
                this.liveCells.delete(col);
            } else {
                drops.push({ col, row: drop.row, char: drop.char });
            }
        }

        return { drops };
    }        
}

class GraphicsController {
    constructor(model, config) {
        this.model = model;
        this.view = new Renderer(config);
        this.paused = false;
        this.frameCount = 0;
        this.framesPerTick = 5; // slows to 60fps / framesPerTick - more frameCount is slower fps
    }
    resize() {
        this.paused = true;
        const data = this.model.tick();
        this.view.draw(data);
        this.view.resize();
        this.paused = false;
    }
    loop() {
        if ( this.paused === false ) {
            this.frameCount = (this.frameCount + 1) % (this.framesPerTick * 1000);
            if ( this.frameCount % this.framesPerTick === 0 ) {
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
  CHAR_POOL: "アカサタナハマヤラワ0123456789@#$%&", // usable characters
  GLOW_FADE: true,        // whether to fade out trailing characters
  FADE_SPEED: 0.05,       // how fast trails fade
  MAX_ACTIVE_DROPS: 80,   // upper limit on how many active drops at once
  COLUMN_SPAWN_CHANCE: 0.05, // chance per frame to start a drop in an idle column
  HEAD_BRIGHTNESS: 1.0,   // brightness of head char
  TRAIL_BRIGHTNESS: 0.5,  // brightness of trailing chars
};

window.addEventListener("DOMContentLoaded", () => {
    const model = new MatrixRain(config);
    const controller = new GraphicsController(model, config);
    window.addEventListener("resize", controller.resize.bind(controller));
    controller.resize();
    controller.loop();
});
