function mt_rand(min = 0, max = 2147483647) {
    if (min > max) [min, max] = [max, min]; // swap if min > max
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hexToRgba(hex, alpha) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
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
        this.glowCfg = cfg.GLOW_CFG;
        this.cols = cfg.COLS;
        this.ctx = this.canvas.getContext("2d");

        this.offscreen = document.createElement("canvas");
        this.offscreen.width = this.canvas.width;
        this.offscreen.height = this.canvas.height;
        this.offCtx = this.offscreen.getContext("2d");
        this.offCtx.textAlign = "center";
        this.offCtx.textBaseline = "top";
        this.offCtx.font = "24px monospace";
        this.punkDust = [];

        //this.colorPalette = Array.from({ length: 360 }, (_, h) => `hsl(${h}, 100%, 50%)`);
    }
    draw(drops) {
        // draw to offscreen
        this.offCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //this.drawDust();
        //this.offCtx.textAlign = "center";
        //this.offCtx.textBaseline = "top";
        
        for ( let [col, drop] of drops ) {
            drop.draw(this.offCtx, this.cellSize)
        }
        // blit offscreen to onscreen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.offscreen, 0, 0);    
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;    
    }
    drawDust() { 
        for ( const {x, y, char} of this.punkDust.entries() ) {
            const a = mt_rand(1, 5) / 10;
            this.offCtx.fillStyle = "rgba(0,255,0," + a + ")"; 
            this.offCtx.fillText(char, x, y);
        }
    }
}

