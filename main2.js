class Renderer {
    constructor(cfg) {
        this.canvas = document.getElementById("onscreen");
        this.canvas.width = cfg.COLS * cfg.CELL_SIZE;
        this.canvas.height = cfg.ROWS * cfg.CELL_SIZE;
        this.ctx = this.canvas.getContext("2d");

        this.offscreen = document.createElement("canvas");
        this.offscreen.width = this.canvas.width;
        this.offscreen.height = this.canvas.height;
        this.offCtx = this.offscreen.getContext("2d");
        this.colorPalette = Array.from({ length: 360 }, (_, h) => `hsl(${h}, 100%, 50%)`);
    }
    draw(data) {
        const { liveCells, CELL_SIZE } = data;
        this.offCtx.fillStyle = "rgba(0, 0, 0, 0.1)";
        this.offCtx.fillRect(0, 0, this.offscreen.width, this.offscreen.height);
        this.offCtx.fillStyle = "rgba(0,255,0,1)";
        for ( let [y, row] of liveCells.entries() ) {
            for (let x of row) {
                const h = (x + y) % 360;
                this.offCtx.fillStyle = this.colorPalette[h];
                this.offCtx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.offscreen, 0, 0);
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;    
    }
}

class GameOfLife {
    constructor(cfg) {
        this.CELL_SIZE = cfg.CELL_SIZE;
        this.COLS = cfg.COLS;
        this.ROWS = cfg.ROWS; 
        this.view = new Renderer(cfg);
        this.liveCells = new Map();
        this.neighborCounts = new Map();
        this.paused = false;
        this.gliders = [
            [[0,2],[1,0],[1,2],[2,1],[2,2]],
            [[0,1],[0,2],[1,0],[1,1],[2,1]],
            [[0,0],[1,0],[1,2],[2,0],[2,1]],
            [[0,1],[1,1],[1,2],[2,0],[2,1]]
        ];
    }
    seedGrid(density = 0.05) {
        for (let y = 0; y < this.ROWS; y++) {
            for (let x = 0; x < this.COLS; x++) {
                if (Math.random() < density) {
                    if ( ! this.liveCells.has(y) ) 
                        this.liveCells.set(y, new Set());
                this.liveCells.get(y).add(x);
                }
            }
        }
    }
    getCell(x, y) {
        x = (x + this.COLS) % this.COLS;
        y = (y + this.ROWS) % this.ROWS;
        return this.liveCells.has(y) && this.liveCells.get(y).has(x);
    }
    countNeighbor(x, y) {
        const nx = (x + this.COLS) % this.COLS;
        const ny = (y + this.ROWS) % this.ROWS;
        const key = ny * this.COLS + nx;
        this.neighborCounts.set(key, (this.neighborCounts.get(key) || 0) + 1);
    }
    countNeighbors() {
        this.neighborCounts.clear();

        // Count neighbors of live cells
        for (let [y, row] of this.liveCells.entries()) {
            for (let x of row) {
                this.countNeighbor(x - 1, y - 1);
                this.countNeighbor(x,     y - 1);
                this.countNeighbor(x + 1, y - 1);

                this.countNeighbor(x - 1, y);
                this.countNeighbor(x + 1, y);

                this.countNeighbor(x - 1, y + 1);
                this.countNeighbor(x,     y + 1);
                this.countNeighbor(x + 1, y + 1);
            }
        }
    }
    keyToCoords(key) {
        return [key % this.COLS, Math.floor(key / this.COLS)];
    }
    getNextGeneration() {
        const newLive = new Map();

        // Determine next generation
        for (let [key, count] of this.neighborCounts.entries()) {
            const [x, y] = this.keyToCoords(key);
            const alive = this.getCell(x, y);
            if ( (alive && (count === 2 || count === 3)) || (!alive && count === 3) ) {
                if ( ! newLive.has(y) ) 
                    newLive.set(y, new Set());
                newLive.get(y).add(x);
            }
        }
        this.liveCells = newLive;
    }
    spawnRandomGlider() {
        const pattern = this.gliders[Math.floor(Math.random() * this.gliders.length)];
        const offsetX = Math.floor(Math.random() * (this.COLS - 3));
        const offsetY = Math.floor(Math.random() * (this.ROWS - 3));
        for ( let [dx, dy] of pattern ) {
            const x = (offsetX + dx + this.COLS) % this.COLS;
            const y = (offsetY + dy + this.ROWS) % this.ROWS;

            if ( ! this.liveCells.has(y) ) {
                this.liveCells.set(y, new Set());
            }
            this.liveCells.get(y).add(x);
        }
    }
    tick() {
        this.spawnRandomGlider();
        this.countNeighbors();
        this.getNextGeneration();
        return {
            "liveCells": this.liveCells,
            "CELL_SIZE": this.CELL_SIZE
        };
    }        
}

class GraphicsController {
    constructor(model, config) {
        this.model = model;
        this.view = new Renderer(config);
        this.paused = false;
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
            const data = this.model.tick();
            this.view.draw(data);
        }
        requestAnimationFrame(this.loop.bind(this));        
    }    
}

window.addEventListener("DOMContentLoaded", () => {
    const config = {"CELL_SIZE": 3, "COLS": 640, "ROWS": 360 };
    const model = new GameOfLife(config);
    const controller = new GraphicsController(model, config);
    window.addEventListener("resize", controller.resize.bind(controller));
    controller.resize();
    controller.loop();
});
