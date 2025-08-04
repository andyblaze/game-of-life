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
    }
    draw(liveCells, cellSz) {
        this.offCtx.clearRect(0, 0, this.offscreen.width, this.offscreen.height);
        this.offCtx.fillStyle = '#0f0';

        for ( let [y, row] of liveCells.entries() ) {
            for (let x of row) {
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

class GameEngine {
    constructor() {
        this.CELL_SIZE = 3;
        this.COLS = 640;
        this.ROWS = 360; 
        this.canvasses = new Canvasses(this.COLS * this.CELL_SIZE, this.ROWS * this.CELL_SIZE);
        this.liveCells = new Map();
    }
    resize() {
        this.canvasses.resize();
    }


      // Seed random cells (~5% alive)
      seedGrid(density = 0.05) {
        for (let y = 0; y < this.ROWS; y++) {
          for (let x = 0; x < this.COLS; x++) {
            if (Math.random() < density) {
              if ( ! this.liveCells.has(y)) this.liveCells.set(y, new Set());
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

      step() {
        const neighborCounts = new Map();

        // Count neighbors of live cells
for (let [y, row] of this.liveCells.entries()) {
  for (let x of row) {

    // Top row
    let nx = (x - 1 + this.COLS) % this.COLS;
    let ny = (y - 1 + this.ROWS) % this.ROWS;
    neighborCounts.set(ny * this.COLS + nx, (neighborCounts.get(ny * this.COLS + nx) || 0) + 1);

    nx = x;
    neighborCounts.set(ny * this.COLS + nx, (neighborCounts.get(ny * this.COLS + nx) || 0) + 1);

    nx = (x + 1) % this.COLS;
    neighborCounts.set(ny * this.COLS + nx, (neighborCounts.get(ny * this.COLS + nx) || 0) + 1);

    // Middle row
    ny = y;
    nx = (x - 1 + this.COLS) % this.COLS;
    neighborCounts.set(ny * this.COLS + nx, (neighborCounts.get(ny * this.COLS + nx) || 0) + 1);

    nx = (x + 1) % this.COLS;
    neighborCounts.set(ny * this.COLS + nx, (neighborCounts.get(ny * this.COLS + nx) || 0) + 1);

    // Bottom row
    ny = (y + 1) % this.ROWS;
    nx = (x - 1 + this.COLS) % this.COLS;
    neighborCounts.set(ny * this.COLS + nx, (neighborCounts.get(ny * this.COLS + nx) || 0) + 1);

    nx = x;
    neighborCounts.set(ny * this.COLS + nx, (neighborCounts.get(ny * this.COLS + nx) || 0) + 1);

    nx = (x + 1) % this.COLS;
    neighborCounts.set(ny * this.COLS + nx, (neighborCounts.get(ny * this.COLS + nx) || 0) + 1);
  }
}

        const newLive = new Map();

        // Determine next generation
        for (let [key, count] of neighborCounts.entries()) {
          const x = key % this.COLS;
          const y = Math.floor(key / this.COLS);
          const alive = this.getCell(x, y);
          if ((alive && (count === 2 || count === 3)) || (!alive && count === 3)) {
            if (!newLive.has(y)) newLive.set(y, new Set());
            newLive.get(y).add(x);
          }
        }

        this.liveCells = newLive;
      }        

    loop() {
        this.step();
        this.canvasses.draw(this.liveCells, this.CELL_SIZE);
        requestAnimationFrame(this.loop.bind(this));        
    }
}

$(document).ready(function() {

    
        

const life = new GameEngine();
window.addEventListener('resize', life.resize);
life.resize();  // initial call on load
life.seedGrid(0.05);
life.loop();
    
});