class Drop {
    constructor(col, speed, chars, alphas) {
        this.col = col;
        this.speed = speed;
        this.chars = chars;
        this.alphas = alphas;
        this.frameCount = 0;
        this.row = 0;
        // Spotlight effect state
        this.flashIndex = null;     // index of the char being lit
        this.flashFramesLeft = 0;   // countdown until it stops  
        this.lightedCharOriginalAlpha = null;
        this.glowLayers = 11;
        this.layerAlphas = this.precomputeLayerAlphas();
        /*this.layerColors = this.layerAlphas.map(a => 
            `rgba(${fill.glow.join(",")},${a.toFixed(2)})`
        );*/
    }
    precomputeLayerAlphas() {
        let result = [];
        const half = Math.floor(this.glowLayers / 2);
        const maxAlpha = 1.0;
        const minAlpha = 0.01;

        for (let i = 0; i <= half; i++) {
            const t = 1 - i / half;
            const curve = Math.sin(t * Math.PI);
            result[i] = minAlpha + curve * (maxAlpha - minAlpha);
        }
        return result;
    }
    updateRow(cfgSpeed) {
        this.frameCount++;
        if (this.frameCount % parseInt(this.speed) === 0) {                
            this.row += cfgSpeed * this.speed;
        }
    }
    bottomRow() {
        return this.row - this.chars.length - 1;
    }
    doSwap(idx1, idx2, alphas=false) {
        let tmp = this.chars[idx1];
        this.chars[idx1] = this.chars[idx2];
        this.chars[idx2] = tmp;
        
        if ( alphas === false ) return;
        tmp = this.alphas[idx1];
        this.alphas[idx1] = this.alphas[idx2];
        this.alphas[idx2] = tmp;
    }
    swapHead() {
        if ( Math.random() < 0.05 ) { // 5% chance per frame
            this.doSwap(0, 1, true);
        }            
    }
    swapChars() {
        if ( Math.random() < 0.05 ) { // 5% chance per frame
            const idx1 = mt_rand(1, this.chars.length -1);
            const idx2 = mt_rand(1, this.chars.length -1);
            const param = Math.random() < 0.05;
            this.doSwap(idx1, idx2, param);
        }            
    }
    flipChars() {
        if ( Math.random() < 0.01 ) { // 1% chance per frame
            this.chars.reverse();
        }
    }
    drawGhostChars(ctx, char, x, y) {
        ctx.fillStyle = "#0f0";
        for ( let pass = 1; pass < 3; pass++ ) {
            const offset = pass; // pixels offset
            ctx.globalAlpha = 0.09; // very faint
            this.chars.forEach((char, i) => {
                const gx = this.col * 24 + offset;
                const gy = (this.row - i) * 24 + offset;
                ctx.fillText(char, gx+48, gy-24);
            });
        }
        ctx.globalAlpha = 1.0;
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
    drawGlowChar(ctx, x, y, fill, index) {
        //this.drawGhostChars(ctx, char, x+12, y);
        const char = this.chars[index];
        const alpha = this.alphas[index];
        const half = Math.floor(this.glowLayers / 2); // middle index

        //ctx.save();
        //ctx.font = "24px monospace";
        
        for ( let i = 1; i <= half; i++ ) {
            const layerAlpha = this.layerAlphas[i] * alpha;   
            //ctx.fillStyle = this.layerColors[i];
            ctx.fillStyle = "rgba(" + fill.glow.join(",") + "," + layerAlpha + ")"; 
            
            const offset = i * 0.5; 
            ctx.fillText(char, x + offset, y);
            ctx.fillText(char, x - offset, y);
            ctx.fillText(char, x, y + offset);
            ctx.fillText(char, x, y - offset);
        }
        ctx.fillStyle = "rgba(" + fill.stroke.join(",") + ",1)"; // final color
        ctx.fillText(char, x, y);
        //ctx.restore();
    }
    draw(ctx, cellSz) {
        // Randomly change things
        this.swapHead();  
        this.lightUpRandomChar(60);
        this.swapChars();
        //this.flipChars();
        const x = this.col * cellSz + cellSz / 2;
        for ( let i = 0; i < this.chars.length; i++ ) {
            const fill = {glow:[0,255,0], stroke:(i === 0) ? [255,255,255] : [0,255,0]};
            const y = ((this.row - i) * cellSz); // stack upward from row
            if ( y > 0 ) 
                this.drawGlowChar(ctx, x, y, fill, i);               
        }
    }
}

class MatrixRain {
    constructor(cfg) {
        this.CELL_SIZE = cfg.CELL_SIZE;
        this.COLS = cfg.COLS;
        this.ROWS = cfg.ROWS; 
        this.charPool = cfg.DROP.CHAR_POOL;
        this.spawnChance = cfg.COLUMN_SPAWN_CHANCE;
        this.ghostChance = cfg.GHOST_SPAWN_CHANCE;
        this.speed = cfg.DROP.SPEED;
        this.dropLength = cfg.DROP.DROP_LENGTHS;
        this.view = null;
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
        const fadeLength = Math.max(1, length - brightCount);
        const decayRate = 5; // higher = faster drop

        for (let i = 0; i < length; i++) {
            if (i < brightCount) {
                alphas.push(headAlpha);
            } else {
                const t = (i - brightCount) / fadeLength; // 0 → 1
                // Exponential falloff
                const eased = Math.exp(-decayRate * t);
                const alpha = tailMinAlpha + eased * (headAlpha - tailMinAlpha);
                alphas.push(alpha);                
            }
        }

        return alphas;
    }
    getLiveCols() {
        if ( this.liveCols.size > 30 ) return;
        for (let col = 0; col < this.COLS; col++) {
            if ( ! this.liveCols.has(col) ) {
                if (Math.random() < this.spawnChance) { // 5% chance per frame
                    const characters = this.getRandomChars(mt_rand(this.dropLength.min, this.dropLength.max));
                    this.liveCols.set(col, new Drop(
                        col,
                        mt_rand(this.speed.min, this.speed.max) / 10,  // gives speeds like 1, 1.2, etc.
                        characters,
                        this.generateAlphas(characters.length)
                    ));
                }
            }
        }    
    }
    updateCols() {
        for (let [col, drop] of this.liveCols.entries()) {
            drop.updateRow(this.speed.baseRate);
            // remove when past bottom
            if (drop.bottomRow() > this.ROWS) {
                this.liveCols.delete(col);
                continue;
            }
        }
        return this.liveCols.entries();    
    }
    getPunkDust() {
        const max = 200;
        let points = [];
        const d = [".", "·", "-", "+", "'", '"', "・"];
        for ( let i = 0; i < max; i++ ) {
            const c = d[mt_rand(0, d.length-1)];
            points.push(
                {x:mt_rand(0, 1920), y:mt_rand(0, 1080), char:c}
            );
        }
        return points;
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
    HEAD_ALPHA: 1.0,
    TAIL_ALPHA: 0.01,
    IS_GHOST:false,
  DROP: {
    SPEED: {baseRate:0.15, min:10, max:13},
    DROP_LENGTHS: {min: 5, max:13}, // min / max characters in a drop
    CHAR_POOL: Array.from("アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンヴー・" +
                 "日月火水木金土年時分秒上下左右中大小入口出口本人力十百千万" + "                "),//ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*+=-;:/?~                 "),
    FONT: "24px monospace",
    HEAD_ALPHA: 1.0,
    TAIL_ALPHA: 0.01,
    IS_GHOST:false
  },
  GHOST: {
    SPEED: {baseRate:0.05, min:10, max:13},
    DROP_LENGTHS: {min: 4, max:9}, // min / max characters in a drop
    CHAR_POOL: Array.from(".·-+',・|`" + "   "),
    FONT: "12px monospace",
    HEAD_ALPHA: 0.5,
    TAIL_ALPHA: 0.1,
    IS_GHOST:true
  },
  FADE_ALPHA: 0.01,
  GLOW_FADE: true,        // whether to fade out trailing characters
  FADE_SPEED: 0.05,       // how fast trails fade
  MAX_ACTIVE_DROPS: 60,   // upper limit on how many active drops at once
  COLUMN_SPAWN_CHANCE: 0.1, // chance per frame to start a drop in an idle column
  GHOST_SPAWN_CHANCE: 0.8, // chance of a ghost drop spawning
  HEAD_BRIGHTNESS: 1.0,   // brightness of head char
  TRAIL_BRIGHTNESS: 0.5,  // brightness of trailing chars
  FRAMES_PER_TICK: 2 ,     // more FRAMES_PER_TICK is slower fps
  GLOW_CFG : {
    fontSize: 24,
    glowColor: "#d5ffd5",
    glowAlpha: 1,
    glowLayers: 2,
    glowOffset: 0,
    glowScale: 1,
    mainAlpha: 1,
    jitter: false,
    blurStrength: 6,
    blurColor: "#00ff00"
  },
  //PUNK_DUST: [., ·, -, +, ', ", ・]
};

window.addEventListener("DOMContentLoaded", () => {
    const model = new MatrixRain(config);
    const controller = new GraphicsController(model, config);
    window.addEventListener("resize", controller.resize.bind(controller));
    window.addEventListener("click", function() {controller.paused = ! controller.paused;});
    controller.resize();
    controller.loop();
});
