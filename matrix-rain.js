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
    drawChar(char, fills, fonts, x, y) {
        this.offCtx.textAlign = "center";
        this.offCtx.textBaseline = "top";
        // fake glow
        this.offCtx.fillStyle = fills.big;
        this.offCtx.font = fonts.big; 
        this.offCtx.fillText(char, x, y-2);
        // main char
        this.offCtx.fillStyle = fill;
        this.offCtx.font = font; 
        this.offCtx.fillText(char, x, y);               
    }
    drawGlowChar(char, x, y, fill, alpha) {
        const glowLayers = 5;//mt_rand(3, 5);
        for (let i = glowLayers; i > 0; i--) {
            this.offCtx.font = `${24 + i}px monospace`; // bigger for outer layers
            if (i === 0) {
                this.offCtx.fillStyle = "rgba(" + fill.join(",") + ",0.7)"; // final color
            } else {
                this.offCtx.fillStyle = "rgba(" + fill.join(",") + "," + alpha * 0.5 + ")"; // outer glow
            }
            //console.log(alpha);
            this.offCtx.fillText(char, x, y);
        }
    }
    draw(data) {
        // draw to offscreen
        this.offCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const font = {main:24, big:30};

        for (const { col, speed, row, chars, alphas } of data.drops) {
            const x = col * this.cellSize + this.cellSize / 2;
            const charsToDraw = chars.length; // you'll control this externally based on frame
            // Draw only chars that fit into the current "falling window"
            for (let i = 0; i < chars.length; i++) {
                const y = ((row - i) * this.cellSize); // stack upward from row
                const fills = {
                    main: (i === 0) ? '#fff' : `rgba(0,255,0,${alphas[i]})`,
                    big: `rgba(0,255,0,${alphas[i] * 0.5})`
                };
                const fonts = {main: font.main + "px monospace", big: "bold " + font.big + "px monospace"};
                //this.drawChar(chars[i], fills, fonts, x, y); 
                const fill = (i === 0) ? [255,255,255] : [0,255,0];
                this.drawGlowChar(chars[i], x, y, fill, alphas[i]);               
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
    getRandomChar(allowSpace=true) {
        if ( allowSpace === false ) {
            const idx = this.charPool.indexOf(" ");
            const i = mt_rand(0, this.charPool.length - idx);
            return this.charPool[i];
        }
        const i = mt_rand(0, this.charPool.length - 1);
        return this.charPool[i];
    }
    getRandomChars(num) {
        let chars = [];
        chars[0] = this.getRandomChar(false);
        chars[1] = this.getRandomChar(false);
        chars[2] = this.getRandomChar(false);
        
        const end = Array.from({ length: num - 3 }, () =>
            this.charPool[mt_rand(0, this.charPool.length - 1)]
        );
        return chars.concat(end);
    }
generateAlphas(length) {
    const alphas = [];
    const headAlpha = 1.0;   
    const tailMinAlpha = 0.01;
    const brightCount = mt_rand(1,3); // keep first n bright

    for (let i = 0; i < length; i++) {
        if (i < brightCount) {
            alphas.push(headAlpha);
        } else {
            const t = (i - brightCount) / (length - brightCount - 1);
            const eased = 1 - Math.pow(t, 2);
            const alpha = tailMinAlpha + eased * (headAlpha - tailMinAlpha);
            alphas.push(alpha);
        }
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
    swapHead(chars, alphas) {
        if (Math.random() < 0.05) { // 5% chance per frame
            const tmp = chars[0];
            chars[0] = chars[1];
            chars[1] = tmp;

            const tmpAlpha = alphas[0];
            alphas[0] = alphas[1];
            alphas[1] = tmpAlpha;
        }            
    }
    swapChars(chars, alphas) {
        if (Math.random() < 0.05) { // 5% chance per frame
            const idx1 = mt_rand(1, chars.length -1);
            const idx2 = mt_rand(1, chars.length -1);
            const tmp = chars[idx1];
            chars[idx1] = chars[idx2];
            chars[idx2] = tmp;

            const tmpAlpha = alphas[idx1];
            alphas[idx1] = alphas[idx2];
            alphas[idx2] = tmpAlpha;
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
            // Randomly change the head char
            this.swapHead(drop.chars, drop.alphas);  
            this.swapChars(drop.chars, drop.alphas);
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
  DROP_LENGTHS: {min: 5, max:13}, // min / max characters in a drop
  CHAR_POOL: Array.from("アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンヴー・" +
                 "日月火水木金土年時分秒上下左右中大小入口出口本人力十百千万" + "                "),//ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*+=-;:/?~                 "),
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
