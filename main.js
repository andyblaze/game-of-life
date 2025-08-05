class Canvasses {
    constructor(w, h) {
        this.canvas = document.getElementById('gol');
        this.canvas.width = w;
        this.canvas.height = h;
        this.ctx = this.canvas.getContext('2d');

        this.offscreen = document.createElement('canvas');
        this.offscreen.width = this.canvas.width;
        this.offscreen.height = this.canvas.height;
        this.offCtx = this.offscreen.getContext('2d');
        this.colorPalette = Array.from({ length: 360 }, (_, h) => `hsl(${h}, 100%, 50%)`);
    }
    cellColor(x, y) {

    }
    draw(liveCells, cellSz) {
        this.offCtx.fillStyle = "rgba(0, 0, 0, 0.1)"; // tweak alpha
        this.offCtx.fillRect(0, 0, this.offscreen.width, this.offscreen.height);
        this.offCtx.fillStyle = "rgba(0,255,0,1)";
        for ( let [y, row] of liveCells.entries() ) {
            for (let x of row) {
                const h = (x + y) % 360;
                this.offCtx.fillStyle = this.colorPalette[h];
                this.offCtx.fillRect(x * cellSz, y * cellSz, cellSz, cellSz);
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

class LifeGame {
    constructor() {
        this.CELL_SIZE = 3;
        this.COLS = 640;
        this.ROWS = 360; 
        this.canvasses = new Canvasses(this.COLS * this.CELL_SIZE, this.ROWS * this.CELL_SIZE);
        this.liveCells = new Map();
        this.neighborCounts = new Map();
        this.gliders = [
            [[0,2],[1,0],[1,2],[2,1],[2,2]],
            [[0,1],[0,2],[1,0],[1,1],[2,1]],
            [[0,0],[1,0],[1,2],[2,0],[2,1]],
            [[0,1],[1,1],[1,2],[2,0],[2,1]]
        ];
    }
    resize() {
        this.canvasses.resize();
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
        // Pick a random glider pattern
        const pattern = this.gliders[Math.floor(Math.random() * this.gliders.length)];
        // Choose a safe random position (leave room to fit the glider)
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
    step() {
        this.countNeighbors();
        this.getNextGeneration();
    }        

    loop() {
        this.step();
        this.spawnRandomGlider(); // <- insert 1 glider per frame
        this.canvasses.draw(this.liveCells, this.CELL_SIZE);
        requestAnimationFrame(this.loop.bind(this));        
    }
}

$(document).ready(function() {
    const life = new LifeGame();
    window.addEventListener('resize', life.resize);
    life.resize();  // initial call on load
    //life.seedGrid(0.06);
    life.loop();    
});

