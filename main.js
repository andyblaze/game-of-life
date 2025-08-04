

$(document).ready(function() {

    
        
      const CELL_SIZE = 3;
      let COLS = 640;
      let ROWS = 360;
      


      
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

      const canvas = document.getElementById('gol');
      canvas.width = COLS * CELL_SIZE;
      canvas.height = ROWS * CELL_SIZE;
      const ctx = canvas.getContext('2d');

      const offscreen = document.createElement('canvas');
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      const offCtx = offscreen.getContext('2d');

      // Sparse grid: Map<y, Set<x>>
      let liveCells = new Map();

      // Seed random cells (~5% alive)
      function seedGrid(density = 0.05) {
        for (let y = 0; y < ROWS; y++) {
          for (let x = 0; x < COLS; x++) {
            if (Math.random() < density) {
              if (!liveCells.has(y)) liveCells.set(y, new Set());
              liveCells.get(y).add(x);
            }
          }
        }
      }

      function getCell(x, y) {
        x = (x + COLS) % COLS;
        y = (y + ROWS) % ROWS;
        return liveCells.has(y) && liveCells.get(y).has(x);
      }

      function step() {
        const neighborCounts = new Map();

        // Count neighbors of live cells
        for (let [y, row] of liveCells.entries()) {
          for (let x of row) {
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                const nx = (x + dx + COLS) % COLS;
                const ny = (y + dy + ROWS) % ROWS;
                const key = ny * COLS + nx;
                if (dx === 0 && dy === 0) continue;
                neighborCounts.set(key, (neighborCounts.get(key) || 0) + 1);
              }
            }
          }
        }

        const newLive = new Map();

        // Determine next generation
        for (let [key, count] of neighborCounts.entries()) {
          const x = key % COLS;
          const y = Math.floor(key / COLS);
          const alive = getCell(x, y);
          if ((alive && (count === 2 || count === 3)) || (!alive && count === 3)) {
            if (!newLive.has(y)) newLive.set(y, new Set());
            newLive.get(y).add(x);
          }
        }

        liveCells = newLive;
      }

      function draw() {
        offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
        offCtx.fillStyle = '#0f0';

        for (let [y, row] of liveCells.entries()) {
          for (let x of row) {
            offCtx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          }
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(offscreen, 0, 0);
      }
      


function loop() {
  step();
  draw();
  requestAnimationFrame(loop);
}



window.addEventListener('resize', resizeCanvas);
resizeCanvas();  // initial call on load

      seedGrid(0.1);
      loop();
    
});

